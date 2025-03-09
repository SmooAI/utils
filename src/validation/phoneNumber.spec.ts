import { describe, it, expect, vi } from 'vitest';
import { validateAndTransformPhoneNumber } from './phoneNumber';
import { RefinementCtx } from 'zod';

describe('validateAndTransformPhoneNumber', () => {
    // Mock RefinementCtx
    const createMockContext = (): RefinementCtx => ({
        addIssue: vi.fn(),
        path: [],
    });

    it('should return undefined for undefined input', () => {
        const context = createMockContext();
        const result = validateAndTransformPhoneNumber(undefined, context);
        expect(result).toBeUndefined();
    });

    it('should transform valid US phone number to E.164 format', () => {
        const context = createMockContext();
        const validNumbers = [
            ['(555) 123-4567', '+15551234567'],
            ['555-123-4567', '+15551234567'],
            ['5551234567', '+15551234567'],
            ['+1 555-123-4567', '+15551234567'],
        ];

        validNumbers.forEach(([input, expected]) => {
            const result = validateAndTransformPhoneNumber(input, context);
            expect(result).toBe(expected);
        });
    });

    it('should handle invalid phone numbers', () => {
        const context = createMockContext();
        const invalidNumbers = [
            'not-a-number',
            '++1234567890', // invalid format
        ];

        invalidNumbers.forEach((input) => {
            const result = validateAndTransformPhoneNumber(input, context);
            expect(result).toMatchObject({
                status: 'aborted',
            });
            expect(context.addIssue).toHaveBeenCalledWith({
                code: 'custom',
                message: expect.stringContaining('Unable to parse phone number'),
            });
        });
    });
});
