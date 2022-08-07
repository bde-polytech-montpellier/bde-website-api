import format from "pg-format";

const createUser = (id: string, name: string, mail: string, passwd: string) =>
  format(
    `INSERT INTO polyuser (polyuser_id, polyuser_name, polyuser_mail, polyuser_password) VALUES (%L, %L, %L, %L)`,
    id,
    name,
    mail,
    passwd
  );

const getIdForUser = (mail: string) =>
  format(`SELECT polyuser_id FROM polyuser WHERE polyuser_mail=%L`, mail);
const getRoleForUser = (id: string) =>
  format(`SELECT polyuser_role FROM polyuser WHERE polyuser_id=%L`, id);
const getUser = (id: string) =>
  format(
    `SELECT * FROM polyuser INNER JOIN role ON polyuser_role=role_id WHERE polyuser_id=%L`,
    id
  );

const setLastLogin = (id: string) =>
  format(
    `UPDATE polyuser SET polyuser_lastlogin=NOW() WHERE polyuser_id=%L`,
    id
  );

export default {
  createUser,
  getIdForUser,
  getRoleForUser,
  getUser,
  setLastLogin,
};
