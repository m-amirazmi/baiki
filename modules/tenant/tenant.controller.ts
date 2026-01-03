import { Elysia } from "elysia";
import { TenantService } from "./tenant.service";
import { TenantDto } from "./tenant.model";
import { authMacro } from "@/lib/macros";

export const tenants = new Elysia({ prefix: "/tenants" })
  .use(authMacro)
  .get("/", () => TenantService.listTenants())
  .post(
    "/",
    ({ body, user, session }) => {
      // Now you can access user and session here
      console.log("User:", user);
      console.log("Session:", session);
      return TenantService.createTenant(body);
    },
    {
      body: TenantDto.body,
      auth: true,
    }
  )
  .get("/:slug", ({ params }) => TenantService.getTenantBySlug(params.slug))
  .put("/:slug", ({ params, body }) => ({ id: params.slug, body }));
