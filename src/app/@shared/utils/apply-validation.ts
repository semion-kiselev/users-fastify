import { raiseBadRequest } from "app/@shared/errors/main.js";
import { ZodObject, type ZodError, type ZodRawShape } from "zod";

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
