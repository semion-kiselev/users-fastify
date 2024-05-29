import { z } from "zod";
import { UserIdSchema } from "../../domain/users/users.schemas.ts";

export const UserIdParamSchema = z.object({
  id: UserIdSchema,
});
