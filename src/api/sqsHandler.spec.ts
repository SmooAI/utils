import { ApiError } from '@/api/ApiError';
import { HumanReadableSchemaError } from '@/validation/standardSchema';
import { SchemaError } from '@standard-schema/utils';
import type { SQSEvent, SQSRecord } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { sqsHandler } from './sqsHandler';

describe('sqsHandler', () => {
    const mockContext = {
        functionName: 'test-function',
        awsRequestId: 'test-request-id',
    } as any;

    const mockHandler = vi.fn();

    const createMockSQSRecord = (messageId: string, body: string): SQSRecord => ({
        messageId,
        body,
        receiptHandle: 'mock-receipt-handle',
        attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1234567890',
            SenderId: 'mock-sender-id',
            ApproximateFirstReceiveTimestamp: '1234567890',
        },
        messageAttributes: {},
        md5OfBody: 'mock-md5',
        eventSource: 'aws:sqs',
        eventSourceARN: 'mock-arn',
        awsRegion: 'us-east-1',
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockHandler.mockReset();
    });

    it('should successfully process valid SQS records', async () => {
        const event: SQSEvent = {
            Records: [createMockSQSRecord('msg1', JSON.stringify({ test: 'data' }))],
        };

        await sqsHandler(event, mockContext, mockHandler);

        expect(mockHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                messageId: 'msg1',
                body: { test: 'data' },
            }),
            mockContext,
        );
    });

    it('should handle ApiError and report batch item failure', async () => {
        const event: SQSEvent = {
            Records: [createMockSQSRecord('msg1', JSON.stringify({ test: 'data' }))],
        };

        const apiError = new ApiError(400, 'Bad Request');
        mockHandler.mockRejectedValueOnce(apiError);

        const result = await sqsHandler(event, mockContext, mockHandler);

        expect(result.batchItemFailures).toHaveLength(1);
        expect(result.batchItemFailures[0].itemIdentifier).toBe('msg1');
    });

    it('should handle HumanReadableSchemaError and report batch item failure', async () => {
        const event: SQSEvent = {
            Records: [createMockSQSRecord('msg1', JSON.stringify({ test: 'data' }))],
        };

        const schemaError = new SchemaError([{ message: 'Invalid schema', path: ['test'] }]);
        const humanReadableError = new HumanReadableSchemaError(schemaError);
        mockHandler.mockRejectedValueOnce(humanReadableError);

        const result = await sqsHandler(event, mockContext, mockHandler);

        expect(result.batchItemFailures).toHaveLength(1);
        expect(result.batchItemFailures[0].itemIdentifier).toBe('msg1');
    });

    it('should handle ZodError and report batch item failure', async () => {
        const event: SQSEvent = {
            Records: [createMockSQSRecord('msg1', JSON.stringify({ test: 'data' }))],
        };

        const zodError = new ZodError([]);
        mockHandler.mockRejectedValueOnce(zodError);

        const result = await sqsHandler(event, mockContext, mockHandler);

        expect(result.batchItemFailures).toHaveLength(1);
        expect(result.batchItemFailures[0].itemIdentifier).toBe('msg1');
    });

    it('should handle general Error and report batch item failure', async () => {
        const event: SQSEvent = {
            Records: [createMockSQSRecord('msg1', JSON.stringify({ test: 'data' }))],
        };

        const error = new Error('General error');
        mockHandler.mockRejectedValueOnce(error);

        const result = await sqsHandler(event, mockContext, mockHandler);

        expect(result.batchItemFailures).toHaveLength(1);
        expect(result.batchItemFailures[0].itemIdentifier).toBe('msg1');
    });

    it('should handle empty body in SQS record', async () => {
        const event: SQSEvent = {
            Records: [createMockSQSRecord('msg1', '')],
        };

        await sqsHandler(event, mockContext, mockHandler);

        expect(mockHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                messageId: 'msg1',
                body: {},
            }),
            mockContext,
        );
    });

    it('should process multiple records and report individual failures', async () => {
        const event: SQSEvent = {
            Records: [createMockSQSRecord('msg1', JSON.stringify({ test: 'data1' })), createMockSQSRecord('msg2', JSON.stringify({ test: 'data2' }))],
        };

        mockHandler.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Failed'));

        const result = await sqsHandler(event, mockContext, mockHandler);

        expect(result.batchItemFailures).toHaveLength(1);
        expect(result.batchItemFailures[0].itemIdentifier).toBe('msg2');
    });
});
