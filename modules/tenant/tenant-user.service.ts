import { prisma } from "@/lib/prisma";
import { TenantUser, TenantUserBody } from "./tenant-user.model";

export abstract class TenantUserService {
  static async createTenantUser(data: TenantUserBody): Promise<TenantUser> {
    const tenantUser = await prisma.tenantUser.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        role: data.role,
      },
    });
    return {
      id: tenantUser.id,
      tenantId: tenantUser.tenantId,
      userId: tenantUser.userId,
      role: tenantUser.role,
      createdAt: tenantUser.createdAt.toISOString(),
      updatedAt: tenantUser.updatedAt.toISOString(),
    };
  }
}
