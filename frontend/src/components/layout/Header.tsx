import React from 'react';
import { CreditCard } from 'lucide-react';
import { API_URL } from '../../utils/constants';

export const Header: React.FC = () => {
    return (
        <header className="p-6 bg-indigo-700 text-white shadow-2xl">
            <h1 className="text-3xl font-bold flex items-center">
                <CreditCard size={32} className="mr-3 text-indigo-200" />
                <span className="tracking-tight">Virtual Wallet</span>
            </h1>
            <p className="text-indigo-300 mt-1 text-sm">
                Microservicio REST-2 | Endpoint:{' '}
                <span className="font-mono text-xs">{API_URL}</span>
            </p>
        </header>
    );
};
