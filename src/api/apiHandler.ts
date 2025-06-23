/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '@/api/ApiError';
import { errorHandler } from '@/error/errorHandler';
import { HumanReadableSchemaError } from '@/validation/standardSchema';
import ServerLogger from '@smooai/logger/AwsServerLogger';
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context, EventBridgeEvent } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const logger = new ServerLogger();

export type LambdaResponseOrError<T = any> = Omit<APIGatewayProxyStructuredResultV2, 'body'> & {
    body?: T | string | { error: { message: string } & Record<string, any> };
};

export async function lambdaApiHandler<T = any>(
    event: APIGatewayProxyEventV2,
    context: Context,
    handler: (event: APIGatewayProxyEventV2, context: Context) => Promise<LambdaResponseOrError<T>>,
): Promise<APIGatewayProxyStructuredResultV2> {
    try {
        logger.addLambdaContext(event, context);
        return (await errorHandler<[APIGatewayProxyEventV2, Context], APIGatewayProxyStructuredResultV2>(
            async (event: APIGatewayProxyEventV2, context: Context) => {
                const response = await handler(event, context);
                const awsLambdaResponse: APIGatewayProxyStructuredResultV2 = {
                    ...response,
                    body: response.body ? (typeof response.body === 'string' ? response.body : JSON.stringify(response.body)) : undefined,
                };
                return awsLambdaResponse;
            },
            event,
            context,
        )) as Promise<APIGatewayProxyStructuredResultV2>;
    } catch (error) {
        if (error instanceof ApiError) {
            logger.error(error, `An API error occurred: Status: ${error.status} (${error.statusText}); Message: ${error.message}`);
            return {
                body: JSON.stringify({
                    error: { message: error.message, statusText: error.statusText },
                }),
                statusCode: error.status,
                headers: { 'Content-type': 'application/json' },
            };
        } else if (error instanceof HumanReadableSchemaError) {
            logger.error(error, `A schema validation error occurred: ${error.message}`);
            return {
                body: JSON.stringify({
                    error: {
                        message: error.message,
                        statusText: getReasonPhrase(StatusCodes.BAD_REQUEST),
                    },
                }),
                statusCode: StatusCodes.BAD_REQUEST,
                headers: { 'Content-type': 'application/json' },
            };
        } else if (error instanceof ZodError) {
            const validationError = fromZodError(error);
            logger.error(error, `A validation error occurred: ${validationError}`);
            return {
                body: JSON.stringify({
                    error: {
                        message: error.message,
                        statusText: getReasonPhrase(StatusCodes.BAD_REQUEST),
                    },
                }),
                statusCode: StatusCodes.BAD_REQUEST,
                headers: { 'Content-type': 'application/json' },
            };
        } else if (error instanceof Error) {
            logger.error(error, `An unexpected error occurred: ${error.message}`);
            return {
                body: JSON.stringify({
                    error: {
                        message: error.message,
                        statusText: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                    },
                }),
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                headers: { 'Content-type': 'application/json' },
            };
        } else {
            logger.error(error, `An unexpected error occurred: ${error}`);
            return {
                body: JSON.stringify({
                    error: {
                        message: 'An unexpected error occurred.',
                        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                        statusText: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                        headers: { 'Content-type': 'application/json' },
                    },
                }),
            };
        }
    }
}

export async function eventBridgeHandler(
    event: EventBridgeEvent<any, any>,
    context: Context,
    handler: (event: EventBridgeEvent<any, any>, context: Context) => Promise<void>,
): Promise<void> {
    try {
        logger.addLambdaContext(undefined, context);
        return (await errorHandler<[EventBridgeEvent<any, any>, Context], void>(
            async (event: EventBridgeEvent<any, any>, context: Context) => {
                await handler(event, context);
            },
            event,
            context,
        )) as void;
    } catch (error) {
        if (error instanceof ApiError) {
            logger.error(error, `An API error occurred: Status: ${error.status} (${error.statusText}); Message: ${error.message}`);
        } else if (error instanceof HumanReadableSchemaError) {
            logger.error(error, `A schema validation error occurred: ${error.message}`);
        } else if (error instanceof ZodError) {
            const validationError = fromZodError(error);
            logger.error(error, `A validation error occurred: ${validationError}`);
        } else if (error instanceof Error) {
            logger.error(error, `An unexpected error occurred: ${error.message}`);
        } else {
            logger.error(error, `An unexpected error occurred: ${error}`);
        }
    }
}
