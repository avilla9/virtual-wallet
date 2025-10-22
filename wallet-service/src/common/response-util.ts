import type { ApiResponse, ResponseStatus } from './types';

export function generateStandardResponse<T>(
    status: ResponseStatus,
    code: string,
    message: string,
    data?: T
): ApiResponse<T> {
    const response: ApiResponse<T> = {
        status,
        code,
        message,
    };
    if (data !== undefined) {
        response.data = data;
    }
    return response;
}