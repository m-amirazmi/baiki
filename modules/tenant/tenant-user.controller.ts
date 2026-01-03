import { Elysia } from "elysia";
import { TenantUserService } from "./tenant-user.service";
import { TenantUserDto } from "./tenant-user.model";
import { authMacro } from "@/lib/macros";

export const tenantUsers = new Elysia({
  prefix: "/tenantUsers",
  name: "tenantUsers",
})
  .use(authMacro)
  .post(
    "/",
    async ({ body }) => await TenantUserService.createTenantUser(body),
    {
      body: TenantUserDto.body,
      auth: true,
    }
  )
  .get(
    "/context",
    async ({ query, user }) => {
      if (!user?.id) {
        throw new Error("Unauthorized");
      }
      return await TenantUserService.getTenantUserContext(
        user.id,
        query.tenantSlug
      );
    },
    {
      auth: true,
      query: TenantUserDto.contextQuery,
    }
  );
