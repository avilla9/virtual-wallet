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
    const isActive = currentView === name;

    const displayNameMap: Record<ViewType, string> = {
        'balance': 'Saldo',
        'load': 'Recargar',
        'pay': 'Pagar',
        'register': 'Registrar',
    };
    const displayName = displayNameMap[name];

    return (
        <button
            onClick={() => onClick(name)}
            className={`flex-1 flex flex-col items-center p-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out ${isActive
                ? 'text-white shadow-xl ring-2'
                : 'text-gray-600 hover:bg-gray-100 transform'
                }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={displayName}
        >
            {icon}
            <span className="mt-1 text-xs font-semibold hidden sm:inline">
                {displayName}
            </span>
        </button>
    );
};
