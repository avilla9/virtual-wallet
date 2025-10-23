import React from 'react';
import { CreditCard } from 'lucide-react';
import { API_URL } from '../../utils/constants';

export const Header: React.FC = () => {
    return (
        <header className="p-6 bg-gray-900 text-white shadow-xl">
            <h1 className="text-3xl font-extrabold flex items-center justify-center">
                <CreditCard size={32} className="mr-3 text-yellow-400" />
                <span className="tracking-wide">Virtual Wallet</span>
            </h1>
            <p className="text-gray-400 mt-2 text-center text-xs border-t border-gray-700 pt-2">
                Microservicio REST-2 | Endpoint:{' '}
                <span className="font-mono text-xs bg-gray-700 px-2 py-0.5 rounded-md">{API_URL}</span>
            </p>
        </header>
    );
};