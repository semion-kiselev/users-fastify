import { omit, toCamelCase } from "domain/@shared/utils/lib";
import { type User, type UserWithPermissionsFromDb } from "domain/users/users.types";

export const normalizeUser = (user: UserWithPermissionsFromDb) =>
  toCamelCase(omit(user, ["token_expired_at", "password"])) as User;
