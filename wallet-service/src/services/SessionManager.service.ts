import { v4 as uuidv4 } from 'uuid';
import { generateStandardResponse } from '../common/response-util';
import type { ApiResponse } from '../common/types';

interface PaymentSession {
    walletId: number;
    amount: number;
    token: string;
    createdAt: number;
}

const sessions = new Map<string, PaymentSession>();
const EXPIRATION_TIME_MS = 300000; // 5 minutos

export class SessionManager {

    public createSession(walletId: number, amount: number): { sessionId: string, token: string } {
        const sessionId = uuidv4();
        // Generate a simple 4 character token
        const token = Math.floor(1000 + Math.random() * 9000).toString();

        sessions.set(sessionId, {
            walletId,
            amount,
            token,
            createdAt: Date.now(),
        });

        console.log(`[SESSION] Sesión creada: ${sessionId}, Token: ${token}, Wallet ID: ${walletId}`);
        return { sessionId, token };
    }

    public validateSession(sessionId: string, token: string): ApiResponse<{ walletId: number, amount: number }> {
        const session = sessions.get(sessionId);

        if (!session) {
            return generateStandardResponse(
                'failure',
                '404_NOT_FOUND',
                'Sesión de pago no encontrada.'
            );
        }

        if (Date.now() - session.createdAt > EXPIRATION_TIME_MS) {
            sessions.delete(sessionId);
            return generateStandardResponse(
                'failure',
                '408_TIMEOUT',
                'Sesión de pago expirada.'
            );
        }

        if (session.token !== token) {
            return generateStandardResponse(
                'failure',
                '401_UNAUTHORIZED',
                'Token de confirmación inválido.'
            );
        }

        return generateStandardResponse(
            'success',
            '200_OK',
            'Sesión validada con éxito.',
            { walletId: session.walletId, amount: session.amount }
        );
    }

    public deleteSession(sessionId: string): void {
        sessions.delete(sessionId);
        console.log(`[SESSION] Sesión eliminada: ${sessionId}`);
    }
}
