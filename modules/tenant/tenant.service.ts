import { prisma } from "@/lib/prisma";
import { Tenant, TenantBody } from "./tenant.model";
import { createModuleLogger } from "@/lib/logger";
import { NotFoundError, DatabaseError, ConflictError } from "@/lib/errors";
import { Prisma } from "@/app/generated/prisma/client";

const logger = createModuleLogger("TenantService");

export abstract class TenantService {
  static async listTenants(): Promise<Tenant[]> {
    try {
      logger.info("Fetching all tenants");

      const tenants = await prisma.tenant.findMany();

      logger.info({ count: tenants.length }, "Tenants fetched successfully");

      return tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
        type: tenant.type,
        createdBy: tenant.created_by,
        createdAt: tenant.created_at.toISOString(),
        onboardedAt: tenant.onboarded_at
          ? tenant.onboarded_at.toISOString()
          : null,
        updatedAt: tenant.updated_at.toISOString(),
      }));
    } catch (error) {
      logger.error({ error }, "Failed to fetch tenants");
      throw new DatabaseError("Failed to fetch tenants", error);
    }
  }

  static async createTenant(data: TenantBody): Promise<Tenant> {
    try {
      logger.info({ slug: data.slug, name: data.name }, "Creating new tenant");

      const newTenant = await prisma.tenant.create({
        data: {
          created_by: data.createdBy,
          name: data.name,
          slug: data.slug,
          type: data.type,
          status: data.status,
        },
      });

      logger.info(
        { tenantId: newTenant.id, slug: newTenant.slug },
        "Tenant created successfully"
      );

      return {
        id: newTenant.id,
        name: newTenant.name,
        slug: newTenant.slug,
        status: newTenant.status,
        type: newTenant.type,
        createdBy: newTenant.created_by,
        createdAt: newTenant.created_at.toISOString(),
        onboardedAt: newTenant.onboarded_at
          ? newTenant.onboarded_at.toISOString()
          : null,
        updatedAt: newTenant.updated_at.toISOString(),
      };
    } catch (error) {
      // Handle unique constraint violation
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          logger.warn(
            { slug: data.slug, error },
            "Tenant with slug already exists"
          );
          throw new ConflictError("Tenant", "slug");
        }
      }

      logger.error({ error, data }, "Failed to create tenant");
      throw new DatabaseError("Failed to create tenant", error);
    }
  }

  static async getTenantBySlug(slug: string): Promise<Tenant> {
    try {
      logger.info({ slug }, "Fetching tenant by slug");

      const tenant = await prisma.tenant.findUnique({
        where: { slug },
      });

      if (!tenant) {
        logger.warn({ slug }, "Tenant not found");
        throw new NotFoundError("Tenant", slug);
      }

      logger.info({ tenantId: tenant.id, slug }, "Tenant fetched successfully");

      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
        type: tenant.type,
        createdBy: tenant.created_by,
        createdAt: tenant.created_at.toISOString(),
        onboardedAt: tenant.onboarded_at
          ? tenant.onboarded_at.toISOString()
          : null,
        updatedAt: tenant.updated_at.toISOString(),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error({ error, slug }, "Failed to fetch tenant");
      throw new DatabaseError("Failed to fetch tenant", error);
    }
  }

  static async getTenantById(id: string): Promise<Tenant> {
    try {
      logger.info({ id }, "Fetching tenant by ID");

      const tenant = await prisma.tenant.findUnique({
        where: { id },
      });

      if (!tenant) {
        logger.warn({ id }, "Tenant not found");
        throw new NotFoundError("Tenant", id);
      }

      logger.info({ tenantId: tenant.id }, "Tenant fetched successfully");

      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
        type: tenant.type,
        createdBy: tenant.created_by,
        createdAt: tenant.created_at.toISOString(),
        onboardedAt: tenant.onboarded_at
          ? tenant.onboarded_at.toISOString()
          : null,
        updatedAt: tenant.updated_at.toISOString(),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error({ error, id }, "Failed to fetch tenant");
      throw new DatabaseError("Failed to fetch tenant", error);
    }
  }
}
