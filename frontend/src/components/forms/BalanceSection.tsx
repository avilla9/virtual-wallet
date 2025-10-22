import React from 'react';
import { Wallet, RefreshCw, Loader2 } from 'lucide-react';
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
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center justify-center">
                <Wallet size={28} className="mr-2 text-indigo-600" /> Saldo Actual
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-inner border border-gray-100">
                <div className="text-sm font-medium text-gray-500">Saldo Disponible (USD)</div>
                <div className="mt-1 text-5xl font-bold text-gray-800">
                    {isBalanceLoading ? (
                        <Loader2 size={36} className="animate-spin text-indigo-500 mx-auto" />
                    ) : (
                        <span className="flex items-end justify-center">
                            {walletData.balance == null ? '---' : walletData.balance.toFixed(2)}
                            <span className="text-lg font-light ml-1 mb-1">USD</span>
                        </span>
                    )}
                </div>
            </div>
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
            <Button
                onClick={onCheckBalance}
                loading={isBalanceLoading}
                icon={<RefreshCw size={20} />}
            >
                Actualizar Saldo
            </Button>
            <p className="text-xs text-gray-500 text-center pt-4">
                Nota: El saldo se consulta al cargar esta pestaña.
            </p>
        </div>
    );
};