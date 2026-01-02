import { Elysia } from "elysia";
import { AuthService } from "./auth.service";
import { AuthDto } from "./auth.model";

export const auth = new Elysia({ prefix: "/auth" })
  .post("/signUp", ({ body }) => AuthService.signUp(body), {
    body: AuthDto.signUpBody,
  })
  .post("/signIn", ({ body }) => AuthService.signIn(body), {
    body: AuthDto.signInBody,
  });
