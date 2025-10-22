export type ResponseStatus = 'success' | 'failure';

export interface ApiResponse<T = any> {
    status: ResponseStatus;
    code: string;
    message: string;
    data?: T;
}

export interface User {
    id: number;
    document: string;
    names: string;
    email: string;
    phone: string;
    createdAt: Date;
}

export interface Wallet {
    id: number;
    userId: number;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegistrationPayload {
    document: string;
    names: string;
    email: string;
    phone: string;
}

export interface IdentifyPayload {
    document: string;
    phone: string;
}

export interface UserWalletData {
    document: string;
    names: string;
    email: string;
    phone: string;
    walletId: number;
    balance: number;
}