import { DataService } from '../api/DataService.api.ts';
import { SessionManager } from './SessionManager.service.ts';
import type {
    ApiResponse,
    IdentifyPayload,
    RegistrationPayload,
    UserWalletData
} from '../common/types.ts';
import { generateStandardResponse } from '../common/response-util.ts';

export class WalletService {
    private dataApi: DataService;
    private sessionManager: SessionManager;

    constructor(dataApi: DataService, sessionManager: SessionManager) {
        this.dataApi = dataApi;
        this.sessionManager = sessionManager;
    }

    public async registerClient(payload: RegistrationPayload): Promise<ApiResponse<UserWalletData>> {
        if (!payload.document || !payload.cellphone) {
            return generateStandardResponse('failure', '400_BAD_REQUEST', 'Documento y celular son requeridos para el registro.');
        }

        try {
            const response = await this.dataApi.registerClient(payload);
            return response;
        } catch (error: any) {
            return error;
        }
    }

    public async loadMoney(payload: IdentifyPayload & { amount: number }): Promise<ApiResponse<UserWalletData>> {
        if (!payload.amount || payload.amount <= 0) {
            return generateStandardResponse('failure', '400_BAD_REQUEST', 'Monto de recarga inválido.');
        }

        try {
            const findResponse = await this.dataApi.findWalletAndUser(payload);
            const userData = findResponse.data!;

            await this.dataApi.updateBalance(userData.walletId, payload.amount);

            const updatedResponse = await this.dataApi.findWalletAndUser(payload);

            return generateStandardResponse(
                'success',
                '200_OK',
                `Recarga de $${payload.amount.toFixed(2)} exitosa.`,
                updatedResponse.data
            );
        } catch (error: any) {
            return error;
        }
    }

    public async checkBalance(payload: IdentifyPayload): Promise<ApiResponse<UserWalletData>> {
        try {
            const response = await this.dataApi.findWalletAndUser(payload);
            return generateStandardResponse(
                'success',
                '200_OK',
                'Consulta de saldo exitosa.',
                response.data
            );
        } catch (error: any) {
            return error;
        }
    }

    public async initPayment(payload: IdentifyPayload & { amount: number }): Promise<ApiResponse<{ sessionId: string, token: string }>> {
        if (!payload.amount || payload.amount <= 0) {
            return generateStandardResponse('failure', '400_BAD_REQUEST', 'Monto de pago inválido.');
        }

        try {
            const findResponse = await this.dataApi.findWalletAndUser(payload);
            const userData = findResponse.data!;

            if (userData.balance < payload.amount) {
                return generateStandardResponse(
                    'failure',
                    '403_FORBIDDEN',
                    `Saldo insuficiente. Saldo actual: $${userData.balance.toFixed(2)}.`
                );
            }

            const sessionId = this.sessionManager.createSession(userData.walletId, payload.amount);

            return generateStandardResponse(
                'success',
                '200_PENDING',
                'Pago iniciado. Se requiere confirmación con token.',
                sessionId
            );
        } catch (error: any) {
            return error;
        }
    }

    public async confirmPayment(sessionId: string, token: string): Promise<ApiResponse<any>> {
        const session = this.sessionManager.validateSession(sessionId, token);

        if (session.status === 'failure') {
            return session;
        }

        const { walletId, amount } = session.data!;

        try {
            await this.dataApi.updateBalance(walletId, -amount);
            this.sessionManager.deleteSession(sessionId);
            return generateStandardResponse(
                'success',
                '200_OK',
                `Pago de $${amount.toFixed(2)} confirmado y aplicado.`,
            );
        } catch (error: any) {
            return error;
        }
    }
}
