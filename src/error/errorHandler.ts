/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { ApiError } from '@/api/ApiError';
import ServerLogger from '@smooai/logger/AwsLambdaLogger';
const logger = new ServerLogger();

export async function errorHandler<T extends any[] = any[], R = any>(
    handler: (...args: T) => Promise<R | PromiseSettledResult<R>[]>,
    ...args: T
): Promise<R | PromiseSettledResult<R>[]> {
    try {
        return await handler(...args);
    } catch (error) {
        if (error instanceof ApiError) {
            logger.error(error, `An API error occurred: Status: ${error.status} (${error.statusText}); Message: ${error.message}`);
            throw error;
        } else if (error instanceof ZodError) {
            const validationError = fromZodError(error);
            logger.error(error, `A validation error occurred: ${validationError.toString()}`);
            throw error;
        } else if (error instanceof Error) {
            logger.error(error, `An unexpected error occurred: ${error.message}`);
            throw error;
        } else {
            logger.error(error, `An unexpected error occurred: ${error}`);
            throw error;
        }
    }
}
