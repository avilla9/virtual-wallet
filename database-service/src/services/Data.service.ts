import { DataRepository } from "../repositories/Data.repository.ts";
import { RegistrationSchema } from "../schemas/RegistrationPayload.schema.ts";
import type {
    RegistrationPayload,
    UserWalletData,
    IdentifyPayload,
    ResponseStatus,
    ApiResponse
} from "../common/types.ts";
import { ZodError } from "zod";
import { generateStandardResponse } from "../common/response-util.ts";

export class DataService {
    private repository: DataRepository;

    constructor(repository: DataRepository) {
        this.repository = repository;
    }

    public async registerClient(payload: RegistrationPayload): Promise<ApiResponse<UserWalletData>> {
        try {
            const validatedPayload = RegistrationSchema.parse(payload);
            const userWalletData = await this.repository.registerUserAndWallet(validatedPayload);
            return generateStandardResponse<UserWalletData>(
                'success' as ResponseStatus,
                'SUCCESS',
                'Usuario y wallet registrados exitosamente.',
                userWalletData
            );

        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map(issue =>
                    `${issue.path.join('.')}: ${issue.message}`
                );

                const fullErrorMessage = `Validación fallida. Errores: ${errorMessages.join('; ')}`;

                return generateStandardResponse<UserWalletData>(
                    'error' as ResponseStatus,
                    'VALIDATION_ERROR',
                    fullErrorMessage
                );
            }

            throw error;
        }
    }

    public async findWalletAndUser(payload: IdentifyPayload): Promise<UserWalletData> {
        return this.repository.findWalletAndUserByIdentifiers(payload);
    }

    public async performBalanceUpdate(walletId: number, amount: number): Promise<void> {
        return this.repository.updateBalance(walletId, amount);
    }
}
