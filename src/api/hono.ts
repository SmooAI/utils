import { isRunningLocally } from '@/env';
import { HumanReadableSchemaError } from '@/validation/standardSchema';
import AwsServerLogger from '@smooai/logger/AwsServerLogger';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { Hono } from 'hono';
import { handle, LambdaContext, LambdaEvent } from 'hono/aws-lambda';
import { HTTPException } from 'hono/http-exception';
import { logger as honoLogger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const logger = new AwsServerLogger();

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepting any hono generic
export function addHonoMiddleware(_app: Hono<any>): Hono<any> {
    const app = _app ?? new Hono();

    app.use(requestId());
    app.use(
        honoLogger((str, ...rest) => {
            logger.info(str, ...rest);
        }),
    );
    app.use(async (c, next) => {
        logger.addContext({
            honoRequestId: c.get('requestId'),
        });
        await next();
    });
    if (isRunningLocally()) {
        app.use(prettyJSON());
    }

    app.onError((error) => {
        if (error instanceof HumanReadableSchemaError) {
            logger.error(error, `A schema validation error occurred: ${error.message}`);
            throw new HTTPException(400, {
                cause: error,
                message: error.message,
            });
        } else if (error instanceof ZodError) {
            const validationError = fromZodError(error);
            logger.error(error, `A validation error occurred: ${validationError.toString()}`);
            throw new HTTPException(400, {
                cause: error,
                message: validationError.toString(),
            });
        }
        throw error;
    });

    return app;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepting any hono generic
export function createHonoAwsLambdaHandler(app: Hono<any>): ReturnType<typeof handle> {
    return (event: LambdaEvent, lambdaContext?: LambdaContext) => {
        logger.addLambdaContext(event as unknown as APIGatewayProxyEventV2, lambdaContext as unknown as Context);
        return handle(app)(event, lambdaContext);
    };
}
