import { z } from 'zod';

export const taskSchema = z.object({
  title:       z.string().min(2, 'El título debe tener al menos 2 caracteres').max(200),
  description: z.string().max(1000).optional(),
  status:      z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
  priority:    z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  dueDate:     z.string().optional(),
  assigneeId:  z.string().uuid().optional().or(z.literal('')),
});

export type TaskFormValues = z.infer<typeof taskSchema>;