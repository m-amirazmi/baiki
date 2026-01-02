import { t } from "elysia";

export const AuthDto = {
  signUpBody: t.Object({
    name: t.String({ minLength: 2 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
  }),
  signUpResponse: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String({ format: "email" }),
    token: t.Optional(t.String()),
    createdAt: t.String({ format: "date-time" }),
    updatedAt: t.String({ format: "date-time" }),
  }),
  signInBody: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
  }),
  signInResponse: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String({ format: "email" }),
    token: t.Optional(t.String()),
    createdAt: t.String({ format: "date-time" }),
    updatedAt: t.String({ format: "date-time" }),
  }),
};

export type AuthSignUpBody = typeof AuthDto.signUpBody.static;
export type SignUpResponse = typeof AuthDto.signUpResponse.static;
export type AuthSignInBody = typeof AuthDto.signInBody.static;
export type SignInResponse = typeof AuthDto.signInResponse.static;
