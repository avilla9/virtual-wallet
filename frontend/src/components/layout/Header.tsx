import React from 'react';
import { Wallet } from 'lucide-react';
import { API_URL } from '../../utils/constants';

export const Header: React.FC = () => {
    return (
        <header className="p-6 bg-indigo-700 text-white shadow-xl">
            <h1 className="text-3xl font-bold flex items-center">
                <Wallet size={32} className="mr-3" /> E-Wallet Microservice Tester
            </h1>
            <p className="text-indigo-200 mt-1 text-sm">
                Consumiendo REST-2 (Lógica) en{' '}
                <span className="font-mono">{API_URL}</span>
            </p>
        </header>
    );
};