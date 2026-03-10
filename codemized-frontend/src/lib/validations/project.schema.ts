import { z } from 'zod';

export const projectSchema = z.object({
  name:        z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(150),
  description: z.string().max(500).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;