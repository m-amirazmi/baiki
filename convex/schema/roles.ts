import { defineTable } from "convex/server";
import { v } from "convex/values";

const roles = defineTable({
  name: v.string(),
  description: v.string(),
}).index("by_name", ["name"]);

const userRoles = defineTable({
  userId: v.id("users"),
  roleId: v.id("roles"),
})
  .index("by_user", ["userId"])
  .index("by_role", ["roleId"]);

export const roleTables = { roles, userRoles };
