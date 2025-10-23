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

    const numericAmount = parseFloat(amount);
    const isAmountValid = !isNaN(numericAmount) && numericAmount > 0;

    const isButtonDisabled = !walletData.document || !walletData.phone || !isAmountValid || isLoading;

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-extrabold text-center mb-6 flex items-center justify-center">
                <Send size={28} className="inline-block mr-2 text-indigo-600" /> Realizar Pago
            </h2>

            <div className="space-y-4">
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
            </div>

            <div className="pt-6">
                <Button
                    type="submit"
                    loading={isLoading}
                    icon={<Send size={20} />}
                    disabled={isButtonDisabled}
                >
                    {isLoading ? (
                        'Procesando Pago...'
                    ) : (
                        'Realizar Pago'
                    )}
                </Button>

                {isLoading && (
                    <div className="text-center text-sm text-indigo-700 flex items-center justify-center mt-4 p-3 bg-indigo-100 rounded-xl border border-indigo-300 shadow-inner">
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Transacción en curso (Inicio y Confirmación)...
                    </div>
                )}
            </div>
        </form>
    );
};