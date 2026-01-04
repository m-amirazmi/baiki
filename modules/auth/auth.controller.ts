import { Elysia } from "elysia";
import { AuthDto } from "./auth.model";
import { AuthService } from "./auth.service";

export const auth = new Elysia({ prefix: "/auth" })
  .post("/signup", async ({ body }) => await AuthService.signUp(body), {
    body: AuthDto.signUpBody,
  })
  .post("/signin", async ({ body }) => await AuthService.signIn(body), {
    body: AuthDto.signInBody,
  })
  .post("/signout", async () => await AuthService.signOut());
