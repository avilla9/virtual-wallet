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
        { name: VIEWS.BALANCE, icon: <Wallet size={20} /> },
        { name: VIEWS.LOAD, icon: <DollarSign size={20} /> },
        { name: VIEWS.PAY, icon: <Send size={20} /> },
        { name: VIEWS.REGISTER, icon: <UserPlus size={20} /> },
    ];

    return (
        <div className="flex gap-2 items-center justify-between mb-8 rounded-2xl">
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