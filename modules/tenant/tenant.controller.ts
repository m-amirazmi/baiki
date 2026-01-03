import { Elysia } from "elysia";
import { TenantService } from "./tenant.service";
import { TenantDto } from "./tenant.model";
import { authMacro } from "@/lib/macros";

export const tenants = new Elysia({ prefix: "/tenants" })
  .use(authMacro)
  .get("/", async () => {
    return await TenantService.listTenants();
  })
  .post(
    "/",
    async ({ body, user, session }) => {
      // Now you can access user and session here
      console.log("User:", user);
      console.log("Session:", session);
      return await TenantService.createTenant(body);
    },
    {
      body: TenantDto.body,
      auth: true,
    }
  )
  .get("/:slug", async ({ params }) => {
    return await TenantService.getTenantBySlug(params.slug);
  })
  .put("/:slug", async ({ params, body }) => {
    return { id: params.slug, body };
  });
