import format from 'pg-format';

const filterUndefined = ([, val]: [string, unknown]) =>
  typeof val !== 'undefined';

function getPositionalParams(
  this: unknown[],
  [key, val]: [string, unknown],
): string {
  if (key === 'password') {
    return `${key} = crypt($${this.push(val)}, gen_salt('bf'))`;
  }
  if (val === 'now()::timestamptz') {
    return `${key} = ${val}`;
  }
  return `${key} = $${this.push(val)}`;
}

export const getSqlWithValuesForUpdate = (
  sql: string,
  fieldNameValueMap: Record<string, unknown>,
  sqlParams: unknown[],
) => {
  const values = sqlParams.slice();
  const fieldsToUpdate = Object.entries(fieldNameValueMap)
    .filter(filterUndefined)
    .map(getPositionalParams, values)
    .join(', ');

  return [format(sql, fieldsToUpdate), values] as [string, unknown[]];
};
