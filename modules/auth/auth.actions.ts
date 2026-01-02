"use server";

import { api } from "@/lib/eden";
import { AuthSignInBody, AuthSignUpBody } from "./auth.model";

export async function signUpEmail(data: AuthSignUpBody) {
  try {
    const result = await api.auth.signUp.post(data);

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to sign up:", error);
    return { success: false, error: "Failed to sign up" };
  }
}

export async function signInEmail(data: AuthSignInBody) {
  try {
    const result = await api.auth.signIn.post(data);

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to sign in:", error);
    return { success: false, error: "Failed to sign in" };
  }
}
