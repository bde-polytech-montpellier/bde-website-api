import format from "pg-format";

const listEveryPromos = () =>
  `SELECT promo_id, promo_name, promo_description, partenaire.partenaire_id, partenaire_name FROM code_promo NATURAL JOIN partenaire`;

const getPromo = (id: string) =>
  format(
    `SELECT promo_name, promo_description, partenaire.partenaire_id, partenaire_name FROM code_promo NATURAL JOIN partenaire WHERE promo_id=%L`,
    id
  );
const getPromosFromName = (name: string) =>
  format(`SELECT * FROM code_promo WHERE promo_name LIKE '%s%%'`, name);

const addPromo = (name: string, desc: string, partner: string) =>
  format(
    `INSERT INTO code_promo (promo_name, promo_description, partenaire_id) VALUES (%L, %L, %L)`,
    name,
    desc,
    partner
  );

const updatePromo = (
  name: string,
  desc: string,
  partner: string,
  promo: string
) =>
  format(
    `UPDATE code_promo SET promo_name=%L, promo_description=%L, partenaire_id=%L WHERE promo_id=%L`,
    name,
    desc,
    partner,
    promo
  );

const deletePromo = (id: string) =>
  format(`DELETE FROM code_promo WHERE promo_id=%L`, id);

export default {
  listEveryPromos,
  getPromo,
  getPromosFromName,
  addPromo,
  updatePromo,
  deletePromo,
};
