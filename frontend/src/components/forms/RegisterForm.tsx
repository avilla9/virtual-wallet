import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { ClientData } from '../../types';

interface RegisterFormProps {
    onRegister: (clientData: ClientData) => Promise<void>;
    isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onRegister,
    isLoading
}) => {
    const [formData, setFormData] = useState<ClientData>({
        document: '',
        names: '',
        email: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onRegister(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="document"
                label="Documento"
                type="text"
                value={formData.document}
                onChange={handleChange}
                required
            />
            <Input
                name="names"
                label="Nombre Completo"
                type="text"
                value={formData.names}
                onChange={handleChange}
                required
            />
            <Input
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <Input
                name="phone"
                label="Teléfono"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            <Button
                type="submit"
                loading={isLoading}
                icon={<UserPlus size={20} />}
            >
                Registrar Cuenta
            </Button>
        </form>
    );
};