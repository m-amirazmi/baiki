/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        details: this.details,
      },
    };
  }
}

/**
 * Validation error - 400
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

/**
 * Not found error - 404
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}

/**
 * Unauthorized error - 401
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401, "UNAUTHORIZED");
  }
}

/**
 * Forbidden error - 403
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

/**
 * Conflict error - 409
 */
export class ConflictError extends AppError {
  constructor(resource: string, field?: string) {
    const message = field
      ? `${resource} with this ${field} already exists`
      : `${resource} already exists`;
    super(message, 409, "CONFLICT");
  }
}

/**
 * Bad request error - 400
 */
export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

/**
 * Internal server error - 500
 */
export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", details?: unknown) {
    super(message, 500, "INTERNAL_SERVER_ERROR", details);
  }
}

/**
 * Database error - 500
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, "DATABASE_ERROR", details);
  }
}

/**
 * External service error - 502
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, details?: unknown) {
    super(`External service '${service}' error`, 502, "EXTERNAL_SERVICE_ERROR", details);
  }
}
