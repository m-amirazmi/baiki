import { Elysia } from "elysia";
import { RegistrationDto } from "./registration.model";
import { RegistrationService } from "./registration.service";

export const registration = new Elysia({ prefix: "/registration" }).post(
  "/",
  async ({ body }) => {
    return await RegistrationService.register(body);
  },
  {
    body: RegistrationDto.registerBody,
  }
);
