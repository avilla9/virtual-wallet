import { useCallback } from 'react';
import { apiService } from '../services/ApiService';
import type { ApiResponse } from '../types';

export const useApi = () => {
    const fetchApi = useCallback(<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
        return apiService.request<T>(endpoint, options);
    }, []);

    const checkBalance = useCallback(
        apiService.checkBalance.bind(apiService),
        []
    );

    const registerClient = useCallback(
        apiService.registerClient.bind(apiService),
        []
    );

    const loadWallet = useCallback(
        apiService.loadWallet.bind(apiService),
        []
    );

    const initPayment = useCallback(
        apiService.initPayment.bind(apiService),
        []
    );

    const confirmPayment = useCallback(
        apiService.confirmPayment.bind(apiService),
        []
    );

    return {
        fetchApi,
        checkBalance,
        registerClient,
        loadWallet,
        initPayment,
        confirmPayment,
    };
};