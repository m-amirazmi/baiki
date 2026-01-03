import { auth as authentication } from "@/lib/auth";
import { auth } from "@/modules/auth/auth.controller";
import { registration } from "@/modules/registration/registration.controller";
import { tenants } from "@/modules/tenant/tenant.controller";
import { Elysia } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .mount("/api", authentication.handler)
  .use(auth)
  .use(registration)
  .use(tenants);

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
