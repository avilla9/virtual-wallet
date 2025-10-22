export type ResponseStatus = 'success' | 'failure';

export interface ApiResponse<T = any> {
    status: ResponseStatus;
    code: string;
    message: string;
    data?: T;
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
