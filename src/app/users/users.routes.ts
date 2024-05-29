import { UserIdParamSchema } from "app/users/users.schemas.ts";
import { CreateUserPayloadSchema, UpdateUserPayloadSchema } from "domain/users/users.schemas.ts";
import { createUser, getUser, updateUser, deleteUser, getUsers } from "domain/users/users.service.ts";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { applyValidation } from "../@shared/utils/apply-validation.ts";

export const users = new Hono();

users.get("/", async (c) => {
  const users = await getUsers();
  return c.json(users);
});

users.get(
  "/:id",
  validator("param", (value, c) =>
    applyValidation(c, { ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await getUser(id);
    if (!user) {
      return c.notFound();
    }
    return c.json(user);
  }
);

users.post(
  "/",
  validator("json", (value, c) => applyValidation(c, value, CreateUserPayloadSchema)),
  async (c) => {
    const payload = c.req.valid("json");
    const user = await createUser(payload);
    return c.json(user);
  }
);

users.put(
  "/:id",
  validator("param", (value, c) =>
    applyValidation(c, { ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  validator("json", (value, c) => applyValidation(c, value, UpdateUserPayloadSchema)),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const user = await updateUser(id, payload);
    return c.json(user);
  }
);

users.delete(
  "/:id",
  validator("param", (value, c) =>
    applyValidation(c, { ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const result = await deleteUser(id);
    if (!result) {
      return c.notFound();
    }
    return c.json(result);
  }
);
