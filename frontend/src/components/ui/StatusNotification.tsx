import React from 'react';
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

    const baseStyle = "p-4 mt-4 mb-4 text-sm font-medium rounded-lg flex justify-between items-center shadow-lg";

    const styles = {
        success: "bg-green-100 text-green-800 border-green-400",
        error: "bg-red-100 text-red-800 border-red-400",
        info: "bg-blue-100 text-blue-800 border-blue-400"
    };

    return (
        <div className={`${baseStyle} ${styles[notification.type]}`}>
            <p>{notification.message}</p>
            <button
                onClick={onClose}
                className="ml-4 font-bold p-1 rounded-full hover:bg-opacity-50 transition-opacity"
            >
                &times;
            </button>
        </div>
    );
};