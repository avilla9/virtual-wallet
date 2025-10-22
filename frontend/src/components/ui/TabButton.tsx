import React from 'react';
import type { ViewType } from '../../types';

interface TabButtonProps {
    name: ViewType;
    icon: React.ReactNode;
    currentView: ViewType;
    onClick: (view: ViewType) => void;
}

export const TabButton: React.FC<TabButtonProps> = ({
    name,
    icon,
    currentView,
    onClick
}) => {
    return (
        <button
            onClick={() => onClick(name)}
            className={`flex-1 flex flex-col items-center p-3 text-sm font-medium rounded-lg transition-colors ${currentView === name
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            {icon}
            <span className="mt-1 hidden sm:inline">
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
        </button>
    );
};