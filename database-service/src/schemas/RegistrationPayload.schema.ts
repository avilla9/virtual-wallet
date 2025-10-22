import { z } from 'zod';

export const RegistrationSchema = z.object({
    document: z.string()
        .nonempty("El documento es obligatorio.")
        .min(6, "El documento debe tener al menos 6 caracteres."),

    names: z.string()
        .nonempty("El nombre es obligatorio.")
        .min(3, "El nombre debe tener al menos 3 caracteres."),

    email: z.email()
        .nonempty("El email es obligatorio."),

    phone: z.string()
        .nonempty("El teléfono es obligatorio.")
        .regex(/^\d{7,15}$/, "El teléfono debe ser un número de 7 a 15 dígitos."), 
});