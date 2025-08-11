export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    // Preservar el prototipo real de la subclase (p. ej., NotFoundError)
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export function handleError(error: any) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      error: error.constructor.name,
      message: error.message,
    };
  }

  // Errores de validación de Zod
  if (error.name === "ZodError") {
    return {
      statusCode: 400,
      error: "ValidationError",
      message: "Invalid request data",
      details: error.errors,
    };
  }

  // Errores de Prisma
  if (error.code === "P2002") {
    return {
      statusCode: 409,
      error: "ConflictError",
      message: "Resource already exists",
    };
  }

  if (error.code === "P2025") {
    return {
      statusCode: 404,
      error: "NotFoundError",
      message: "Resource not found",
    };
  }

  // Error genérico
  return {
    statusCode: 500,
    error: "InternalServerError",
    message: "Internal server error",
  };
}

