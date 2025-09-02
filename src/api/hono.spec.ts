/* eslint-disable @typescript-eslint/no-explicit-any -- ok */
import * as env from '@/env';
import { Hono } from 'hono';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { addHonoMiddleware, createHonoAwsLambdaHandler } from './hono';

// Mock dependencies
vi.mock('@/env');
vi.mock('@smooai/logger/AwsServerLogger', () => {
    return {
        default: class MockLogger {
            info = vi.fn();
            error = vi.fn();
            addContext = vi.fn();
            addLambdaContext = vi.fn();
        },
    };
});

describe('addHonoMiddleware', () => {
    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
    });

    it('should create a Hono app with middleware', async () => {
        const app = new Hono();
        app.get('/test', (c) => c.json({ message: 'success' }));

        const middlewaredApp = addHonoMiddleware(app);
        const handler = createHonoAwsLambdaHandler(middlewaredApp);
        const event = {
            version: '2.0',
            rawPath: '/test',
            routeKey: '$default',
            rawQueryString: '',
            body: '',
            requestContext: {
                http: {
                    method: 'GET',
                    path: '/test',
                    protocol: 'HTTP/1.1',
                    sourceIp: '127.0.0.1',
                    userAgent: 'test',
                },
                requestId: 'test-id',
                timeEpoch: Date.now(),
            },
            isBase64Encoded: false,
            headers: {
                'content-type': 'application/json',
            },
        };

        const response = await handler(event as any);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({ message: 'success' });
    });

    it('should handle ZodError correctly', async () => {
        const schema = z.object({
            name: z.string(),
        });

        const app = new Hono();
        app.post('/validate', async (c) => {
            const body = await c.req.json();
            schema.parse(body);
            return c.json({ success: true });
        });

        const middlewaredApp = addHonoMiddleware(app);
        const handler = createHonoAwsLambdaHandler(middlewaredApp);
        const event = {
            version: '2.0',
            rawPath: '/validate',
            routeKey: '$default',
            rawQueryString: '',
            requestContext: {
                http: {
                    method: 'POST',
                    path: '/validate',
                    protocol: 'HTTP/1.1',
                    sourceIp: '127.0.0.1',
                    userAgent: 'test',
                },
                requestId: 'test-id',
                timeEpoch: Date.now(),
            },
            body: JSON.stringify({ name: 123 }),
            isBase64Encoded: false,
            headers: {
                'content-type': 'application/json',
            },
        };

        const response = await handler(event as any);
        expect(response.statusCode).toBe(400);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.error).toContain('expected string, received number');
        expect(responseBody.details).toBeDefined();
        expect(responseBody.details[0].code).toBe('invalid_type');
        expect(responseBody.details[0].expected).toBe('string');
        expect(responseBody.details[0].path).toEqual(['name']);
    });

    it('should add pretty JSON middleware when running locally', async () => {
        vi.mocked(env.isRunningLocally).mockReturnValue(true);

        const app = new Hono();
        app.get('/test', (c) => c.json({ message: 'success' }));

        const middlewaredApp = addHonoMiddleware(app);
        const handler = createHonoAwsLambdaHandler(middlewaredApp);
        const event = {
            version: '2.0',
            rawPath: '/test',
            routeKey: '$default',
            rawQueryString: '',
            body: '',
            requestContext: {
                http: {
                    method: 'GET',
                    path: '/test',
                    protocol: 'HTTP/1.1',
                    sourceIp: '127.0.0.1',
                    userAgent: 'test',
                },
                requestId: 'test-id',
                timeEpoch: Date.now(),
            },
            isBase64Encoded: false,
            headers: {
                'content-type': 'application/json',
            },
        };

        const response = await handler(event as any);
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
    });
});
