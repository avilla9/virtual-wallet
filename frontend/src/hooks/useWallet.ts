import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import type { WalletData, StatusState } from '../types';

export const useWallet = () => {
    const [walletData, setWalletData] = useState<WalletData>({
        document: '10001000',
        phone: '3001234567',
        balance: undefined
    });

    const [status, setStatus] = useState<StatusState>({ message: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);

    const { checkBalance } = useApi();

    const updateWalletData = useCallback((updates: Partial<WalletData>) => {
        setWalletData(prev => ({ ...prev, ...updates }));
    }, []);

    const handleCheckBalance = useCallback(async () => {
        setIsBalanceLoading(true);
        setStatus({ message: '', type: 'info' });

        try {
            const response = await checkBalance({
                document: walletData.document,
                phone: walletData.phone
            });

            if (response.success) {
                const newBalance = response.data?.balance || 0;
                updateWalletData({ balance: parseFloat(newBalance.toFixed(2)) });
                setStatus({
                    message: `Saldo actualizado: ${newBalance.toFixed(2)} USD.`,
                    type: 'info'
                });
            } else {
                updateWalletData({ balance: undefined });
                setStatus({ message: response.message || 'Error al consultar saldo', type: 'error' });
            }
        } catch (error) {
            setStatus({
                message: error instanceof Error ? error.message : 'Error desconocido',
                type: 'error'
            });
            updateWalletData({ balance: undefined });
        } finally {
            setIsBalanceLoading(false);
        }
    }, [walletData.document, walletData.phone, checkBalance, updateWalletData]);

    return {
        walletData,
        status,
        isLoading,
        isBalanceLoading,
        updateWalletData,
        setStatus,
        setIsLoading,
        handleCheckBalance
    };
};