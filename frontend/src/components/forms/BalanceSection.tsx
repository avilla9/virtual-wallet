import React from 'react';
import { Wallet, RefreshCw, Loader2, DollarSign } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { WalletData } from '../../types';

interface BalanceSectionProps {
    walletData: WalletData;
    isBalanceLoading: boolean;
    onUpdateWalletData: (updates: Partial<WalletData>) => void;
    onCheckBalance: () => void;
}

export const BalanceSection: React.FC<BalanceSectionProps> = ({
    walletData,
    isBalanceLoading,
    onUpdateWalletData,
    onCheckBalance
}) => {

    const isButtonDisabled = !walletData.document || !walletData.phone;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center justify-center">
                <Wallet size={28} className="mr-2 text-indigo-600" /> Saldo Actual
            </h2>

            <div className="bg-indigo-50 p-6 rounded-2xl shadow-inner border border-indigo-200 text-center">
                <div className="text-lg font-medium text-indigo-700 flex items-center justify-center mb-1">
                    <DollarSign size={24} className="mr-1" /> Saldo Disponible
                </div>
                <div className="mt-1 text-6xl font-black text-gray-900">
                    {isBalanceLoading ? (
                        <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto" />
                    ) : (
                        <span className="flex items-end justify-center">
                            {/* Muestra '---' si el saldo es undefined/null, sino lo formatea */}
                            {walletData.balance == null ? '---' : walletData.balance.toFixed(2)}
                            <span className="text-xl font-light ml-2 mb-1 text-gray-600">USD</span>
                        </span>
                    )}
                </div>
            </div>

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

            <Button
                onClick={onCheckBalance}
                loading={isBalanceLoading}
                icon={<RefreshCw size={20} />}
                disabled={isButtonDisabled}
            >
                Actualizar Saldo
            </Button>

            <p className="text-xs text-gray-500 text-center pt-2">
                El saldo se actualiza automáticamente al cargar esta pestaña y después de cada transacción exitosa.
            </p>
        </div>
    );
};
