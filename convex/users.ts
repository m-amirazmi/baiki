import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Role } from "../lib/enum";

type CurrentUserType = {
  id: string;
  email: string;
  image: string;
  name: string;
  roles?: Role[];
  preferredRole: Role | "";
};

type ResponseObj<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<ResponseObj<CurrentUserType>> => {
    try {
      const currentUser: CurrentUserType = {
        email: "",
        id: "",
        image: "",
        name: "",
        roles: [],
        preferredRole: "",
      };
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("User not exists");

      const user = await ctx.db.get(userId);
      if (!user) return { success: false, error: "User not exists" };

      const userRoles = await ctx.db
        .query("userRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      const preferredRole = await ctx.db
        .query("userPreferredRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();

      const roleIds = userRoles.map((r) => r.roleId);
      const roles = await Promise.all(roleIds.map((rid) => ctx.db.get(rid)));
      const roleTypes: Role[] = roles.map((r) => r?.name as Role);

      currentUser.email = user.email || "";
      currentUser.id = user._id;
      currentUser.image = user.image || "";
      currentUser.name = user.name || "";
      currentUser.roles = roleTypes;
      currentUser.preferredRole = roles.find(
        (r) => r?._id === preferredRole?.roleId
      )?.name as Role;

      return { success: true, data: currentUser };
    } catch (error) {
      const err = error as any;
      return { success: false, error: err.message };
    }
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx): Promise<ResponseObj<CurrentUserType[]>> => {
    try {
      const users: CurrentUserType[] = [];

      const getUsers = await ctx.db.query("users").collect();

      console.log(getUsers);

      return { success: true, data: users };
    } catch (error) {
      const err = error as any;
      return { success: false, error: err.message };
    }
  },
});
