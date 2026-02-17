import { z } from 'zod'

export const languageSchema = z.object({
    id: z.string().optional(),
    language: z.string().min(1, 'Language is required'),
    level: z.enum(['basic', 'intermediate', 'advanced', 'native', 'fluent']),
    is_native: z.boolean(),
    visibility: z.enum(['public', 'trusted', 'private']),
    is_favorite: z.boolean().optional(),
})

export type LanguageFormValues = z.infer<typeof languageSchema>
