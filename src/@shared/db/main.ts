import { Pool, type PoolClient, type QueryConfig, type QueryResult, type QueryResultRow } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
});

type BaseQueryParams = {
  sql: string;
  values?: unknown[];
  client?: PoolClient;
};

const getRows = async <R extends QueryResultRow>({
  sql,
  values,
  client,
}: BaseQueryParams): Promise<R[]> => {
  const { rows } = await (client || pool).query<R>(sql, values);
  return rows;
};

const getRow = async <R extends QueryResultRow>(params: BaseQueryParams): Promise<R> => {
  const rows = await getRows<R>(params);
  return rows[0];
};

const exec = async <R extends QueryResultRow>({ client, sql, values }: BaseQueryParams) =>
  (client || pool).query<R>(sql, values);

type ExecWithConfig = {
  config: QueryConfig;
  client?: PoolClient;
};

const execWithConfig = async <R extends QueryResultRow>({ client, config }: ExecWithConfig) =>
  (client || pool).query<R>(config);

type TransactOperations = (client: PoolClient, commit: () => Promise<QueryResult>) => Promise<void>;

const transact = async (cb: TransactOperations) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const commit = async () => await client.query("COMMIT");

    return await cb(client, commit);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const db = {
  getRows,
  getRow,
  exec,
  execWithConfig,
  transact,
};
