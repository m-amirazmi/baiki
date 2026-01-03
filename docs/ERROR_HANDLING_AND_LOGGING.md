# Error Handling & Logging Best Practices

## Overview

This document outlines the error handling and logging strategy implemented in the Baiki application.

## Logging (Pino)

### Setup

The application uses **Pino** for structured logging with the following features:

- **Pretty printing** in development
- **JSON output** in production
- **Module-specific loggers** for better tracing
- **Request ID tracking** for correlation
- **Automatic log levels** based on response status

### Usage

```typescript
import { createModuleLogger } from "@/lib/logger";

const logger = createModuleLogger("ModuleName");

// Log levels
logger.debug({ data }, "Debug message");
logger.info({ data }, "Info message");
logger.warn({ data }, "Warning message");
logger.error({ error }, "Error message");
```

### Request Logging

All HTTP requests are automatically logged with:
- Request ID (UUID)
- Method and URL
- Query parameters
- User agent
- Response status code
- Duration in milliseconds

### Environment Variables

```bash
LOG_LEVEL=debug  # trace, debug, info, warn, error, fatal
NODE_ENV=development  # development or production
```

## Error Handling

### Custom Error Classes

The application provides standardized error classes in `lib/errors.ts`:

| Error Class | Status | Use Case |
|------------|--------|----------|
| `ValidationError` | 400 | Invalid input data |
| `BadRequestError` | 400 | Malformed requests |
| `UnauthorizedError` | 401 | Authentication required |
| `ForbiddenError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate resources |
| `InternalServerError` | 500 | Unexpected server errors |
| `DatabaseError` | 500 | Database operation failures |
| `ExternalServiceError` | 502 | Third-party service failures |

### Usage Examples

```typescript
import { NotFoundError, ConflictError, DatabaseError } from "@/lib/errors";

// Not found
if (!user) {
  throw new NotFoundError("User", email);
}

// Conflict (duplicate)
if (existingSlug) {
  throw new ConflictError("Tenant", "slug");
}

// Database error
try {
  await prisma.user.create({ data });
} catch (error) {
  throw new DatabaseError("Failed to create user", error);
}
```

### Error Flow

1. **Service Layer**: Throws typed errors with context
2. **Controller Layer**: Passes errors up (async/await)
3. **Error Plugin**: Catches all errors, logs them, and formats response

### Error Response Format

All errors return consistent JSON:

```json
{
  "error": {
    "name": "NotFoundError",
    "message": "Tenant with identifier 'acme' not found",
    "code": "NOT_FOUND",
    "statusCode": 404,
    "details": null
  }
}
```

## Best Practices

### Service Layer

✅ **DO:**
- Log at entry and exit points
- Include relevant context in logs
- Use specific error types
- Catch and transform Prisma errors
- Log errors before throwing

```typescript
static async createTenant(data: TenantBody): Promise<Tenant> {
  try {
    logger.info({ slug: data.slug }, "Creating tenant");
    
    const tenant = await prisma.tenant.create({ data });
    
    logger.info({ tenantId: tenant.id }, "Tenant created");
    return tenant;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictError("Tenant", "slug");
      }
    }
    logger.error({ error, data }, "Failed to create tenant");
    throw new DatabaseError("Failed to create tenant", error);
  }
}
```

❌ **DON'T:**
- Return null/undefined for missing resources
- Silently catch errors
- Use generic error messages
- Expose internal implementation details

### Controller Layer

✅ **DO:**
- Use async/await
- Let errors bubble up to error plugin
- Keep controllers thin

```typescript
export const tenants = new Elysia({ prefix: "/tenants" })
  .get("/:slug", async ({ params }) => {
    return await TenantService.getTenantBySlug(params.slug);
  });
```

❌ **DON'T:**
- Wrap in try-catch unless transforming errors
- Return error objects manually
- Handle errors in controllers (let plugins do it)

### Security Considerations

1. **Production Errors**: Hide internal details in production
2. **Sensitive Data**: Never log passwords, tokens, or PII
3. **Stack Traces**: Only include in development
4. **Error Details**: Sanitize database errors

```typescript
// In error plugin
message: process.env.NODE_ENV === "production" 
  ? "An unexpected error occurred" 
  : error.message,
```

## Architecture Improvements

### Current Structure ✅

```
lib/
  logger.ts          # Centralized logging config
  errors.ts          # Custom error classes
  plugins/
    error.plugin.ts  # Global error handler
    logging.plugin.ts # Request/response logger

modules/
  {module}/
    {module}.controller.ts  # Route handlers (thin)
    {module}.service.ts     # Business logic + error handling
    {module}.model.ts       # Types and validation
```

### Plugin Integration

Plugins are applied in order:

1. **loggingPlugin** - Logs requests/responses
2. **errorPlugin** - Catches and formats errors
3. **authMacro** - Authentication (in protected routes)

```typescript
export const app = new Elysia({ prefix: "/api" })
  .use(loggingPlugin)    // First: log all requests
  .use(errorPlugin)      // Second: catch all errors
  .use(auth)             // Third: mount routes
  .use(registration)
  .use(tenants);
```

## Testing Error Handling

### Valid Error Response Example

```bash
# Not found
GET /api/tenants/nonexistent
→ 404 { error: { name: "NotFoundError", ... } }

# Validation error
POST /api/auth/signup
Body: { email: "invalid" }
→ 400 { error: { name: "ValidationError", ... } }

# Conflict
POST /api/tenants
Body: { slug: "existing-slug" }
→ 409 { error: { name: "ConflictError", ... } }
```

## Monitoring & Debugging

### Log Queries

In development, all logs are pretty-printed:

```
[14:32:15 GMT] INFO (AuthService): Attempting user signin
    email: "user@example.com"

[14:32:15 GMT] INFO (AuthService): User signin successful
    email: "user@example.com"
```

### Request Correlation

Every request gets a unique ID for tracking:

```
[14:32:15 GMT] INFO: POST /api/auth/signin
    requestId: "550e8400-e29b-41d4-a716-446655440000"

[14:32:15 GMT] INFO: POST /api/auth/signin 200 - 45ms
    requestId: "550e8400-e29b-41d4-a716-446655440000"
    duration: "45ms"
```

## Next Steps

1. ✅ Logging with Pino
2. ✅ Error handling with custom classes
3. ✅ Request/response logging
4. ⚪ Add metrics/tracing (OpenTelemetry)
5. ⚪ Add rate limiting
6. ⚪ Add request validation middleware
7. ⚪ Add API documentation (OpenAPI/Swagger)
8. ⚪ Add health check endpoints
9. ⚪ Add graceful shutdown handling

## Additional Resources

- [Pino Documentation](https://getpino.io/)
- [Elysia Plugin Guide](https://elysiajs.com/patterns/plugin.html)
- [Error Handling Best Practices](https://elysiajs.com/essential/error-handling.html)
