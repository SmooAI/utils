import { StandardSchemaV1 } from '@standard-schema/spec';
import { SchemaError } from '@standard-schema/utils';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { formatStandardSchemaErrorToHumanReadable, handleSchemaValidation, HumanReadableSchemaError } from './standardSchema';

describe('Standard Schema Validation', () => {
    // Test schema using Zod (which implements Standard Schema)
    const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        age: z.number().min(0).max(120),
        address: z
            .object({
                street: z.string(),
                city: z.string(),
                country: z.string(),
            })
            .optional(),
    }) as unknown as StandardSchemaV1;

    describe('handleSchemaValidation', () => {
        it('should validate and return valid data', async () => {
            const validInput = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    country: 'USA',
                },
            };

            const result = await handleSchemaValidation(schema, validInput);
            expect(result).toEqual(validInput);
        });

        it('should throw HumanReadableSchemaError for invalid data', async () => {
            const invalidInput = {
                name: 'J', // Too short
                email: 'invalid-email', // Invalid email
                age: -1, // Invalid age
            };

            await expect(handleSchemaValidation(schema, invalidInput)).rejects.toThrow(HumanReadableSchemaError);
        });

        it('should handle async validation', async () => {
            const asyncSchema = z.promise(
                z.object({
                    name: z.string().min(2),
                    email: z.string().email(),
                    age: z.number().min(0).max(120),
                }),
            ) as unknown as StandardSchemaV1;

            const validInput = Promise.resolve({
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
            });

            const result = await handleSchemaValidation(asyncSchema, validInput);
            expect(result).toEqual(await validInput);
        });
    });

    describe('formatStandardSchemaErrorToHumanReadable', () => {
        it('should format single error message', () => {
            const issues = [
                {
                    message: 'Invalid email',
                    path: ['email'],
                },
            ];

            const result = formatStandardSchemaErrorToHumanReadable(issues);
            expect(result).toBe('Invalid email at "email"');
        });

        it('should format multiple error messages', () => {
            const issues = [
                {
                    message: 'Invalid email',
                    path: ['email'],
                },
                {
                    message: 'Name must be at least 2 characters',
                    path: ['name'],
                },
                {
                    message: 'Age must be greater than or equal to 0',
                    path: ['age'],
                },
            ];

            const result = formatStandardSchemaErrorToHumanReadable(issues);
            expect(result).toBe(
                '1. Invalid email at "email"\n' + '2. Name must be at least 2 characters at "name"\n' + '3. Age must be greater than or equal to 0 at "age"',
            );
        });

        it('should handle nested paths', () => {
            const issues = [
                {
                    message: 'Street is required',
                    path: ['address', 'street'],
                },
            ];

            const result = formatStandardSchemaErrorToHumanReadable(issues);
            expect(result).toBe('Street is required at "address.street"');
        });

        it('should handle empty issues array', () => {
            const result = formatStandardSchemaErrorToHumanReadable([]);
            expect(result).toBe('No validation errors');
        });

        it('should handle issues without paths', () => {
            const issues = [
                {
                    message: 'Invalid input',
                },
            ];

            const result = formatStandardSchemaErrorToHumanReadable(issues);
            expect(result).toBe('Invalid input');
        });
    });

    describe('HumanReadableSchemaError', () => {
        it('should contain both human-readable message and original schema error', () => {
            const issues = [
                {
                    message: 'Invalid email',
                    path: ['email'],
                },
            ];

            const schemaError = new SchemaError(issues);
            const humanReadableError = new HumanReadableSchemaError(schemaError);

            expect(humanReadableError.message).toBe('Invalid email at "email"');
            expect(humanReadableError.schemaError).toBe(schemaError);
            expect(humanReadableError.name).toBe('HumanReadableSchemaError');
        });
    });
});
