import { db } from "domain/@shared/db/main";
import type { Permission } from "domain/permissions/permissions.types";

export const getPermissions = (): Promise<Permission[]> =>
  db.getRows<Permission>({
    sql: "SELECT id, name FROM permission",
  });
