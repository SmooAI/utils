import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
    constructor(
        public status: StatusCodes,
        message: string,
        public statusText?: string,
    ) {
        super(message);
    }

    public static throw(status: StatusCodes, message: string, statusText?: string) {
        throw new ApiError(status, message, statusText || getReasonPhrase(status));
    }
}
