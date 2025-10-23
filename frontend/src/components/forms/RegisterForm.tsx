import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { ClientData, WalletData } from '../../types';

interface RegisterFormProps {
    onRegister: (clientData: ClientData) => Promise<void>;
    isLoading: boolean;
    walletData: WalletData;
    onUpdateWalletData: (updates: Partial<WalletData>) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onRegister,
    isLoading,
    walletData,
    onUpdateWalletData
}) => {
    const [formData, setFormData] = useState<ClientData>({
        document: walletData.document || '',
        names: '',
        email: '',
        phone: walletData.phone || ''
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            document: walletData.document || '',
            phone: walletData.phone || ''
        }));
    }, [walletData.document, walletData.phone]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateWalletData({
            document: formData.document,
            phone: formData.phone
        });

        await onRegister(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-extrabold text-center mb-6 flex items-center justify-center">
                <UserPlus size={28} className="mr-2 text-indigo-600" /> Registro de Cuenta
            </h2>

            {(walletData.document || walletData.phone) && (
                <div className="p-4 mb-6 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-300 text-sm text-center font-medium shadow-sm">
                    Ya existe una cuenta en esta sesión.
                </div>
            )}

            <div className="space-y-4">
                <Input
                    name="document"
                    label="Documento"
                    type="text"
                    value={formData.document}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 1088012345"
                />
                <Input
                    name="names"
                    label="Nombre Completo"
                    type="text"
                    value={formData.names}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Juan Pérez"
                />
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@correo.com"
                />
                <Input
                    name="phone"
                    label="Teléfono"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 3001234567"
                />
            </div>

            <div className="pt-6">
                <Button
                    type="submit"
                    loading={isLoading}
                    icon={<UserPlus size={20} />}
                    disabled={isLoading}
                >
                    Registrar Cuenta
                </Button>
            </div>
        </form>
    );
};