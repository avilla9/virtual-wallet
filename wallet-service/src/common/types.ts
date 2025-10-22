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
    cellphone: string;
}

export interface IdentifyPayload {
    document: string;
    cellphone: string;
}

export interface UserWalletData {
    document: string;
    names: string;
    email: string;
    cellphone: string;
    walletId: number;
    balance: number;
}
