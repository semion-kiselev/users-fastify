import { Hono } from "hono";
import { getPermissions } from "domain/permissions/permissions.service.ts";

export const permissions = new Hono();

permissions.get("/", async (c) => {
  const permissions = await getPermissions();
  return c.json(permissions);
});
