import { t } from "elysia";

export const UserDto = {
  user: t.Object({
    id: t.String(),
    email: t.String({ format: "email" }),
    name: t.String(),
  }),
  withTenantResponse: t.Object({
    user: t.Object({
      id: t.String(),
      email: t.String({ format: "email" }),
      name: t.String(),
    }),
    tenant: t.Object({
      id: t.String(),
      slug: t.String(),
      name: t.String(),
    }),
  }),
};

export type User = typeof UserDto.user.static;
export type UserWithTenantResponse = typeof UserDto.withTenantResponse.static;
