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
};

export type TenantUserBody = typeof TenantUserDto.body.static;
export type TenantUser = typeof TenantUserDto.full.static;
