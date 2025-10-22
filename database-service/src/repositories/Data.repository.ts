import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User.entity.ts';
import { Wallet } from '../entities/Wallet.entity.ts';
import { generateStandardResponse } from '../common/response-util.ts';
import type {
    RegistrationPayload,
    UserWalletData,
    IdentifyPayload,
} from '../common/types.ts';

export class DataRepository {
    private userRepository: Repository<User>;
    private walletRepository: Repository<Wallet>;
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.userRepository = dataSource.getRepository(User);
        this.walletRepository = dataSource.getRepository(Wallet);
    }

    public async registerUserAndWallet(
        data: RegistrationPayload
    ): Promise<UserWalletData> {
        const existingUser = await this.userRepository.findOne({
            where: [{ document: data.document }, { phone: data.phone }],
        });

        if (existingUser) {
            throw generateStandardResponse(
                'failure',
                '409_CONFLICT',
                'El cliente ya está registrado (Documento o Teléfono duplicado).'
            );
        }

        return this.dataSource.transaction(async (manager) => {
            const newUser = manager.create(User, data);
            await manager.save(newUser);
            const newWallet = manager.create(Wallet, {
                balance: 0,
                user: newUser,
            });
            await manager.save(newWallet);

            return {
                document: newUser.document,
                names: newUser.names,
                email: newUser.email,
                phone: newUser.phone,
                walletId: newWallet.id,
                balance: newWallet.balance,
            };
        });
    }

    public async findWalletAndUserByIdentifiers(
        data: IdentifyPayload
    ): Promise<UserWalletData> {
        const user = await this.userRepository.findOne({
            where: {
                document: data.document,
                phone: data.phone,
            },
            relations: ['wallet'],
        });

        if (!user || !user.wallet) {
            throw generateStandardResponse(
                'failure',
                '404_NOT_FOUND',
                'Cliente no encontrado o credenciales inválidas.'
            );
        }

        const balance = parseFloat(user.wallet.balance.toString());

        return {
            document: user.document,
            names: user.names,
            email: user.email,
            phone: user.phone,
            walletId: user.wallet.id,
            balance: balance,
        };
    }

    public async updateBalance(walletId: number, amount: number): Promise<void> {
        return this.dataSource.transaction(async (manager) => {
            const wallet = await manager.findOne(Wallet, {
                where: { id: walletId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!wallet) {
                throw generateStandardResponse(
                    'failure',
                    '404_NOT_FOUND',
                    'Billetera no encontrada.'
                );
            }

            const currentBalance = parseFloat(wallet.balance.toString());
            const newBalance = currentBalance + amount;

            if (newBalance < 0) {
                throw generateStandardResponse(
                    'failure',
                    '403_FORBIDDEN',
                    'Saldo insuficiente para completar la operación.'
                );
            }
            wallet.balance = newBalance;
            await manager.save(wallet);
        });
    }
}
