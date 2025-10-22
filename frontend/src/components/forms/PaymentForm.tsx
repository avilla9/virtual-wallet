import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { WalletData } from '../../types';

interface PaymentFormProps {
    walletData: WalletData;
    onPayment: (amount: number) => Promise<void>;
    onUpdateWalletData: (updates: Partial<WalletData>) => void;
    isLoading: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
    walletData,
    onPayment,
    onUpdateWalletData,
    isLoading
}) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) return;

        await onPayment(numericAmount);
        setAmount('');
    };

    const isButtonDisabled = !walletData.document || !walletData.phone;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center">Realizar Pago</h2>

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
                label="Monto a Pagar (USD)"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="Monto del pago"
            />

            <Button
                type="submit"
                loading={isLoading}
                icon={<Send size={20} />}
                disabled={isButtonDisabled || isLoading}
            >
                {isLoading ? (
                    'Procesando Pago...'
                ) : (
                    'Realizar Pago'
                )}
            </Button>

            {isLoading && (
                <div className="text-center text-sm text-indigo-600 flex items-center justify-center mt-2">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Transacción en curso (2 fases)...
                </div>
            )}
        </form>
    );
};
