import { z } from 'zod';

const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
const statusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

function isTodayOrLater(value: string) {
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

const baseTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  priority: priorityEnum,
  status: statusEnum.optional().default('PENDING'),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Due date must be a valid date'),
});

export const createTaskSchema = baseTaskSchema.extend({
  dueDate: baseTaskSchema.shape.dueDate.refine(isTodayOrLater, 'Due date cannot be earlier than today'),
});

export const updateTaskSchema = baseTaskSchema.partial();

export const taskQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  sort: z.enum(['newest', 'oldest', 'dueDate']).optional().default('newest'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
