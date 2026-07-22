import { Request, Response, NextFunction } from 'express';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from '../validators/task.validator';
import * as taskService from '../services/task.service';

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const query = taskQuerySchema.parse(req.query);
    const tasks = await taskService.getTasks(req.user!.userId, query);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.getTaskById(req.user!.userId, req.params.id);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createTaskSchema.parse(req.body);
    const task = await taskService.createTask(req.user!.userId, input);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(req.user!.userId, req.params.id, input);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    await taskService.deleteTask(req.user!.userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await taskService.getDashboardStats(req.user!.userId);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}
