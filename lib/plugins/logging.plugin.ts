import { Elysia } from "elysia";
import { logger } from "@/lib/logger";

/**
 * Request logging plugin for Elysia
 * Logs all incoming requests and their responses with timing
 */
export const loggingPlugin = new Elysia({ name: "loggingPlugin" })
  .onRequest(({ request, store }) => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    const method = request.method;
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Store timing and request ID for later use
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store as any).requestId = requestId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store as any).startTime = startTime;

    logger.info(
      {
        requestId,
        request: {
          method,
          url: pathname,
          query: Object.fromEntries(url.searchParams),
          headers: {
            userAgent: request.headers.get("user-agent"),
            contentType: request.headers.get("content-type"),
          },
        },
      },
      `${method} ${pathname}`
    );
  })
  .onAfterResponse(({ request, set, store }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestId = (store as any).requestId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startTime = (store as any).startTime;
    const duration = Date.now() - startTime;
    const method = request.method;
    const url = new URL(request.url).pathname;
    const statusCode = set.status || 200;

    const statusNum = typeof statusCode === "number" ? statusCode : 200;
    const logLevel = statusNum >= 500 ? "error" : statusNum >= 400 ? "warn" : "info";

    logger[logLevel](
      {
        requestId,
        request: {
          method,
          url,
        },
        response: {
          statusCode,
          duration: `${duration}ms`,
        },
      },
      `${method} ${url} ${statusCode} - ${duration}ms`
    );
  });
