import { ZodObject, type ZodError, type ZodRawShape } from "zod";
import { raiseBadRequest } from "../errors/main.ts";

export const applyValidation = <T extends ZodRawShape>(value: unknown, schema: ZodObject<T>) => {
  try {
    return schema.parse(value);
  } catch (e) {
    const error = e as ZodError;
    const issues = error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
    return raiseBadRequest(issues);
  }
};
