import { auth } from "@/lib/auth";
import {
  AuthSignInBody,
  AuthSignUpBody,
  SignInResponse,
  SignUpResponse,
} from "./auth.model";

export abstract class AuthService {
  static async signUp(data: AuthSignUpBody): Promise<SignUpResponse> {
    const { token, user } = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token as string,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static async signIn(data: AuthSignInBody): Promise<SignInResponse> {
    const { token, user } = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token as string,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
