import format from "pg-format";
import { ChangedPermission } from "../interfaces/users";

const listEveryUsers = () =>
  `SELECT polyuser_id, polyuser_name, polyuser_mail, role_id, role_name FROM polyuser INNER JOIN role ON polyuser_role=role_id ORDER BY polyuser_name`;

const getUser = (id: string) =>
  format(
    `SELECT polyuser_name, polyuser_role, polyuser_mail FROM polyuser WHERE polyuser_id=%L`,
    id
  );
const getUsersFromName = (name: string) =>
  format(
    `SELECT polyuser_id, polyuser_name, polyuser_role, polyuser_mail FROM polyuser WHERE LOWER(polyuser_name) LIKE LOWER('%s%%')`,
    name
  );

const updateUser = (name: string, mail: string, user: string) =>
  format(
    `UPDATE polyuser SET polyuser_name=%L, polyuser_mail=%L WHERE polyuser_id=%L`,
    name,
    mail,
    user
  );
const updateUserPassword = (id: string, password: string) => format(`UPDATE polyuser SET polyuser_password=%L WHERE polyuser_id=%L`, password, id);

const updateUserPermission = (changedUsers: any) => {
  if (changedUsers.length <= 0) return ";";
  else {
    const baseQuery = `UPDATE polyuser SET polyuser_role = CAST(t.role AS INTEGER) FROM (VALUES`;
    const values = Object.keys(changedUsers)
      .map((userId) => {
        return format(`(%L, %L)`, userId, changedUsers[userId]);
      })
      .join(",");
    const endQuery =
      ") AS t(userid, role) WHERE polyuser_id = CAST(userid AS uuid)";

    return baseQuery + values + endQuery;
  }
};

const deleteUser = (id: string) =>
  format(`DELETE FROM polyuser WHERE polyuser_id=%L`, id);

export default {
  listEveryUsers,
  getUser,
  getUsersFromName,
  updateUser,
  updateUserPassword,
  updateUserPermission,
  deleteUser,
};
