import React from 'react';
import { Wallet, DollarSign, Send, UserPlus } from 'lucide-react';
import { TabButton } from '../ui/TabButton';
import type { ViewType } from '../../types';

interface NavigationProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
    currentView,
    onViewChange
}) => {
    const tabs = [
        { name: 'balance' as ViewType, icon: <Wallet size={24} /> },
        { name: 'load' as ViewType, icon: <DollarSign size={24} /> },
        { name: 'pay' as ViewType, icon: <Send size={24} /> },
        { name: 'register' as ViewType, icon: <UserPlus size={24} /> },
    ];

    return (
        <div className="flex justify-between space-x-2 bg-gray-50 p-2 rounded-xl mb-6 shadow-inner border border-gray-200">
            {tabs.map((tab) => (
                <TabButton
                    key={tab.name}
                    name={tab.name}
                    icon={tab.icon}
                    currentView={currentView}
                    onClick={onViewChange}
                />
            ))}
        </div>
    );
};