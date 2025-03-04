import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { logger as honoLogger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { prettyJSON } from 'hono/pretty-json';
import { handle, LambdaEvent, LambdaContext } from 'hono/aws-lambda';
import AwsLambdaLogger from '@smooai/logger/AwsLambdaLogger';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { isRunningLocally } from './env';

const logger = new AwsLambdaLogger();

export function createAwsLambdaHonoApp(appFunction: (app: Hono) => Hono): ReturnType<typeof handle> {
    const app = new Hono();

    app.use(requestId());
    app.use(
        honoLogger((str, ...rest) => {
            logger.info(str, ...rest);
        }),
    );
    app.use(async (c, next) => {
        logger.addContext({
            honoRequestId: c.get('requestId'),
        })
        await next();
    });
    if (isRunningLocally()) {
        app.use(prettyJSON());
    }

    app.onError((error) => {
        if (error instanceof ZodError) {
            const validationError = fromZodError(error);
            logger.error(error, `A validation error occurred: ${validationError.toString()}`);
            throw new HTTPException(400, {
                cause: error,
                message: validationError.toString(),
            });
        }
        throw error;
    });

    const appWithRoutes = appFunction(app);
    return (event: LambdaEvent, lambdaContext?: LambdaContext) => {
        logger.addLambdaContext(event as unknown as APIGatewayProxyEventV2, lambdaContext as unknown as Context);
        return handle(appWithRoutes)(event, lambdaContext);
    };
}
