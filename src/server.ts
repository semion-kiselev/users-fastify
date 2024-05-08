import fastify from "fastify";
import { getMessage, log } from "./log.js";

const server = fastify();

server.get("/ping", async () => {
  return getMessage();
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  log(`Server listening at ${address}`);
});
