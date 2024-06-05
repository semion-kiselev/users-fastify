import { type StatusCode } from "app/@shared/types/status-code.js";
import { HTTPException } from "hono/http-exception";
import { getReasonPhrase } from "http-status-codes";
import type { ZodIssue } from "zod";

const raiseHttpException = (status: StatusCode, data: Record<string, unknown> = {}) => {
  const body = JSON.stringify({
    message: getReasonPhrase(status),
    ...data,
  });
  const res = new Response(body, { status });
  throw new HTTPException(status, { res });
};

export const raiseBadRequest = (issues: Pick<ZodIssue, "path" | "message">[]) =>
  raiseHttpException(400, { issues });
export const raiseUnauthorized = () => raiseHttpException(401);
export const raiseForbidden = () => raiseHttpException(403);
export const raiseNotFound = () => raiseHttpException(404);
export const raiseConflict = () => raiseHttpException(409);
export const raiseServerError = () => raiseHttpException(500);
