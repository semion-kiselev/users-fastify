import { UserIdSchema } from "domain/users/users.schemas";
import { z } from "zod";

export const UserIdParamSchema = z.object({
  id: UserIdSchema,
});
