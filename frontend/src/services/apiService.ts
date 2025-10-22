import type { ApiResponse, ClientData, RequestOptions } from '../types';
import { API_URL } from '../utils/constants';

class ApiService {
    private baseURL: string;

    constructor(baseURL: string = API_URL) {
        this.baseURL = baseURL;
    }

    async request<T = any>(
        endpoint: string,
        options: RequestInit = {},
        retries: number = 3
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const finalBody = options.body && typeof options.body !== 'string'
                ? JSON.stringify(options.body)
                : options.body;
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                body: finalBody as BodyInit,
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || data.message || `Error ${response.status}: Ha ocurrido un problema.`;
                throw new Error(errorMessage);
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error en la llamada API:', endpoint, error);

            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return this.request<T>(endpoint, options, retries - 1);
            }

            return {
                success: false,
                message: error instanceof Error ? error.message : "Error de red o del servidor."
            };
        }
    }

    private async requestJson<TResponse = any, TBody extends object = object>(
        url: string,
        body: TBody,
        method: 'POST' | 'PUT' | 'PATCH' = 'POST'
    ): Promise<ApiResponse<TResponse>> {
        const jsonBody = JSON.stringify(body);
        const options: RequestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonBody as any,
        };
        return this.request<TResponse>(url, options);
    }

    // Métodos específicos para cada endpoint
    async checkBalance(body: { document: string; phone: string }) {
        return this.requestJson<{ balance: number }>('/wallet/balance', body, 'POST');
    }

    async registerClient(body: ClientData) {
        return this.requestJson('/client/register', body, 'POST');
    }

    async loadWallet(body: { document: string; phone: string; amount: number }) {
        return this.requestJson('/wallet/load', body, 'POST');
    }

    async initPayment(body: { document: string; phone: string; amount: number }) {
        return this.requestJson<{ sessionId: string; token: string }>('/payment/init', body, 'POST');
    }

    async confirmPayment(body: { sessionId: string; token: string }) {
        return this.requestJson('/payment/confirm', body, 'POST');
    }
}

export const apiService = new ApiService();