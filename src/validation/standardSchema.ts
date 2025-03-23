import { StandardSchemaV1 } from '@standard-schema/spec';
import { getDotPath, SchemaError } from '@standard-schema/utils';

type Issue = StandardSchemaV1.Issue;

/**
 * Error that wraps a SchemaError with a human-readable message.
 * This error provides both a human-readable message for display
 * and access to the original SchemaError for detailed validation information.
 *
 * @example
 * try {
 *   await handleSchemaValidation(schema, input);
 * } catch (error) {
 *   if (error instanceof HumanReadableSchemaError) {
 *     // Get the human-readable message
 *     console.error(error.message);
 *     // Access the original SchemaError for detailed validation info
 *     console.error(error.schemaError);
 *   }
 * }
 */
export class HumanReadableSchemaError extends Error {
    constructor(public readonly schemaError: SchemaError) {
        super(formatStandardSchemaErrorToHumanReadable(schemaError.issues));
        this.name = 'HumanReadableSchemaError';
    }
}

/**
 * Formats validation issues into a human-readable message.
 * This function takes an array of validation issues and formats them
 * into a string that's easy to read and understand, including the path
 * to the invalid field.
 *
 * @param issues - Array of validation issues from Standard Schema validation
 * @returns A human-readable string describing the validation errors
 *
 * @example
 * // Single error
 * formatStandardSchemaErrorToHumanReadable([{
 *   message: "Invalid email",
 *   path: ["user", "email"]
 * }])
 * // Returns: "Invalid email at "user.email""
 *
 * // Multiple errors
 * formatStandardSchemaErrorToHumanReadable([
 *   { message: "Invalid email", path: ["user", "email"] },
 *   { message: "Required", path: ["user", "name"] }
 * ])
 * // Returns:
 * // "1. Invalid email at "user.email"
 * // 2. Required at "user.name""
 *
 * // No errors
 * formatStandardSchemaErrorToHumanReadable([])
 * // Returns: "No validation errors"
 */
export function formatStandardSchemaErrorToHumanReadable(issues: ReadonlyArray<Issue>): string {
    if (issues.length === 0) {
        return 'No validation errors';
    }

    if (issues.length === 1) {
        const issue = issues[0];
        const dotPath = getDotPath(issue);
        const pathString = dotPath ? ` at "${dotPath}"` : '';
        return `${issue.message}${pathString}`;
    }

    return issues
        .map((issue, index) => {
            const dotPath = getDotPath(issue);
            const pathString = dotPath ? ` at "${dotPath}"` : '';
            return `${index + 1}. ${issue.message}${pathString}`;
        })
        .join('\n');
}

/**
 * Validates input against a schema and returns the typed value.
 * This function handles both synchronous and asynchronous validation,
 * and throws a HumanReadableSchemaError if validation fails.
 *
 * @param schema - The Standard Schema to validate against
 * @param input - The input value to validate
 * @returns The validated and typed output value
 * @throws {HumanReadableSchemaError} If validation fails
 *
 * @example
 * // Basic usage
 * const value = await handleSchemaValidation(schema, input);
 *
 * // With error handling
 * try {
 *   const value = await handleSchemaValidation(schema, input);
 *   // value is properly typed as StandardSchemaV1.InferOutput<T>
 * } catch (error) {
 *   if (error instanceof HumanReadableSchemaError) {
 *     console.error(error.message); // Human readable message
 *     console.error(error.schemaError); // Original SchemaError
 *   }
 * }
 */
export async function handleSchemaValidation<T extends StandardSchemaV1>(
    schema: T,
    input: StandardSchemaV1.InferInput<T>,
): Promise<StandardSchemaV1.InferOutput<T>> {
    let result = schema['~standard'].validate(input);
    if (result instanceof Promise) result = await result;

    if (result.issues) {
        const schemaError = new SchemaError(result.issues);
        throw new HumanReadableSchemaError(schemaError);
    }

    return result.value;
}
