"use server";

import { api } from "@/lib/eden";
import { TenantBody } from "./tenant.model";

export async function createTenant(data: TenantBody) {
  try {
    const result = await api.tenants.post(data);

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return { success: false, error: "Failed to create tenant" };
  }
}
