import { raiseForbidden, raiseServerError, raiseUnauthorized } from "app/@shared/errors/main.js";
import type { EnvVariables } from "app/@shared/types/env.js";
import { Permission } from "domain/auth/auth.constants.js";
import type { TokenPayload, TokenUser } from "domain/auth/auth.types.js";
import { getUserTokenExpirationTime } from "domain/users/users.service.js";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const authGuard = (requiredPermissions: Permission[]) =>
  createMiddleware<{ Variables: EnvVariables }>(async (c, next) => {
    const { ACCESS_TOKEN_SECRET } = process.env;
    if (!ACCESS_TOKEN_SECRET) {
      raiseServerError();
    }

    const authHeader = c.req.header("Authorization");
    const [type, token] = authHeader?.split(" ") ?? [];
    if (!type || !token || type !== "Bearer") {
      raiseUnauthorized();
    }

    const payload = (await verify(token, ACCESS_TOKEN_SECRET).catch(() => {
      raiseUnauthorized();
    })) as TokenPayload;

    const user: TokenUser = {
      id: payload.sub,
      name: payload.username,
      email: payload.email,
      permissions: payload.permissions,
    };

    const userTokenExpiredTime = await getUserTokenExpirationTime(user.id);

    if (payload.iat <= userTokenExpiredTime) {
      raiseUnauthorized();
    }

    c.set("user", user);

    if (Array.isArray(requiredPermissions) && requiredPermissions.length === 0) {
      await next();
      return;
    }

    const areAllPermissionsExist = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (areAllPermissionsExist) {
      await next();
      return;
    }

    raiseForbidden();
  });
