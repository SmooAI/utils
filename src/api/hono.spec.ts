/* eslint-disable @typescript-eslint/no-explicit-any -- ok */
import * as env from '@/env';
import { Hono } from 'hono';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createAwsLambdaHonoApp } from './hono';

// Mock dependencies
vi.mock('@/env');
vi.mock('@smooai/logger/AwsLambdaLogger', () => {
    return {
        default: class MockLogger {
            info = vi.fn();
            error = vi.fn();
            addContext = vi.fn();
            addLambdaContext = vi.fn();
        },
    };
});

describe('createAwsLambdaHonoApp', () => {
    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
    });

    it('should create a Hono app with middleware', async () => {
        const appFunction = (app: Hono) => {
            app.get('/test', (c) => c.json({ message: 'success' }));
            return app;
        };

        const handler = createAwsLambdaHonoApp(appFunction);
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

        const appFunction = (app: Hono) => {
            app.post('/validate', async (c) => {
                const body = await c.req.json();
                schema.parse(body);
                return c.json({ success: true });
            });
            return app;
        };

        const handler = createAwsLambdaHonoApp(appFunction);
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

        await expect(handler(event as any)).rejects.toThrow('Expected string, received number');
    });

    it('should add pretty JSON middleware when running locally', async () => {
        vi.mocked(env.isRunningLocally).mockReturnValue(true);

        const appFunction = (app: Hono) => {
            app.get('/test', (c) => c.json({ message: 'success' }));
            return app;
        };

        const handler = createAwsLambdaHonoApp(appFunction);
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
