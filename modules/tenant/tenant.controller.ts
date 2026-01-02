import { Elysia } from "elysia";
import { TenantService } from "./tenant.service";
import { TenantDto } from "./tenant.model";

export const tenants = new Elysia({ prefix: "/tenants" })
  .get("/", () => TenantService.listTenants())
  .post("/", ({ body }) => TenantService.createTenant(body), {
    body: TenantDto.body,
  })
  .get("/:slug", ({ params }) => TenantService.getTenantBySlug(params.slug))
  .put("/:slug", ({ params, body }) => ({ id: params.slug, body }));
