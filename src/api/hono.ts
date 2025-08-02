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
    app.use(async (c, next) => {
        honoLogger((str, ...rest) => {
            const namespace = `[${c.req.method}] ${c.req.path}`;
            logger.addRequestContext(c.req);
            logger.addContext({
                namespace,
                honoRequestId: c.get('requestId'),
            });
            logger.info(str, ...rest);
        });
        await next();
    });
    if (isRunningLocally()) {
        app.use(prettyJSON());
    }

    app.onError((error, c) => {
        if (error instanceof HumanReadableSchemaError) {
            logger.error(error, `A schema validation error occurred`);

            return c.json(
                {
                    error: error.message,
                    schemaError: error.schemaError,
                },
                400,
            );
        } else if (error instanceof ZodError) {
            const validationError = fromZodError(error);
            logger.error(validationError, `A validation error occurred`);

            return c.json(
                {
                    error: validationError.message,
                    details: validationError.details,
                },
                400,
            );
        } else if (error instanceof HTTPException) {
            logger.error(error, `An HTTP error occurred`);

            return error.getResponse();
        }

        logger.error(error, `An unknown error occurred`);
        return c.json(
            {
                error: error.message,
            },
            500,
        );
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
