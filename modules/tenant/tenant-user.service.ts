import { prisma } from "@/lib/prisma";
import {
  TenantUser,
  TenantUserBody,
  TenantUserContext,
} from "./tenant-user.model";
import { createModuleLogger } from "@/lib/logger";
import { DatabaseError, ConflictError, NotFoundError } from "@/lib/errors";
import { Prisma } from "@/app/generated/prisma/client";

const logger = createModuleLogger("TenantUserService");

export abstract class TenantUserService {
  static async createTenantUser(data: TenantUserBody): Promise<TenantUser> {
    try {
      logger.info(
        { userId: data.userId, tenantId: data.tenantId, role: data.role },
        "Creating tenant-user relationship"
      );

      const tenantUser = await prisma.tenantUser.create({
        data: {
          tenantId: data.tenantId,
          userId: data.userId,
          role: data.role,
        },
      });

      logger.info(
        {
          tenantUserId: tenantUser.id,
          userId: data.userId,
          tenantId: data.tenantId,
        },
        "Tenant-user relationship created successfully"
      );

      return {
        id: tenantUser.id,
        tenantId: tenantUser.tenantId,
        userId: tenantUser.userId,
        role: tenantUser.role,
        createdAt: tenantUser.createdAt.toISOString(),
        updatedAt: tenantUser.updatedAt.toISOString(),
      };
    } catch (error) {
      // Handle unique constraint violation (user already in tenant)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          logger.warn(
            { userId: data.userId, tenantId: data.tenantId, error },
            "User already associated with tenant"
          );
          throw new ConflictError("User-Tenant relationship");
        }
        // Handle foreign key constraint violation
        if (error.code === "P2003") {
          logger.warn(
            { userId: data.userId, tenantId: data.tenantId, error },
            "Invalid userId or tenantId"
          );
          throw new DatabaseError("Invalid user or tenant reference", error);
        }
      }

      logger.error(
        { error, data },
        "Failed to create tenant-user relationship"
      );
      throw new DatabaseError(
        "Failed to create tenant-user relationship",
        error
      );
    }
  }

  static async getTenantUserByEmail(email: string): Promise<TenantUser> {
    try {
      logger.info({ email }, "Fetching tenant-user by email");

      const tenantUser = await prisma.tenantUser.findFirst({
        where: {
          user: {
            email: email,
          },
        },
      });

      if (!tenantUser) {
        logger.warn({ email }, "Tenant-user not found for email");
        throw new DatabaseError("Tenant-user not found for the given email");
      }

      logger.info(
        { tenantUserId: tenantUser.id, email },
        "Tenant-user fetched successfully"
      );

      return {
        id: tenantUser.id,
        tenantId: tenantUser.tenantId,
        userId: tenantUser.userId,
        role: tenantUser.role,
        createdAt: tenantUser.createdAt.toISOString(),
        updatedAt: tenantUser.updatedAt.toISOString(),
      };
    } catch (error) {
      logger.error({ error, email }, "Failed to fetch tenant-user by email");
      throw new DatabaseError("Failed to fetch tenant-user by email", error);
    }
  }

  static async getTenantUserContext(
    userId: string,
    tenantSlug?: string
  ): Promise<TenantUserContext> {
    try {
      logger.info({ userId, tenantSlug }, "Fetching tenant-user context");

      // Build query to find tenant user with user and tenant info
      const tenantUser = await prisma.tenantUser.findFirst({
        where: {
          userId: userId,
          ...(tenantSlug && {
            tenant: {
              slug: tenantSlug,
            },
          }),
        },
        include: {
          user: true,
          tenant: true,
        },
        orderBy: {
          // Prefer OWNER role, then ADMIN, then most recently created
          role: "asc",
        },
      });

      if (!tenantUser) {
        logger.warn({ userId, tenantSlug }, "Tenant-user context not found");
        throw new NotFoundError(
          "Tenant-user relationship",
          tenantSlug
            ? `userId: ${userId}, tenantSlug: ${tenantSlug}`
            : `userId: ${userId}`
        );
      }

      logger.info(
        {
          userId,
          tenantId: tenantUser.tenantId,
          tenantSlug: tenantUser.tenant.slug,
          role: tenantUser.role,
        },
        "Tenant-user context fetched successfully"
      );

      return {
        user: {
          id: tenantUser.user.id,
          email: tenantUser.user.email,
          name: tenantUser.user.name,
          role: tenantUser.role,
        },
        tenant: {
          id: tenantUser.tenant.id,
          name: tenantUser.tenant.name,
          slug: tenantUser.tenant.slug,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error(
        { error, userId, tenantSlug },
        "Failed to fetch tenant-user context"
      );
      throw new DatabaseError("Failed to fetch tenant-user context", error);
    }
  }
}
