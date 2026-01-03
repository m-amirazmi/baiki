import { auth } from "@/lib/auth";
import { AuthSignInBody, AuthSignUpBody } from "./auth.model";

export abstract class AuthService {
  static async signUp(data: AuthSignUpBody): Promise<Response> {
    const response = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      asResponse: true,
    });
    return response;
  }

  static async signIn(data: AuthSignInBody): Promise<Response> {
    const response = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      asResponse: true,
    });
    return response;
  }
}
