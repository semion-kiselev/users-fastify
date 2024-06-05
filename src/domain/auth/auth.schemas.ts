import { UserIdSchema } from "domain/users/users.schemas.js";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please, enter correct email" }),
  password: z.string().max(255),
});

export const LogoutSchema = z.object({
  id: UserIdSchema,
});
