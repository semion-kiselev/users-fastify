import { db } from "domain/@shared/db/main.js";
import type { Permission } from "domain/permissions/permissions.types.js";

export const getPermissions = (): Promise<Permission[]> =>
  db.getRows<Permission>({
    sql: "SELECT id, name FROM permission",
  });
