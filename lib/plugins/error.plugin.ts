import { Elysia } from "elysia";
import { logger } from "@/lib/logger";
import { AppError } from "@/lib/errors";

/**
 * Error handling plugin for Elysia
 * Catches all errors and formats them consistently
 */
export const errorPlugin = new Elysia({ name: "errorPlugin" }).onError(
  ({ error, code, set, request }) => {
    const requestId = crypto.randomUUID();
    const method = request.method;
    const url = new URL(request.url).pathname;

    // Handle AppError instances
    if (error instanceof AppError) {
      logger.warn(
        {
          requestId,
          error: {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            details: error.details,
          },
          request: { method, url },
        },
        `Application error: ${error.message}`
      );

      set.status = error.statusCode;
      return error.toJSON();
    }

    // Handle validation errors from Elysia
    if (code === "VALIDATION") {
      logger.warn(
        {
          requestId,
          error: {
            type: "ValidationError",
            message: error.message,
          },
          request: { method, url },
        },
        "Validation error"
      );

      set.status = 400;
      return {
        error: {
          name: "ValidationError",
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: error,
        },
      };
    }

    // Handle not found errors
    if (code === "NOT_FOUND") {
      logger.warn(
        {
          requestId,
          request: { method, url },
        },
        "Route not found"
      );

      set.status = 404;
      return {
        error: {
          name: "NotFoundError",
          message: "Route not found",
          code: "NOT_FOUND",
          statusCode: 404,
        },
      };
    }

    // Handle parse errors
    if (code === "PARSE") {
      logger.warn(
        {
          requestId,
          error: {
            message: error.message,
          },
          request: { method, url },
        },
        "Parse error"
      );

      set.status = 400;
      return {
        error: {
          name: "ParseError",
          message: "Invalid request format",
          code: "PARSE_ERROR",
          statusCode: 400,
        },
      };
    }

    // Handle unknown errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorName = error instanceof Error ? error.name : "Error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error(
      {
        requestId,
        error: {
          name: errorName,
          message: errorMessage,
          stack: errorStack,
          code,
        },
        request: { method, url },
      },
      `Unhandled error: ${errorMessage}`
    );

    set.status = 500;
    return {
      error: {
        name: "InternalServerError",
        message:
          process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : errorMessage,
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      },
    };
  }
);
