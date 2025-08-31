import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { ROLE } from "../../utils/enum";
import { getAuthUserId } from "@convex-dev/auth/server";

export const ensureCustomerRole = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Something went wrong");

    const existingRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const hasCustomer = await Promise.all(
      existingRoles.map(async (ur) => {
        const role = await ctx.db.get(ur.roleId);
        return role?.name === ROLE.CUSTOMER;
      })
    );
    if (!hasCustomer.includes(true)) {
      const customerRole = await ctx.db
        .query("roles")
        .withIndex("by_name", (q) => q.eq("name", ROLE.CUSTOMER))
        .unique();
      if (!customerRole) throw new Error("Customer role not seeded");

      await ctx.db.insert("userRoles", {
        userId,
        roleId: customerRole._id,
      });
    }
  },
});
