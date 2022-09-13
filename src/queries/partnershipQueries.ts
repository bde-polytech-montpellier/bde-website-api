import format from "pg-format";

const listEveryPartners = () =>
  `SELECT* FROM partenaire ORDER BY partenaire_name`;

const getPartner = (id: string) =>
  format(`SELECT * FROM partenaire WHERE partenaire_id=%L`, id);
const getPartnersFromName = (name: string) =>
  format(`SELECT * FROM partenaire WHERE partenaire_name LIKE '%s%%'`, name);
const validateMail = (mail: string) =>
  format(`SELECT partenaire_id FROM partenaire WHERE partenaire_mail=%L`, mail);

const addPartner = (
  id: string,
  name: string,
  short_desc: string,
  desc?: string,
  mail?: string,
  website?: string
) =>
  format(
    `INSERT INTO partenaire (partenaire_id, partenaire_name, partenaire_short_description, partenaire_description, partenaire_mail, partenaire_website_url) VALUES (%L, %L, %L, %L, %L, %L) RETURNING partenaire_id`,
    id,
    name,
    short_desc,
    desc != undefined ? desc : null,
    mail != undefined ? mail : null,
    website != undefined ? website : null
  );

const updatePartner = (
  partner: string,
  name: string,
  short_desc: string,
  desc?: string,
  mail?: string,
  website?: string
) =>
  format(
    `UPDATE partenaire SET partenaire_name=%L, partenaire_short_description=%L, partenaire_description=%L, partenaire_mail=%L, partenaire_website_url=%L WHERE partenaire_id=%L`,
    name,
    short_desc,
    desc != undefined ? desc : null,
    mail != undefined ? mail : null,
    website != undefined ? website : null,
    partner
  );

const setImg = (img: string, id: string) =>
  format(
    `UPDATE partenaire SET partenaire_pic=%L WHERE partenaire_id=%L`,
    img,
    id
  );

const deletePartner = (id: string) =>
  format(`DELETE FROM partenaire WHERE partenaire_id=%L`, id);

export default {
  listEveryPartners,
  getPartner,
  validateMail,
  getPartnersFromName,
  addPartner,
  updatePartner,
  setImg,
  deletePartner,
};
