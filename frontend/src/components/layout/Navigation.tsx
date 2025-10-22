import React from 'react';
import { Wallet, DollarSign, Send, UserPlus } from 'lucide-react';
import { TabButton } from '../ui/TabButton';
import type { ViewType } from '../../types';
import { VIEWS } from '../../utils/constants';

interface NavigationProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
    currentView,
    onViewChange
}) => {
    const tabs = [
        { name: VIEWS.BALANCE, icon: <Wallet size={24} /> },
        { name: VIEWS.LOAD, icon: <DollarSign size={24} /> },
        { name: VIEWS.PAY, icon: <Send size={24} /> },
        { name: VIEWS.REGISTER, icon: <UserPlus size={24} /> },
    ];

    return (
        <div className="flex justify-between space-x-2 bg-gray-50 p-2 rounded-xl mb-6 shadow-lg border border-gray-200">
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