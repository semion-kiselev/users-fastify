export const expireUserTokenSql =
  "UPDATE employee SET token_expired_at=now()::timestamptz WHERE id = $1";
