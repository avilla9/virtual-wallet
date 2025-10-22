import * as express from 'express';
import { DataService } from './api/DataService.api';
import { SessionManager } from './services/SessionManager.service';
import { WalletService } from './services/Wallet.service';
import type { Request, Response } from 'express';
import type { IdentifyPayload, RegistrationPayload } from './common/types';

const app = express();
const PUBLIC_PORT = parseInt(process.env.PORT || '3000');

app.use(express.json());

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const dataApi = new DataService();
const sessionManager = new SessionManager();
const walletService = new WalletService(dataApi, sessionManager);

const API_V1_PREFIX = '/api/v1';

app.post(`${API_V1_PREFIX}/client/register`, async (req: Request, res: Response) => {
    try {
        const payload: RegistrationPayload = req.body;
        const result = await walletService.registerClient(payload);
        res.status(parseInt(result.code) || 200).json(result);
    } catch (error: any) {
        res.status(parseInt(error.code) || 500).json(error);
    }
});

app.post(`${API_V1_PREFIX}/wallet/load`, async (req: Request, res: Response) => {
    try {
        const payload: IdentifyPayload & { amount: number } = req.body;
        const result = await walletService.loadMoney(payload);
        res.status(parseInt(result.code) || 200).json(result);
    } catch (error: any) {
        res.status(parseInt(error.code) || 500).json(error);
    }
});

app.post(`${API_V1_PREFIX}/payment/init`, async (req: Request, res: Response) => {
    try {
        const payload: IdentifyPayload & { amount: number } = req.body;
        const result = await walletService.initPayment(payload);
        res.status(parseInt(result.code) || 200).json(result);
    } catch (error: any) {
        res.status(parseInt(error.code) || 500).json(error);
    }
});

app.post(`${API_V1_PREFIX}/payment/confirm`, async (req: Request, res: Response) => {
    try {
        const { sessionId, token } = req.body;
        const result = await walletService.confirmPayment(sessionId, token);
        res.status(parseInt(result.code) || 200).json(result);
    } catch (error: any) {
        res.status(parseInt(error.code) || 500).json(error);
    }
});

app.post(`${API_V1_PREFIX}/wallet/balance`, async (req: Request, res: Response) => {
    try {
        const payload: IdentifyPayload = req.body;
        const result = await walletService.checkBalance(payload);
        res.status(parseInt(result.code) || 200).json(result);
    } catch (error: any) {
        res.status(parseInt(error.code) || 500).json(error);
    }
});

app.listen(PUBLIC_PORT, () => {
    console.log(`REST-2 (Logic Service / BFF) corriendo en http://0.0.0.0:${PUBLIC_PORT}${API_V1_PREFIX}`);
});
