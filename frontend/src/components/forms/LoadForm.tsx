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
        // Validación básica
        if (isNaN(numericAmount) || numericAmount <= 0) return;

        await onLoad(numericAmount);
        setAmount('');
    };

    const isButtonDisabled = !walletData.document || !walletData.phone;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center">Recargar Billetera</h2>

            <Input
                label="Documento"
                name="document"
                type="text"
                value={walletData.document}
                onChange={(e) => onUpdateWalletData({ document: e.target.value })}
                required
                placeholder="Ej: 1088012345"
            />
            <Input
                label="Teléfono"
                name="phone"
                type="text"
                value={walletData.phone}
                onChange={(e) => onUpdateWalletData({ phone: e.target.value })}
                required
                placeholder="Ej: 3001234567"
            />
            <Input
                label="Monto a Recargar (USD)"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="Monto de la recarga"
            />
            <Button
                type="submit"
                loading={isLoading}
                icon={<DollarSign size={20} />}
                disabled={isButtonDisabled || isLoading}
            >
                Recargar Billetera
            </Button>
        </form>
    );
};
