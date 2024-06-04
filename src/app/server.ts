import { serve } from "@hono/node-server";
import { app } from "app/app.ts";

const port = Number(process.env.SERVER_PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
