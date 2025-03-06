import { E164Number, parsePhoneNumberWithError, PhoneNumber } from 'libphonenumber-js';
import { RefinementCtx, z } from 'zod';

export function validateAndTransformPhoneNumber(value: string | undefined, context: RefinementCtx): E164Number | undefined {
    let phoneNumber: PhoneNumber;
    if (!value) return undefined;
    try {
        phoneNumber = parsePhoneNumberWithError(value, 'US');
    } catch (error) {
        let errorMessage = `Unable to parse phone number (${value}) and convert into E.164 format.`;
        if (error instanceof Error) {
            errorMessage += ` Error: ${error.message}`;
        }
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessage,
        });

        return z.NEVER;
    }

    return phoneNumber.number;
}
