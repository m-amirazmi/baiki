import { TenantUserRole } from "@/app/generated/prisma/enums";
import { t } from "elysia";

export const TenantUserDto = {
  body: t.Object({
    tenantId: t.String(),
    userId: t.String(),
    role: t.Enum(TenantUserRole),
  }),
  full: t.Object({
    id: t.String(),
    tenantId: t.String(),
    userId: t.String(),
    role: t.Enum(TenantUserRole),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
  context: t.Object({
    user: t.Object({
      id: t.String(),
      email: t.String(),
      name: t.String(),
      role: t.Enum(TenantUserRole),
    }),
    tenant: t.Object({
      id: t.String(),
      name: t.String(),
      slug: t.String(),
    }),
  }),
  contextQuery: t.Object({
    tenantSlug: t.Optional(t.String()),
  }),
};

export type TenantUserBody = typeof TenantUserDto.body.static;
export type TenantUser = typeof TenantUserDto.full.static;
export type TenantUserContext = typeof TenantUserDto.context.static;
export type TenantUserContextQuery = typeof TenantUserDto.contextQuery.static;
