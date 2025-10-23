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
            <h2 className="text-2xl font-bold flex items-center justify-center mb-4">
                <Wallet size={28} className="mr-2 text-indigo-600" /> Mi Saldo
            </h2>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-4 border-indigo-500/10 text-center transform transition-all duration-300">
                <div className="text-xl font-semibold text-gray-700 flex items-center justify-center mb-2 uppercase tracking-wide">
                    <DollarSign size={28} className="mr-1 text-green-500" /> Saldo Disponible
                </div>
                <div className="mt-2 text-7xl font-extrabold text-gray-900 leading-none">
                    {isBalanceLoading ? (
                        <Loader2 size={64} className="animate-spin text-indigo-500 mx-auto" />
                    ) : (
                        <span className="flex items-baseline justify-center">
                            {walletData.balance == null ? '---' : walletData.balance.toFixed(2)}
                            <span className="text-2xl font-light ml-3 mb-1 text-gray-600">USD</span>
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4 pt-2">
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
            </div>


            <Button
                onClick={onCheckBalance}
                loading={isBalanceLoading}
                icon={<RefreshCw size={20} />}
                disabled={isButtonDisabled}
            >
                Actualizar Saldo
            </Button>

            <p className="text-xs text-gray-500 text-center pt-2 italic">
                El saldo se mantiene sincronizado. Usa este botón para una verificación manual.
            </p>
        </div>
    );
};