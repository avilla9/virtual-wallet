import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import type { StatusState } from '../../types';

interface StatusNotificationProps {
    notification: StatusState;
    onClose: () => void;
}

export const StatusNotification: React.FC<StatusNotificationProps> = ({
    notification,
    onClose
}) => {
    if (!notification.message) return null;

    const baseStyle = "p-4 mt-4 mb-6 text-sm font-medium rounded-xl flex justify-between items-start shadow-md transition-all duration-300";

    const styles = {
        success: {
            bg: "bg-green-100 border-green-400",
            text: "text-green-800",
            icon: CheckCircle
        },
        error: {
            bg: "bg-red-100 border-red-400",
            text: "text-red-800",
            icon: XCircle
        },
        info: {
            bg: "bg-blue-100 border-blue-400",
            text: "text-blue-800",
            icon: Info
        },
        warning: {
            bg: "bg-yellow-100 border-yellow-400",
            text: "text-yellow-800",
            icon: AlertTriangle
        }
    };

    const { bg, text, icon: Icon } = styles[notification.type] || styles.info;

    return (
        <div className={`${baseStyle} ${bg} border-l-4`}>
            <div className={`flex items-start ${text}`}>
                <Icon size={20} className="flex-shrink-0 mt-0.5 mr-3" />
                <p className="flex-1 whitespace-pre-wrap">{notification.message}</p>
            </div>
            <button
                onClick={onClose}
                className={`ml-4 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity ${text}`}
                aria-label="Cerrar notificación"
            >
                <X size={16} />
            </button>
        </div>
    );
};
