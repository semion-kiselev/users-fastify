import { raiseNotFound } from "app/@shared/errors/main.ts";
import { applyValidation } from "app/@shared/utils/apply-validation.ts";
import { authGuard } from "app/auth/auth-guard.middleware.ts";
import { UserIdParamSchema } from "app/users/users.schemas.ts";
import { CreateUserPayloadSchema, UpdateUserPayloadSchema } from "domain/users/users.schemas.ts";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "domain/users/users.service.ts";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { Permission } from "../../domain/auth/auth.constants.ts";

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
