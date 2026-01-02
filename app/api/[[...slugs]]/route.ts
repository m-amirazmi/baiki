import { tenants } from "@/modules/tenant/tenant.controller";
import { Elysia } from "elysia";

export const app = new Elysia({ prefix: "/api" }).use(tenants);

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
