import { Elysia } from "elysia";
import { TenantService } from "./tenant.service";
import { TenantDto } from "./tenant.model";
import { authMacro } from "@/lib/macros";

export const tenants = new Elysia({ prefix: "/tenants" })
  .use(authMacro)
  .get("/", async () => await TenantService.listTenants())
  .post("/", async ({ body }) => await TenantService.createTenant(body), {
    body: TenantDto.body,
    auth: true,
  })
  .get(
    "/:slug",
    async ({ params }) => await TenantService.getTenantBySlug(params.slug),
    {
      auth: true,
    }
  )
  .put("/:slug", async ({ params, body }) => {
    return { id: params.slug, body };
  });
