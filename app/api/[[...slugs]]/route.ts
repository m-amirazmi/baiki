import { auth as authentication } from "@/lib/auth";
import { auth } from "@/modules/auth/auth.controller";
import { registration } from "@/modules/registration/registration.controller";
import { tenants } from "@/modules/tenant/tenant.controller";
import { errorPlugin } from "@/lib/plugins/error.plugin";
import { loggingPlugin } from "@/lib/plugins/logging.plugin";
import { Elysia } from "elysia";
import { user } from "@/modules/user/user.controller";

export const app = new Elysia({
  prefix: "/api",
})
  .use(loggingPlugin)
  .use(errorPlugin)
  .mount("/api", authentication.handler)
  .use(auth)
  .use(registration)
  .use(tenants)
  .use(user);

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
