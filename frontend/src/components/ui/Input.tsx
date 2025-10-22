import React from 'react';

interface InputProps {
    label: string;
    name?: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    min?: string;
    step?: string;
    placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    min,
    step,
    placeholder
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                step={step}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                placeholder={placeholder || `Introduce ${label.toLowerCase()}`}
            />
        </div>
    );
};