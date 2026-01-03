import { prisma } from "@/lib/prisma";
import { status } from "elysia";
import { Tenant, TenantBody } from "./tenant.model";

export abstract class TenantService {
  static async listTenants(): Promise<Tenant[]> {
    const tenants = await prisma.tenant.findMany();
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
  }

  static async createTenant(data: TenantBody): Promise<Tenant> {
    const newTenant = await prisma.tenant.create({
      data: {
        created_by: data.createdBy,
        name: data.name,
        slug: data.slug,
        type: data.type,
        status: data.status,
      },
    });

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
  }

  static async getTenantBySlug(slug: string): Promise<Tenant> {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
    });
    if (!tenant) {
      throw status(404, "Tenant not found");
    }

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
  }

  // static async updateTenant(
  //   slug: string,
  //   data: { name: string; description?: string }
  // ) {}

  // static async archiveTenant(slug: string) {}
}
