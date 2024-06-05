import { db } from "domain/@shared/db/main.js";
import { expireUserTokenSql } from "domain/auth/auth.sql.js";
import type { LoginPayload, TokenPayloadBase } from "domain/auth/auth.types.js";
import { getUserByCredentials } from "domain/users/users.service.js";

export const login = async (
  { email, password }: LoginPayload,
  raiseNotAuthorized: () => never,
  signToken: (payload: TokenPayloadBase) => Promise<string>
) => {
  const user = await getUserByCredentials(email, password);

  if (!user) {
    raiseNotAuthorized();
  }

  const payload = {
    sub: user.id,
    username: user.name,
    email: user.email,
    permissions: user.permissions,
  };

  const token = await signToken(payload);

  return { token };
};

export const logout = async (userId: number) => {
  await db.exec({ sql: expireUserTokenSql, values: [userId] });
  return {};
};
