import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    loading = false,
    icon,
    onClick,
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin mr-2" />
            ) : (
                icon && <span className="mr-2">{icon}</span>
            )}
            {children}
        </button>
    );
};