import React from 'react';

interface InputProps {
    label: string;
    name: string;
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
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                step={step}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-gray-800"
                placeholder={placeholder || `Introduce ${label.toLowerCase()}`}
            />
        </div>
    );
};
