import { UserIdSchema } from "domain/users/users.schemas.js";
import { z } from "zod";

export const UserIdParamSchema = z.object({
  id: UserIdSchema,
});
