import { ApiError } from '@/api/ApiError';
import { HumanReadableSchemaError } from '@/validation/standardSchema';
import ServerLogger from '@smooai/logger/AwsLambdaLogger';
import type { Context, SQSBatchItemFailure, SQSBatchResponse, SQSEvent, SQSRecord } from 'aws-lambda';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const logger = new ServerLogger();

export type JsonSQSRecord = Omit<SQSRecord, 'body'> & { body: Record<string, unknown> };

export async function sqsHandler(
    event: SQSEvent,
    context: Context,
    handler: (event: JsonSQSRecord, context: Context) => Promise<void>,
): Promise<SQSBatchResponse> {
    try {
        const batchItemFailures: SQSBatchItemFailure[] = [];
        logger.addLambdaContext(undefined, context);

        for (const record of event.Records) {
            try {
                logger.addSQSRecordContext(record);
                const jsonRecord: JsonSQSRecord = {
                    ...record,
                    body: record.body ? JSON.parse(record.body) : {},
                };
                await handler(jsonRecord, context);
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

                batchItemFailures.push({ itemIdentifier: record.messageId });
            }
        }

        return { batchItemFailures };
    } catch (error) {
        logger.error(error, `An unexpected error occurred: ${error}`);
        throw error;
    }
}
