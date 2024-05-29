import { getParsedSchemaResult } from "app/@shared/utils/get-parsed-schema-result.ts";
import { type Context } from "hono";
import { ZodObject, type ZodRawShape } from "zod";

export const applyValidation = <V, S extends ZodRawShape>(
  c: Context,
  value: V,
  schema: ZodObject<S>
) => {
  const result = getParsedSchemaResult(value, schema);
  return result.success ? result.data : c.json(result.data, 400);
};
