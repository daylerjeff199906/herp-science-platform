import { z } from 'zod';

export const countrySchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    status: z.coerce.number().int().default(1),
});

export type CountryFormValues = z.infer<typeof countrySchema>;
