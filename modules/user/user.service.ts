import { createModuleLogger } from "@/lib/logger";
import { TenantUserService } from "../tenant/tenant-user.service";
import { User, UserWithTenantResponse } from "./user.model";
import { email } from "zod";
import { DatabaseError } from "@/lib/errors";
import { TenantService } from "../tenant/tenant.service";

const logger = createModuleLogger("UserService");

export abstract class UserService {
  static async getMe(user: User): Promise<UserWithTenantResponse> {
    try {
      logger.info({ email: user.email }, "Get tenantUser by email");
      const tenantUser = await TenantUserService.getTenantUserByEmail(
        user.email
      );

      if (!tenantUser) {
        logger.warn({ email }, "Tenant-user not found for email");
        throw new DatabaseError("Tenant-user not found for the given email");
      }

      logger.info(
        { tenantUserId: tenantUser.id, userId: tenantUser.userId },
        "TenantUser fetched successfully"
      );

      logger.info({ tenantId: tenantUser.tenantId }, "Get tenant by tenantId");

      const tenant = await TenantService.getTenantById(tenantUser.tenantId);
      if (!tenant) {
        logger.warn(
          { tenantId: tenantUser.tenantId },
          "Tenant not found for tenantId"
        );
        throw new DatabaseError("Tenant not found for the given tenantId");
      }

      logger.info(
        { tenantId: tenant.id, tenantSlug: tenant.slug },
        "Tenant fetched successfully"
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        tenant: {
          id: tenantUser.tenantId,
          slug: tenant.slug,
          name: tenant.name,
        },
      };
    } catch (error) {
      logger.error({ error, userId: user.id }, "Failed to fetch user data");
      throw new DatabaseError("Failed to fetch user data", error);
    }
  }
}
