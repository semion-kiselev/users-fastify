import { raiseNotFound } from "app/@shared/errors/main.js";
import { applyValidation } from "app/@shared/utils/apply-validation.js";
import { authGuard } from "app/auth/auth-guard.middleware.js";
import { UserIdParamSchema } from "app/users/users.schemas.js";
import { Permission } from "domain/auth/auth.constants.js";
import { CreateUserPayloadSchema, UpdateUserPayloadSchema } from "domain/users/users.schemas.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "domain/users/users.service.js";
import { Hono } from "hono";
import { validator } from "hono/validator";

export const users = new Hono();

users.on("GET", "*", authGuard([Permission.UR]));
users.on(["POST", "PUT", "PATCH", "DELETE"], "*", authGuard([Permission.UR, Permission.UM]));

users.get("/", async (c) => {
  const users = await getUsers();
  return c.json(users);
});

users.get(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await getUser(id, raiseNotFound);
    return c.json(user);
  }
);

users.post(
  "/",
  validator("json", (value) => applyValidation(value, CreateUserPayloadSchema)),
  async (c) => {
    const payload = c.req.valid("json");
    const user = await createUser(payload);
    return c.json(user);
  }
);

users.put(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  validator("json", (value) => applyValidation(value, UpdateUserPayloadSchema)),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const user = await updateUser(id, payload, raiseNotFound);
    return c.json(user);
  }
);

users.delete(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const result = await deleteUser(id, raiseNotFound);
    return c.json(result);
  }
);
