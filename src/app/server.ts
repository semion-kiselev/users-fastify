import { serve } from "@hono/node-server";
import { users } from "app/users/users.routes.ts";
import { Hono } from "hono";
import { getReasonPhrase } from "http-status-codes";

const app = new Hono();

app.route("/users", users);

app.onError((err, c) => {
  if ("code" in err && err.code === "23505") {
    return c.json({ message: getReasonPhrase(409) }, 409);
  }
  if ("code" in err && err.code === "23503") {
    return c.json({ message: getReasonPhrase(400) }, 400);
  }
  return c.json({ message: getReasonPhrase(500) }, 500);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
