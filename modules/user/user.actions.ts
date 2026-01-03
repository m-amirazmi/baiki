"use server";

import { api } from "@/lib/eden";
import { User } from "./user.model";

export async function getMeAction(user: User) {
  try {
    const result = await api.user.me.post({
      email: user.email,
      id: user.id,
      name: user.name,
    });

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return { success: false, error: "Failed to fetch user data" };
  }
}
