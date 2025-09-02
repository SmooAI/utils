/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '@/api/ApiError';
import { HumanReadableSchemaError } from '@/validation/standardSchema';
import ServerLogger from '@smooai/logger/AwsServerLogger';
import { z, ZodError } from 'zod';

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
        } else if (error instanceof HumanReadableSchemaError) {
            logger.error(error, `A schema validation error occurred: ${error.message}`);
            throw error;
        } else if (error instanceof ZodError) {
            const prettyError = z.prettifyError(error);
            logger.error(error, `A validation error occurred: ${prettyError}`);
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
