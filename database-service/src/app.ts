import 'reflect-metadata';
import * as express from 'express';
import { AppDataSource } from './config/data-source';
import { DataRepository } from './repositories/Data.repository';
import { DataService } from './services/Data.service';
import { generateStandardResponse } from './common/response-util';
import type { Request, Response } from 'express';
import type { IdentifyPayload, RegistrationPayload } from './common/types';

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a MySQL (TypeORM) inicializada con éxito.');
        const dataRepository = new DataRepository(AppDataSource);
        const dataService = new DataService(dataRepository);
        const API_PREFIX = '/api/data';

        app.post(`${API_PREFIX}/register`, async (req: Request, res: Response) => {
            try {
                const payload: RegistrationPayload = req.body;
                const result = await dataService.registerClient(payload);

                const response = generateStandardResponse(
                    'success',
                    '201_CREATED',
                    'Cliente registrado y billetera creada con éxito.',
                    result
                );
                res.status(201).json(response);
            } catch (error: any) {
                const apiResponse = error.code
                    ? error
                    : generateStandardResponse('failure', '500_INTERNAL_ERROR', error.message || 'Error desconocido al registrar.');
                res.status(parseInt(apiResponse.code) || 500).json(apiResponse);
            }
        });

        app.post(`${API_PREFIX}/wallet/find`, async (req: Request, res: Response) => {
            try {
                const payload: IdentifyPayload = req.body;
                const result = await dataService.findWalletAndUser(payload);

                const response = generateStandardResponse(
                    'success',
                    '200_OK',
                    'Datos de billetera obtenidos con éxito.',
                    result
                );
                res.status(200).json(response);
            } catch (error: any) {
                const apiResponse = error.code
                    ? error
                    : generateStandardResponse('failure', '500_INTERNAL_ERROR', 'Error interno del servidor de datos.');
                res.status(parseInt(apiResponse.code) || 500).json(apiResponse);
            }
        });

        app.patch(`${API_PREFIX}/wallet/balance`, async (req: Request, res: Response) => {
            try {
                const { walletId, amount } = req.body; // amount es positivo para recarga, negativo para débito

                if (typeof walletId !== 'number' || typeof amount !== 'number') {
                    const errorResponse = generateStandardResponse('failure', '400_BAD_REQUEST', 'ID de billetera o monto inválido.');
                    return res.status(400).json(errorResponse);
                }

                await dataService.performBalanceUpdate(walletId, amount);

                const response = generateStandardResponse(
                    'success',
                    '200_OK',
                    'Saldo actualizado con éxito.'
                );
                res.status(200).json(response);
            } catch (error: any) {
                const apiResponse = error.code
                    ? error
                    : generateStandardResponse('failure', '500_INTERNAL_ERROR', 'Error interno del servidor de datos.');
                res.status(parseInt(apiResponse.code) || 500).json(apiResponse);
            }
        });

        app.listen(PORT, () => {
            console.log(`REST-1 (Data Service) corriendo en http://0.0.0.0:${PORT}${API_PREFIX}`);
        });

    })
    .catch((error) => console.log('Error al conectar a la Base de Datos:', error));
