export class AppError extends Error {
  statusCode: number;
  errors?: any;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, errors?: any) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Giúp phân biệt lỗi mình chủ động ném vs lỗi hệ thống

    Error.captureStackTrace(this, this.constructor);
  }
}
