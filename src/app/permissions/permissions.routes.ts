import { getPermissions } from "domain/permissions/permissions.service.js";
import { Hono } from "hono";

export const permissions = new Hono();

permissions.get("/", async (c) => {
  const permissions = await getPermissions();
  return c.json(permissions);
});
