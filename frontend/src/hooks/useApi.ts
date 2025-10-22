import { useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { ApiResponse } from '../types';

export const useApi = () => {
    const fetchApi = useCallback(<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
        return apiService.request<T>(endpoint, options);
    }, []);

    return {
        fetchApi,
        checkBalance: apiService.checkBalance.bind(apiService),
        registerClient: apiService.registerClient.bind(apiService),
        loadWallet: apiService.loadWallet.bind(apiService),
        initPayment: apiService.initPayment.bind(apiService),
        confirmPayment: apiService.confirmPayment.bind(apiService),
    };
};