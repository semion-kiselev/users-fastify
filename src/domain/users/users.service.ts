import { db } from "domain/@shared/db/main.js";
import { toCamelCase } from "domain/@shared/utils/lib.ts";
import { getSqlWithValuesForUpdate } from "domain/@shared/utils/sql.ts";
import {
  addPermissionsSql,
  addUserPermissionsSql,
  createUserSql,
  deleteUserSql,
  getUserByCredentialsSql,
  getUserPermissionsSql,
  getUserSql,
  getUserTokenExpirationTimeSql,
  getUsersSql,
  removeUserPermissionsSql,
  updateUserSql,
} from "domain/users/users.sql.js";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserFromDb,
  UserWithPermissionsFromDb,
} from "domain/users/users.types.ts";
import { normalizeUser } from "domain/users/users.utils.ts";
import type { PoolClient } from "pg";
import format from "pg-format";

const getUserPermissions = async (userId: number): Promise<string[]> =>
  db
    .getRow<{ permissions: string[] }>({
      sql: getUserPermissionsSql,
      values: [userId],
    })
    .then(({ permissions }) => permissions);

export const getUsers = async (): Promise<User[]> => {
  const result = await db.getRows<UserWithPermissionsFromDb>({ sql: getUsersSql });
  return result.map(toCamelCase) as User[];
};

export const getUser = async (id: number, raiseNotFound: () => never): Promise<User | null> => {
  const result = await db.exec<UserWithPermissionsFromDb>({ sql: getUserSql, values: [id] });

  if (result.rows.length === 0) {
    raiseNotFound();
  }

  const user = result.rows[0];
  return toCamelCase(user) as User;
};

export const getUserByCredentials = async (
  login: string,
  password: string
): Promise<User | null> => {
  const result = await db.exec<UserWithPermissionsFromDb>({
    sql: getUserByCredentialsSql,
    values: [login, password],
  });
  const user = result.rows.length === 0 ? null : result.rows[0];
  return user ? (toCamelCase(user) as User) : null;
};

export const getUserTokenExpirationTime = async (userId: number) => {
  const { token_expired_at } = await db.getRow<{ token_expired_at: string }>({
    sql: getUserTokenExpirationTimeSql,
    values: [userId],
  });
  return Math.ceil(new Date(token_expired_at).getTime() / 1000);
};

export const createUser = async ({
  name,
  email,
  password,
  permissions,
}: CreateUserPayload): Promise<User> =>
  db.transact(async (client: PoolClient, commit) => {
    const user = await db
      .exec<UserFromDb>({
        client,
        sql: createUserSql,
        values: [name, email, password],
      })
      .then(({ rows }) => rows[0]);

    await db.exec<string[]>({
      client,
      sql: format(
        addPermissionsSql,
        permissions.map((p) => [user.id, p])
      ),
    });

    await commit();

    return normalizeUser({ ...user, permissions });
  });

export const updateUser = async (
  id: number,
  { name, email, password, permissions }: UpdateUserPayload,
  raiseNotFound: () => never
): Promise<User> => {
  return db.transact(async (client: PoolClient, commit) => {
    const [formattedSql, values] = getSqlWithValuesForUpdate(
      updateUserSql,
      {
        name,
        email,
        password,
        token_expired_at: permissions ? "now()::timestamptz" : undefined,
      },
      [id]
    );

    const updateResult = await client.query<UserFromDb>(formattedSql, values);

    if (updateResult.rowCount === 0) {
      raiseNotFound();
    }

    const user = updateResult.rows[0];

    if (permissions) {
      await db.exec({ sql: removeUserPermissionsSql, values: [id] });

      await db.exec<string[]>({
        sql: format(
          addUserPermissionsSql,
          permissions?.map((p) => [user.id, p])
        ),
      });
    }

    let currentPermissions: string[] = [];
    if (!permissions) {
      currentPermissions = await getUserPermissions(id);
    }

    await commit();

    return normalizeUser({
      ...user,
      permissions: permissions || currentPermissions,
    });
  });
};

export const deleteUser = async (
  id: number,
  raiseNotFound: () => never
): Promise<{ ok: true } | null> => {
  const result = await db.exec({
    sql: deleteUserSql,
    values: [id],
  });

  if (result.rowCount === 0) {
    raiseNotFound();
  }

  return { ok: true };
};
