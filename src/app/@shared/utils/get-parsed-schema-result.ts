import { ZodObject, z, type ZodError, type ZodIssue, type ZodRawShape } from "zod";
import { getReasonPhrase } from "http-status-codes";

type BadRequestPayload = {
  message: string;
  issues: Pick<ZodIssue, "path" | "message">[];
};

type GetParsedSchemaResultReturn<T> =
  | { success: true; data: T }
  | { success: false; data: BadRequestPayload };

export const getParsedSchemaResult = <T extends ZodRawShape>(
  value: unknown,
  schema: ZodObject<T>
): GetParsedSchemaResultReturn<z.infer<typeof schema>> => {
  try {
    const data = schema.parse(value);
    return { success: true, data };
  } catch (e) {
    const error = e as ZodError;
    const issues = error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
    return { success: false, data: { message: getReasonPhrase(400), issues } };
  }
};
