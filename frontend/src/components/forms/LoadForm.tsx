import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { WalletData } from '../../types';

interface LoadFormProps {
    walletData: WalletData;
    onLoad: (amount: number) => Promise<void>;
    onUpdateWalletData: (updates: Partial<WalletData>) => void;
    isLoading: boolean;
}

export const LoadForm: React.FC<LoadFormProps> = ({
    walletData,
    onLoad,
    onUpdateWalletData,
    isLoading
}) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) return;

        await onLoad(numericAmount);
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Documento"
                type="text"
                value={walletData.document}
                onChange={(e) => onUpdateWalletData({ document: e.target.value })}
                required
            />
            <Input
                label="Teléfono"
                type="text"
                value={walletData.phone}
                onChange={(e) => onUpdateWalletData({ phone: e.target.value })}
                required
            />
            <Input
                label="Monto a Recargar (USD)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
            />
            <Button
                type="submit"
                loading={isLoading}
                icon={<DollarSign size={20} />}
            >
                Recargar Billetera
            </Button>
        </form>
    );
};