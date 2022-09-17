import format from "pg-format";

const listEveryPartners = () => `SELECT* FROM partner ORDER BY partner_name`;

const getPartner = (id: string) =>
  format(`SELECT * FROM partner WHERE partner_id=%L`, id);
const getPartnersFromName = (name: string) =>
  format(`SELECT * FROM partner WHERE partner_name LIKE '%s%%'`, name);
const validateMail = (mail: string) =>
  format(`SELECT partner_id FROM partner WHERE partner_mail=%L`, mail);

const addPartner = (
  id: string,
  name: string,
  short_desc: string,
  desc?: string,
  mail?: string,
  website?: string
) =>
  format(
    `INSERT INTO partner (partner_id, partner_name, partner_short_description, partner_description, partner_mail, partner_website) VALUES (%L, %L, %L, %L, %L, %L) RETURNING partner_id`,
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
    `UPDATE partner SET partner_name=%L, partner_short_description=%L, partner_description=%L, partner_mail=%L, partner_website=%L WHERE partner_id=%L`,
    name,
    short_desc,
    desc != undefined ? desc : null,
    mail != undefined ? mail : null,
    website != undefined ? website : null,
    partner
  );

const setImg = (img: string, id: string) =>
  format(`UPDATE partner SET partner_pic=%L WHERE partner_id=%L`, img, id);

const deletePartner = (id: string) =>
  format(`DELETE FROM partner WHERE partner_id=%L`, id);

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
