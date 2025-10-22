export interface RequestOptions {
    method: string;
    headers?: Record<string, string>;
    body?: BodyInit | null;
}

export interface WalletData {
    document: string;
    phone: string;
    balance?: number;
}

export interface ClientData {
    document: string;
    names: string;
    email: string;
    phone: string;
}

export interface PaymentData {
    document: string;
    phone: string;
    amount: number;
    sessionId?: string;
    token?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface StatusState {
    message: string;
    type: 'success' | 'error' | 'info';
}

export type ViewType = 'balance' | 'load' | 'pay' | 'register';