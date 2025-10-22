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
    const [paymentStage, setPaymentStage] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) return;

        setPaymentStage(1);
        await onPayment(numericAmount);
        setPaymentStage(0);
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
                label="Monto a Pagar (USD)"
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
                icon={<Send size={20} />}
                disabled={isLoading}
            >
                {isLoading ? (
                    paymentStage === 1 ? 'Iniciando Pago...' : 'Confirmando Pago...'
                ) : (
                    'Realizar Pago'
                )}
            </Button>

            {isLoading && (
                <div className="text-center text-sm text-blue-500 flex items-center justify-center mt-2">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Transacción automática en curso...
                </div>
            )}
        </form>
    );
};