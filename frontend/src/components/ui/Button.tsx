import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    loading = false,
    icon,
    onClick,
    disabled = false,
    variant = 'primary',
}) => {
    const baseStyle = "w-full flex items-center justify-center px-5 py-2.5 border border-transparent rounded-xl text-base font-semibold shadow-lg transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform";

    const variantStyles = {
        primary: "text-white focus:outline-none focus:ring-4",
        secondary: "bg-white text-gray-700 border-gray-300 border hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`${baseStyle} ${variantStyles[variant]}`}
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin mr-3" />
            ) : (
                icon && <span className="mr-3">{icon}</span>
            )}
            {children}
        </button>
    );
};