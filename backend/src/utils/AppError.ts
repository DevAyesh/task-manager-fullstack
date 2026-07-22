/**
 * A known, expected error (bad request, not found, unauthorized, etc.)
 * Anything that is NOT an AppError is treated as an unexpected 500 by the
 * error middleware.
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
