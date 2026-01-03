import { prisma } from "@/lib/prisma";
import { AuthService } from "../auth/auth.service";
import { RegistrationBody, RegistrationResponse } from "./registration.model";
import { TenantService } from "../tenant/tenant.service";
import { generateUniqueSlug } from "@/lib/server-utils";

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
    return {
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
    };
  }
}
