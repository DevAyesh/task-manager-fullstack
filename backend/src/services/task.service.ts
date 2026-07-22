import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validator';

function buildOrderBy(sort: TaskQueryInput['sort']): Prisma.TaskOrderByWithRelationInput {
  switch (sort) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'dueDate':
      return { dueDate: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

export async function getTasks(userId: string, query: TaskQueryInput) {
  const where: Prisma.TaskWhereInput = {
    userId,
    ...(query.status && { status: query.status }),
    ...(query.priority && { priority: query.priority }),
    ...(query.search && {
      title: { contains: query.search, mode: 'insensitive' },
    }),
  };

  return prisma.task.findMany({ where, orderBy: buildOrderBy(query.sort) });
}

export async function getTaskById(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
}

export async function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: input.status,
      dueDate: new Date(input.dueDate),
      userId,
    },
  });
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  const task = await getTaskById(userId, taskId); // throws 404 if missing or not owned by this user

  if (input.dueDate) {
    const newDate = new Date(input.dueDate);
    newDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDueDate = new Date(task.dueDate);
    currentDueDate.setHours(0, 0, 0, 0);

    // Only throw if they are changing the date to something different AND it's in the past
    if (newDate.getTime() !== currentDueDate.getTime() && newDate < today) {
      throw new AppError('Due date cannot be earlier than today', 400);
    }
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...input,
      ...(input.dueDate && { dueDate: new Date(input.dueDate) }),
    },
  });
}

export async function deleteTask(userId: string, taskId: string) {
  await getTaskById(userId, taskId);
  await prisma.task.delete({ where: { id: taskId } });
}

export async function getDashboardStats(userId: string) {
  const [total, pending, inProgress, completed, overdue] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'PENDING' } }),
    prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.task.count({
      where: { userId, status: { not: 'COMPLETED' }, dueDate: { lt: new Date() } },
    }),
  ]);

  return { total, pending, inProgress, completed, overdue };
}
