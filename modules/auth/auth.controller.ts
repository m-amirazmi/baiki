import { Elysia } from "elysia";
import { AuthDto } from "./auth.model";
import { AuthService } from "./auth.service";

export const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/signup",
    async ({ body }) => {
      return await AuthService.signUp(body);
    },
    {
      body: AuthDto.signUpBody,
    }
  )
  .post(
    "/signin",
    async ({ body }) => {
      return await AuthService.signIn(body);
    },
    {
      body: AuthDto.signInBody,
    }
  );
