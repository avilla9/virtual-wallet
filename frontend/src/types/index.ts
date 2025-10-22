

export type ViewType = 'balance' | 'load' | 'pay' | 'register';

export type StatusType = 'success' | 'error' | 'info' | 'warning';

export interface StatusState {
    message: string;
    type: StatusType;
}

export interface WalletData {
    document: string;
    phone: string;
    balance: number | undefined;
}



export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface RegisterClientRequest {
    document: string;
    names: string;
    email: string;
    phone: string;
}

export interface RegisterClientResponse { }

export type ClientData = RegisterClientRequest;

export interface CheckBalanceRequest {
    document: string;
    phone: string;
}

export interface CheckBalanceResponse {
    balance: number;
}

export interface LoadWalletRequest {
    document: string;
    phone: string;
    amount: number;
}

export interface LoadWalletResponse { }

export interface InitPaymentRequest {
    document: string;
    phone: string;
    amount: number;
}

export interface InitPaymentResponse {
    sessionId: string;
    token: string;
}

export interface ConfirmPaymentRequest {
    sessionId: string;
    token: string;
}

export interface ConfirmPaymentResponse { }
