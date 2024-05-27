import { omit, toCamelCase } from 'domain/@shared/utils/lib.js';
import { type UserWithPermissionsFromDb, type User } from 'domain/users/users.types.js';

export const normalizeUser = (user: UserWithPermissionsFromDb) =>
  toCamelCase(omit(user, ['token_expired_at', 'password'])) as User;
