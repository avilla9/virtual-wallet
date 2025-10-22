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

    // Sincronizar el estado del formulario con el estado de la billetera al cargar el componente
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
        // Antes de registrar, actualiza los datos de la billetera en el estado global
        onUpdateWalletData({
            document: formData.document,
            phone: formData.phone
        });

        await onRegister(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center">Registro de Nueva Cuenta</h2>

            {/* Muestra un mensaje si ya hay una cuenta activa */}
            {walletData.document && (
                <div className="p-3 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 text-sm text-center">
                    Ya existe una cuenta en esta sesión. El registro sobrescribirá la cuenta activa.
                </div>
            )}

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
            <Button
                type="submit"
                loading={isLoading}
                icon={<UserPlus size={20} />}
                disabled={isLoading}
            >
                Registrar Cuenta
            </Button>
        </form>
    );
};
