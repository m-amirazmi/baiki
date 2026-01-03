import { Elysia } from "elysia";
import { UserDto } from "./user.model";
import { UserService } from "./user.service";

export const user = new Elysia({ prefix: "/user" }).post(
  "/me",
  async ({ body }) => UserService.getMe(body),
  {
    body: UserDto.user,
  }
);
