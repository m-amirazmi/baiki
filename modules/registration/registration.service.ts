import { prisma } from "@/lib/prisma";
import { AuthService } from "../auth/auth.service";
import { RegistrationBody, RegistrationResponse } from "./registration.model";
import { TenantService } from "../tenant/tenant.service";
import { generateUniqueSlug } from "@/lib/server-utils";
import { TenantUserService } from "../tenant/tenant-user.service";
import { createModuleLogger } from "@/lib/logger";
import { NotFoundError, InternalServerError } from "@/lib/errors";

const logger = createModuleLogger("RegistrationService");

export abstract class RegistrationService {
  static async register(body: RegistrationBody): Promise<RegistrationResponse> {
    const { name, email, password, businessName } = body;

    try {
      logger.info({ email, businessName }, "Starting registration process");

      // Step 1: Create user account
      logger.debug({ email }, "Creating user account");
      await AuthService.signUp({ name, email, password });

      // Step 2: Fetch created user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        logger.error({ email }, "User not found after signup");
        throw new NotFoundError("User", email);
      }

      logger.debug({ userId: user.id }, "User account created");

      // Step 3: Generate unique slug for tenant
      const slug = await generateUniqueSlug(businessName);
      logger.debug({ slug, businessName }, "Generated tenant slug");

      // Step 4: Create tenant
      logger.debug({ slug, businessName }, "Creating tenant");
      const tenant = await TenantService.createTenant({
        name: businessName,
        createdBy: user.id,
        slug,
      });

      logger.debug({ tenantId: tenant.id }, "Tenant created");

      // Step 5: Create tenant-user relationship
      logger.debug(
        { userId: user.id, tenantId: tenant.id },
        "Creating tenant-user relationship"
      );
      const tenantUser = await TenantUserService.createTenantUser({
        role: "OWNER",
        tenantId: tenant.id,
        userId: user.id,
      });

      logger.info(
        {
          userId: user.id,
          tenantId: tenant.id,
          tenantSlug: tenant.slug,
        },
        "Registration completed successfully"
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: tenantUser.role,
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
      };
    } catch (error) {
      // Re-throw known errors
      if (
        error instanceof NotFoundError ||
        error instanceof InternalServerError
      ) {
        throw error;
      }

      logger.error(
        { error, email, businessName },
        "Registration process failed"
      );

      throw new InternalServerError(
        "Failed to complete registration. Please try again.",
        error
      );
    }
  }
}
