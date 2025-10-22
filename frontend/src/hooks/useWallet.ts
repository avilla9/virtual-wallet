import { useState, useCallback, useRef, useEffect } from 'react';
import { useApi } from './useApi';
import type { WalletData, StatusState } from '../types';

export const useWallet = () => {
    const [walletData, setWalletData] = useState<WalletData>({
        document: '',
        phone: '',
        balance: undefined
    });

    const [status, setStatus] = useState<StatusState>({ message: '', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);
    const { checkBalance } = useApi();
    const walletDataRef = useRef(walletData);

    useEffect(() => {
        walletDataRef.current = walletData;
    }, [walletData]);

    const updateWalletData = useCallback((updates: Partial<WalletData>) => {
        setWalletData(prev => ({ ...prev, ...updates }));
    }, []);

    const handleCheckBalance = useCallback(async () => {
        const currentData = walletDataRef.current;
        if (!currentData.document || !currentData.phone) {
            setStatus({ message: 'Ingresa o registra una cuenta para ver el saldo.', type: 'info' });
            setIsBalanceLoading(false);
            return;
        }

        setIsBalanceLoading(true);
        setStatus({ message: 'Consultando saldo...', type: 'info' });

        try {

            const response = await checkBalance({
                document: currentData.document,
                phone: currentData.phone
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
    }, [checkBalance, updateWalletData, setStatus, setIsBalanceLoading]);

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
