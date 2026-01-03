import { prisma } from "@/lib/prisma";
import { AuthService } from "../auth/auth.service";
import { RegistrationBody, RegistrationResponse } from "./registration.model";
import { TenantService } from "../tenant/tenant.service";
import { generateUniqueSlug } from "@/lib/server-utils";
import { TenantUserService } from "../tenant/tenant-user.service";

export abstract class RegistrationService {
  static async register(body: RegistrationBody): Promise<RegistrationResponse> {
    await AuthService.signUp({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    const slug = await generateUniqueSlug(body.businessName);
    const tenant = await TenantService.createTenant({
      name: body.businessName,
      createdBy: user!.id,
      slug,
    });
    const tenantUser = await TenantUserService.createTenantUser({
      role: "OWNER",
      tenantId: tenant.id,
      userId: user!.id,
    });
    return {
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: tenantUser.role,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
    };
  }
}
