import { auth } from "@/lib/auth";
import { AuthSignInBody, AuthSignUpBody } from "./auth.model";
import { createModuleLogger } from "@/lib/logger";
import { ExternalServiceError, BadRequestError } from "@/lib/errors";

const logger = createModuleLogger("AuthService");

export abstract class AuthService {
  static async signUp(data: AuthSignUpBody): Promise<Response> {
    try {
      logger.info({ email: data.email }, "Attempting user signup");

      const response = await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        asResponse: true,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.warn(
          { email: data.email, status: response.status, error: errorData },
          "Signup failed"
        );
        throw new BadRequestError(
          errorData.message || "Failed to create account",
          errorData
        );
      }

      logger.info({ email: data.email }, "User signup successful");
      return response;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      logger.error({ error, email: data.email }, "Signup error");
      throw new ExternalServiceError("Authentication service", error);
    }
  }

  static async signIn(data: AuthSignInBody): Promise<Response> {
    try {
      logger.info({ email: data.email }, "Attempting user signin");

      const response = await auth.api.signInEmail({
        body: {
          email: data.email,
          password: data.password,
        },
        asResponse: true,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.warn(
          { email: data.email, status: response.status },
          "Signin failed"
        );
        throw new BadRequestError(
          errorData.message || "Invalid credentials",
          errorData
        );
      }

      logger.info({ email: data.email }, "User signin successful");
      return response;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      logger.error({ error, email: data.email }, "Signin error");
      throw new ExternalServiceError("Authentication service", error);
    }
  }
}
