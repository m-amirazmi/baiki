# Baiki Backend Architecture - Best Practices Guide

This guide outlines the architectural decisions and best practices implemented in the Baiki backend.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Error Handling](#error-handling)
3. [Logging](#logging)
4. [Service Layer Pattern](#service-layer-pattern)
5. [Controller Layer](#controller-layer)
6. [Database Access](#database-access)
7. [Authentication](#authentication)
8. [Code Quality](#code-quality)

---

## Project Structure

### Current Architecture ✅

```
lib/
  ├── auth.ts              # Better-auth configuration
  ├── prisma.ts            # Database client
  ├── logger.ts            # Pino logger configuration
  ├── errors.ts            # Custom error classes
  ├── macros.ts            # Elysia authentication macros
  ├── server-utils.ts      # Server-side utilities
  └── plugins/
      ├── error.plugin.ts  # Centralized error handling
      └── logging.plugin.ts # Request/response logging

modules/
  └── {feature}/
      ├── {feature}.controller.ts   # Route definitions (thin layer)
      ├── {feature}.service.ts      # Business logic
      ├── {feature}.model.ts        # DTOs and types
      └── {feature}.actions.ts      # Server actions (optional)
```

### Why This Structure?

✅ **Separation of Concerns**

- Controllers handle HTTP routing only
- Services contain business logic
- Models define data structures
- Plugins provide cross-cutting concerns

✅ **Scalability**

- Easy to add new features/modules
- Clear boundaries between layers
- Testable components

✅ **Maintainability**

- Each file has a single responsibility
- Easy to locate code
- Consistent patterns across modules

---

## Error Handling

### ✅ Best Practices Implemented

#### 1. **Custom Error Classes**

Located in [`lib/errors.ts`](/lib/errors.ts):

```typescript
// ✅ GOOD: Specific error types
throw new NotFoundError("Tenant", slug);
throw new ConflictError("User", "email");
throw new DatabaseError("Failed to create user", error);

// ❌ BAD: Generic errors
throw new Error("Something went wrong");
throw status(404);
return null; // Never return null for errors!
```

#### 2. **Service Layer Error Handling**

```typescript
// ✅ GOOD: Structured error handling
static async getTenant(slug: string): Promise<Tenant> {
  try {
    logger.info({ slug }, "Fetching tenant");

    const tenant = await prisma.tenant.findUnique({ where: { slug } });

    if (!tenant) {
      throw new NotFoundError("Tenant", slug);
    }

    return tenant;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error; // Re-throw known errors
    }
    logger.error({ error, slug }, "Database error");
    throw new DatabaseError("Failed to fetch tenant", error);
  }
}

// ❌ BAD: Silent failures
static async getTenant(slug: string) {
  try {
    return await prisma.tenant.findUnique({ where: { slug } });
  } catch (error) {
    console.log(error); // Don't use console.log!
    return null; // Don't return null!
  }
}
```

#### 3. **Prisma Error Transformation**

```typescript
// ✅ GOOD: Transform Prisma errors to domain errors
try {
  await prisma.user.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new ConflictError("User", "email");
    }
    if (error.code === "P2003") {
      throw new BadRequestError("Invalid foreign key reference");
    }
  }
  throw new DatabaseError("Database operation failed", error);
}

// ❌ BAD: Expose Prisma errors to clients
await prisma.user.create({ data }); // Unhandled Prisma errors leak!
```

#### 4. **Controller Error Flow**

```typescript
// ✅ GOOD: Let errors bubble up
export const tenants = new Elysia({ prefix: "/tenants" }).get(
  "/:slug",
  async ({ params }) => {
    return await TenantService.getTenantBySlug(params.slug);
  }
);

// ❌ BAD: Manual error handling in controllers
export const tenants = new Elysia({ prefix: "/tenants" }).get(
  "/:slug",
  async ({ params, set }) => {
    try {
      return await TenantService.getTenantBySlug(params.slug);
    } catch (error) {
      set.status = 500;
      return { error: error.message }; // Inconsistent format!
    }
  }
);
```

---

## Logging

### ✅ Best Practices Implemented

#### 1. **Module-Specific Loggers**

```typescript
// ✅ GOOD: Create module logger
import { createModuleLogger } from "@/lib/logger";

const logger = createModuleLogger("TenantService");

logger.info({ tenantId, slug }, "Tenant created successfully");
logger.error({ error, data }, "Failed to create tenant");

// ❌ BAD: No logging or console.log
console.log("Tenant created"); // Never use console.log!
// No logging at all
```

#### 2. **Structured Logging**

```typescript
// ✅ GOOD: Structured logs with context
logger.info(
  {
    userId: user.id,
    email: user.email,
    tenantId: tenant.id,
  },
  "User registration completed"
);

// ❌ BAD: String concatenation
logger.info("User " + user.email + " registered with tenant " + tenant.id);
```

#### 3. **Log Levels**

```typescript
// ✅ GOOD: Appropriate log levels
logger.debug({ query }, "Database query"); // Development details
logger.info({ userId }, "User logged in"); // Normal operations
logger.warn({ attempt }, "Failed login attempt"); // Potential issues
logger.error({ error }, "Database connection failed"); // Errors

// ❌ BAD: Everything at info level
logger.info("Debug query: " + sql);
logger.info("Error occurred: " + error);
```

#### 4. **Request Correlation**

Automatic via [`loggingPlugin`](/lib/plugins/logging.plugin.ts):

```
[14:32:15] INFO: POST /api/auth/signin
  requestId: "550e8400-e29b-41d4-a716-446655440000"

[14:32:15] INFO (AuthService): Attempting user signin
  email: "user@example.com"

[14:32:15] INFO: POST /api/auth/signin 200 - 45ms
  requestId: "550e8400-e29b-41d4-a716-446655440000"
```

#### 5. **What NOT to Log**

```typescript
// ❌ NEVER log sensitive data
logger.info({ password: body.password }); // ❌ NO!
logger.info({ token: authToken }); // ❌ NO!
logger.info({ creditCard }); // ❌ NO!

// ✅ GOOD: Log safe data only
logger.info({ email: body.email }, "Login attempt");
```

---

## Service Layer Pattern

### ✅ Best Practices Implemented

#### 1. **Abstract Static Class Pattern**

```typescript
// ✅ GOOD: Static methods for stateless services
export abstract class TenantService {
  static async createTenant(data: TenantBody): Promise<Tenant> {
    // ...
  }
}

// Usage: TenantService.createTenant(data)

// ❌ BAD: Unnecessary instantiation
export class TenantService {
  async createTenant(data: TenantBody): Promise<Tenant> {
    // ...
  }
}
// Usage: new TenantService().createTenant(data) // Why?
```

#### 2. **Single Responsibility**

```typescript
// ✅ GOOD: One service = one domain entity
export abstract class TenantService {
  static async createTenant() {}
  static async getTenant() {}
  static async updateTenant() {}
}

// ❌ BAD: Mixed responsibilities
export abstract class BusinessService {
  static async createTenant() {}
  static async createUser() {}
  static async sendEmail() {} // Different concern!
}
```

#### 3. **Input/Output Types**

```typescript
// ✅ GOOD: Explicit types
static async createTenant(data: TenantBody): Promise<Tenant> {
  // TypeScript ensures type safety
}

// ❌ BAD: Any or loose types
static async createTenant(data: any): Promise<any> {
  // No type safety!
}
```

#### 4. **Business Logic Location**

```typescript
// ✅ GOOD: Business logic in services
export abstract class RegistrationService {
  static async register(body: RegistrationBody) {
    // 1. Create user account
    // 2. Create tenant
    // 3. Link user to tenant
    // Complex orchestration here!
  }
}

// ❌ BAD: Business logic in controllers
export const registration = new Elysia().post("/", async ({ body }) => {
  // All business logic here - NO!
  const user = await createUser(body);
  const tenant = await createTenant(body);
  await linkUserTenant(user, tenant);
});
```

---

## Controller Layer

### ✅ Best Practices Implemented

#### 1. **Thin Controllers**

```typescript
// ✅ GOOD: Delegate to services
export const tenants = new Elysia({ prefix: "/tenants" })
  .get("/:slug", async ({ params }) => {
    return await TenantService.getTenantBySlug(params.slug);
  });

// ❌ BAD: Fat controllers with business logic
export const tenants = new Elysia({ prefix: "/tenants" })
  .get("/:slug", async ({ params }) => {
    const tenant = await prisma.tenant.findUnique({ ... });
    if (!tenant) throw new Error("Not found");
    // More logic here...
  });
```

#### 2. **Request Validation**

```typescript
// ✅ GOOD: Schema validation
export const tenants = new Elysia({ prefix: "/tenants" }).post(
  "/",
  async ({ body }) => TenantService.createTenant(body),
  {
    body: TenantDto.body, // Validates automatically!
  }
);

// ❌ BAD: Manual validation
export const tenants = new Elysia({ prefix: "/tenants" }).post(
  "/",
  async ({ body }) => {
    if (!body.name) throw new Error("Name required");
    if (!body.slug) throw new Error("Slug required");
    // More validation...
  }
);
```

#### 3. **Route Organization**

```typescript
// ✅ GOOD: Grouped by prefix
export const tenants = new Elysia({ prefix: "/tenants" })
  .get("/", async () => TenantService.listTenants())
  .post("/", async ({ body }) => TenantService.createTenant(body))
  .get("/:slug", async ({ params }) => TenantService.getTenantBySlug(params.slug))
  .put("/:slug", async ({ params, body }) => TenantService.updateTenant(params.slug, body));

// ❌ BAD: Scattered routes
export const app = new Elysia()
  .get("/api/tenants", ...)
  .get("/api/users", ...)
  .post("/api/tenants", ...)
  .get("/api/tenants/:slug", ...);
```

---

## Database Access

### ✅ Best Practices Implemented

#### 1. **Centralized Prisma Client**

```typescript
// lib/prisma.ts
export const prisma = new PrismaClient();

// ✅ GOOD: Import singleton
import { prisma } from "@/lib/prisma";

// ❌ BAD: Multiple instances
const prisma = new PrismaClient(); // Creates new connection pool!
```

#### 2. **Error Transformation**

```typescript
// ✅ GOOD: Transform Prisma errors
try {
  return await prisma.tenant.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new ConflictError("Tenant", "slug");
    }
  }
  throw new DatabaseError("Failed to create tenant", error);
}

// ❌ BAD: Expose Prisma errors
return await prisma.tenant.create({ data }); // Raw Prisma errors!
```

#### 3. **Type Safety**

```typescript
// ✅ GOOD: Use generated types
import type { Tenant } from "@prisma/client";

const tenant: Tenant = await prisma.tenant.findUnique({ ... });

// ❌ BAD: Any or loose types
const tenant: any = await prisma.tenant.findUnique({ ... });
```

---

## Authentication

### ✅ Best Practices Implemented

#### 1. **Authentication Macro**

```typescript
// lib/macros.ts
export const authMacro = new Elysia({ name: "authMacro" }).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({ headers });
      if (!session) return status(401);
      return { user: session.user, session: session.session };
    },
  },
});

// ✅ Usage in controllers
export const tenants = new Elysia({ prefix: "/tenants" }).use(authMacro).post(
  "/",
  async ({ body, user, session }) => {
    // user and session available here!
    return TenantService.createTenant(body, user.id);
  },
  { auth: true } // Requires authentication
);
```

#### 2. **Protected Routes**

```typescript
// ✅ GOOD: Explicit auth requirement
.post("/", async ({ user }) => { ... }, { auth: true })

// ❌ BAD: No auth protection
.post("/", async ({ body }) => { ... }) // Anyone can access!
```

---

## Code Quality

### ✅ Implemented Standards

1. **TypeScript Strict Mode**
   - No implicit any
   - Null safety
   - Type checking enabled

2. **Consistent Naming**
   - Services: `{Entity}Service`
   - Controllers: `{entity}` (lowercase)
   - Models: `{Entity}Dto`

3. **Error Handling**
   - Custom error classes
   - Proper error types
   - Meaningful messages

4. **Logging**
   - Structured logging
   - Module-specific loggers
   - Request correlation

5. **Async/Await**
   - No callback hell
   - Proper error propagation
   - Clean async flow

---

## Quick Reference

### ✅ DO

- Use custom error classes
- Log with structured data
- Keep controllers thin
- Validate input with schemas
- Use async/await
- Transform database errors
- Use module-specific loggers
- Add context to logs
- Let errors bubble up to error plugin

### ❌ DON'T

- Use `console.log()`
- Return `null` for errors
- Put business logic in controllers
- Use generic error messages
- Catch errors without rethrowing
- Log sensitive data (passwords, tokens)
- Create multiple Prisma instances
- Use `any` type
- Handle errors in controllers (let plugins do it)

---

## Additional Resources

- [Error Handling & Logging Documentation](./ERROR_HANDLING_AND_LOGGING.md)
- [Elysia Documentation](https://elysiajs.com)
- [Pino Documentation](https://getpino.io)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

## Summary

Your current architecture follows industry best practices:

✅ **Separation of concerns** (controllers, services, models)  
✅ **Comprehensive error handling** (custom error classes)  
✅ **Structured logging** (Pino with module loggers)  
✅ **Type safety** (TypeScript strict mode)  
✅ **Centralized plugins** (error handling, logging)  
✅ **Authentication** (Better-auth with Elysia macros)  
✅ **Clean code** (async/await, proper types)

Keep building on these foundations! 🚀
