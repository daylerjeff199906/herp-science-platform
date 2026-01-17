export class ApiError extends Error {
    public statusCode: number;
    public details?: unknown;

    constructor(message: string, statusCode: number, details?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.details = details;

        // Maintain proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    static isApiError(error: unknown): error is ApiError {
        return error instanceof ApiError;
    }
}
