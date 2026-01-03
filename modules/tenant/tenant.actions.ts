"use server";

import { api } from "@/lib/eden";
import { TenantBody } from "./tenant.model";
import { cookies } from "next/headers";
import { getHeadersAsObject } from "@/lib/server-utils";

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

export async function getTenantUserContext(tenantSlug?: string) {
  const headers = await getHeadersAsObject();

  try {
    const result = await api.tenantUsers.context.get({
      headers,
      query: { tenantSlug },
    });

    if (result.error) {
      return { success: false, error: result.error.toString() };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to get tenant user context:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get context",
    };
  }
}
