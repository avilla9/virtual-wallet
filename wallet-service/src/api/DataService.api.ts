import axios from 'axios';
import type { IdentifyPayload, RegistrationPayload, UserWalletData, ApiResponse } from '../common/types.ts';

const REST1_URL = process.env.REST1_URL;
const API_PREFIX = '/api/data';

const client = axios.create({
    baseURL: `${REST1_URL}${API_PREFIX}`,
    timeout: 5000,
});

const handleAxiosError = (error: any): ApiResponse<any> => {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
        return error.response.data;
    }
    console.error('Error en DataServiceApi:', error.message);
    return {
        status: 'failure',
        code: '503_SERVICE_UNAVAILABLE',
        message: 'Servicio de Datos no disponible o error de red.',
    };
};

export class DataService {
    public async registerClient(data: RegistrationPayload): Promise<ApiResponse<UserWalletData>> {
        try {
            const response = await client.post('/register', data);
            return response.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    public async findWalletAndUser(data: IdentifyPayload): Promise<ApiResponse<UserWalletData>> {
        try {
            const response = await client.post('/wallet/find', data);
            return response.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    public async updateBalance(walletId: number, amount: number): Promise<ApiResponse<any>> {
        try {
            const response = await client.patch('/wallet/balance', { walletId, amount });
            return response.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }
}
