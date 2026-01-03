"use server";

import { api } from "@/lib/eden";
import { RegistrationBody } from "./registration.model";

export async function registrationAction(data: RegistrationBody) {
  try {
    const result = await api.registration.post(data);
    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to register:", error);
    return { success: false, error: "Failed to register" };
  }
}
