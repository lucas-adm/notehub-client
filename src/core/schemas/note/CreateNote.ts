import { z } from "zod";

export const createNoteFormSchema = z.object({
    name: z
        .string().trim()
        .regex(/^[a-zA-Z0-9_.-]+$/, "Use letras, números, _, . ou -")
        .min(1, 'Mínimo de 1 caractere.')
        .max(255, 'Máximo de 255 caracteres.'),
    description: z
        .string().trim()
        .max(255, 'Máximo de 255 caracteres.'),
    markdown: z
        .string()
        .optional(),
    hidden: z
        .enum(["true", "false"])
        .transform((value) => value === "true"),
    closed: z
        .enum(["true", "false"])
        .transform((value) => value === "true"),
})

export type CreateNoteFormData = z.infer<typeof createNoteFormSchema>;