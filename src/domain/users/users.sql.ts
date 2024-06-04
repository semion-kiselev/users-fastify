export const createUserSql = `
  INSERT INTO employee (name, email, password)
  VALUES ($1, $2, crypt($3, gen_salt('bf')))
  RETURNING *;
`;

export const addPermissionsSql = `
  INSERT INTO employee_permission (employee_id, permission_id)
  VALUES %L;
`;

export const getUsersSql = `
  SELECT id, name, email, created_at, updated_at, json_agg(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUserSql = `
  SELECT id, name, email, created_at, updated_at, json_agg(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE id = $1
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUserByCredentialsSql = `
  SELECT id, name, email, created_at, updated_at, json_agg(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE email = $1 AND password = crypt($2, password)
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUserTokenExpirationTimeSql = `SELECT token_expired_at FROM employee WHERE id = $1`;

export const deleteUserSql = "DELETE FROM employee WHERE id = $1";

export const updateUserSql = "UPDATE employee SET %s WHERE id = $1 RETURNING *";

export const removeUserPermissionsSql = "DELETE FROM employee_permission WHERE employee_id = $1";
export const addUserPermissionsSql =
  "INSERT INTO employee_permission (employee_id, permission_id) VALUES %L";

export const getUserPermissionsSql = `
  SELECT array_agg(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE id = $1
`;
