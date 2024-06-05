import { LoginSchema, LogoutSchema } from "domain/auth/auth.schemas.js";
import { z } from "zod";

export type LoginPayload = z.infer<typeof LoginSchema>;
export type LogoutPayload = z.infer<typeof LogoutSchema>;

export type TokenPayloadBase = {
  sub: number;
  username: string;
  email: string;
  permissions: string[];
};

export type TokenPayload = TokenPayloadBase & {
  iat: number;
  exp: number;
};

export type TokenUser = {
  id: number;
  name: string;
  email: string;
  permissions: string[];
};
