import { Elysia } from "elysia";
import { auth } from "./auth";
import { prisma } from "./prisma";

export const authMacro = new Elysia({ name: "authMacro" }).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });

      console.log(session);

      if (!session) return status(401);

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});

export const tenantMacro = new Elysia({ name: "tenantMacro" }).macro({
  tenant: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      });
      if (!session) return status(401);

      const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId: session.user.id },
      });
      if (!tenantUser) return status(403);

      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantUser.tenantId },
      });
      if (!tenant) return status(404);

      return {
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
      };
    },
  },
});
