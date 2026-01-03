"use server";

import { api } from "@/lib/eden";
import { TenantBody } from "./tenant.model";
import { cookies } from "next/headers";

interface CreateTenantParameters extends TenantBody {
  token: string;
}

export async function createTenant(data: CreateTenantParameters) {
  const cookiesInstance = await cookies();
  const cookieHeader = cookiesInstance
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  try {
    const result = await api.tenants.post(data, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    if (result.error) {
      return { success: false, error: result.error.toString() };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return { success: false, error: "Failed to create tenant" };
  }
}
