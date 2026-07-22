import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../validators/auth.validator';
import { loginUser } from '../services/auth.service';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  // JWTs are stateless - "logging out" just means the client discards the
  // token. Kept as a real endpoint so the frontend has something to call
  // and so a refresh-token / blacklist strategy could be added later.
  res.status(200).json({ message: 'Logged out successfully' });
}
