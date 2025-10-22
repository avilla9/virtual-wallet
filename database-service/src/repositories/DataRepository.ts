import type {
    RegistrationPayload,
    UserWalletData,
    IdentifyPayload,
    Wallet,
    User,
} from '../common/types.ts';
import { generateStandardResponse } from '../common/response-util.ts';
import { v4 as uuidv4 } from 'uuid';

// Simulación de la base de datos en memoria (para cumplir con el requisito de BD)
const db: { users: User[]; wallets: Wallet[] } = {
    users: [],
    wallets: [],
};

// Generador de IDs secuenciales
let currentUserId = 1;
let currentWalletId = 1;

/**
 * @class DataRepository
 * @description Implementa la lógica de acceso a datos. Es el único componente
 * que interactúa con la capa de persistencia simulada (db).
 */
export class DataRepository {
    /**
     * @method registerUserAndWallet
     * @description Crea un nuevo usuario y su billetera asociada.
     */
    public async registerUserAndWallet(
        data: RegistrationPayload
    ): Promise<UserWalletData> {
        // Validación de existencia (DRY: evitar duplicados)
        const existingUser = db.users.find(
            (u) => u.document === data.document || u.cellphone === data.cellphone
        );
        if (existingUser) {
            throw generateStandardResponse(
                'failure',
                '409_CONFLICT',
                'El cliente ya está registrado.'
            );
        }

        // Crear Usuario
        const newUser: User = {
            id: currentUserId++,
            ...data,
            createdAt: new Date(),
        };
        db.users.push(newUser);

        // Crear Billetera (saldo inicial 0)
        const newWallet: Wallet = {
            id: currentWalletId++,
            userId: newUser.id,
            balance: 0.0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        db.wallets.push(newWallet);

        return {
            ...newUser,
            walletId: newWallet.id,
            balance: newWallet.balance,
        };
    }

    /**
     * @method findWalletAndUserByIdentifiers
     * @description Busca un usuario y su billetera por documento y celular.
     */
    public async findWalletAndUserByIdentifiers(
        data: IdentifyPayload
    ): Promise<UserWalletData> {
        const user = db.users.find(
            (u) =>
                u.document === data.document && u.cellphone === data.cellphone
        );
        if (!user) {
            throw generateStandardResponse(
                'failure',
                '404_NOT_FOUND',
                'Cliente no encontrado o credenciales inválidas.'
            );
        }

        const wallet = db.wallets.find((w) => w.userId === user.id);
        if (!wallet) {
            // Error interno: debería existir
            throw generateStandardResponse(
                'failure',
                '500_INTERNAL',
                'Billetera asociada no encontrada.'
            );
        }

        return {
            document: user.document,
            names: user.names,
            email: user.email,
            cellphone: user.cellphone,
            walletId: wallet.id,
            balance: wallet.balance,
        };
    }

    /**
     * @method updateBalance
     * @description Actualiza el saldo de una billetera por su ID.
     */
    public async updateBalance(walletId: number, amount: number): Promise<void> {
        const wallet = db.wallets.find((w) => w.id === walletId);
        if (!wallet) {
            throw generateStandardResponse(
                'failure',
                '404_NOT_FOUND',
                'Billetera no encontrada.'
            );
        }

        const newBalance = wallet.balance + amount;

        if (newBalance < 0) {
            throw generateStandardResponse(
                'failure',
                '403_FORBIDDEN',
                'Saldo insuficiente para completar la operación.'
            );
        }

        wallet.balance = newBalance;
        wallet.updatedAt = new Date();
    }
}
