import { t } from "elysia";

export const RegistrationDto = {
  registerBody: t.Object({
    name: t.String({ minLength: 2 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
    businessName: t.String({ minLength: 2 }),
  }),
  registerResponse: t.Object({
    user: t.Object({
      id: t.String(),
      name: t.String(),
      email: t.String(),
    }),
    tenant: t.Object({
      id: t.String(),
      name: t.String(),
      slug: t.String(),
    }),
  }),
};

export type RegistrationBody = typeof RegistrationDto.registerBody.static;
export type RegistrationResponse =
  typeof RegistrationDto.registerResponse.static;
