import { Elysia } from "elysia";
import { AuthService } from "./auth.service";
import { AuthDto } from "./auth.model";

export const auth = new Elysia({ prefix: "/auth" })
  .post("/signup", ({ body }) => AuthService.signUp(body), {
    body: AuthDto.signUpBody,
  })
  .post("/signin", ({ body }) => AuthService.signIn(body), {
    body: AuthDto.signInBody,
  });
