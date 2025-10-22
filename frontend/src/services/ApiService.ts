import { API_URL } from '../utils/constants';
import type {
    ApiResponse,
    CheckBalanceRequest,
    CheckBalanceResponse,
    RegisterClientRequest,
    RegisterClientResponse,
    LoadWalletRequest,
    LoadWalletResponse,
    InitPaymentRequest,
    InitPaymentResponse,
    ConfirmPaymentRequest,
    ConfirmPaymentResponse
} from '../types';

class ApiService {
    private apiUrl: string = API_URL;
    public async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.apiUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                ...options,
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                const errorMessage = errorBody.message || `Error del servidor: ${response.status} ${response.statusText}`;

                return { success: false, message: errorMessage, data: undefined };
            }

            const data = await response.json();
            return { success: true, message: data.message || 'Operación exitosa', data: data as T };

        } catch (error) {
            const message = error instanceof Error
                ? `Error de conexión: ${error.message}`
                : 'Error de red desconocido.';

            return { success: false, message, data: undefined };
        }
    }

    public registerClient(data: RegisterClientRequest): Promise<ApiResponse<RegisterClientResponse>> {
        return this.request<RegisterClientResponse>(`/client/register`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    public checkBalance(data: CheckBalanceRequest): Promise<ApiResponse<CheckBalanceResponse>> {
        return this.request<CheckBalanceResponse>(`/wallet/balance`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    public loadWallet(data: LoadWalletRequest): Promise<ApiResponse<LoadWalletResponse>> {
        return this.request<LoadWalletResponse>(`/wallet/load`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    public initPayment(data: InitPaymentRequest): Promise<ApiResponse<InitPaymentResponse>> {
        return this.request<InitPaymentResponse>(`/payment/init`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    public confirmPayment(data: ConfirmPaymentRequest): Promise<ApiResponse<ConfirmPaymentResponse>> {
        return this.request<ConfirmPaymentResponse>(`/payment/confirm`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiService = new ApiService();
