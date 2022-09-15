import format from "pg-format";

const listEveryGoodie = () => `SELECT * FROM goodie ORDER BY goodie_name`;

const getGoodie = (id: string) =>
  format(`SELECT * FROM goodie WHERE goodie_id=%L`, id);
const getGoodiesFromName = (name: string) =>
  format(`SELECT * FROM goodie WHERE goodie_name LIKE '%s%%'`, name);

const addGoodie = (id: string, name: string, desc?: string, price?: number) =>
  format(
    `INSERT INTO goodie (goodie_id, goodie_name, goodie_description, goodie_price) VALUES (%L, %L, %L, %L) RETURNING goodie_id`,
    id,
    name,
    desc != undefined ? desc : null,
    price != undefined ? price : null
  );

const updateGoodie = (
  goodie: string,
  name: string,
  desc?: string,
  price?: number
) =>
  format(
    `UPDATE goodie SET goodie_name=%L,goodie_description=%L, goodie_price=%L WHERE goodie_id=%L`,
    name,
    desc != undefined ? desc : null,
    price != undefined ? price : null,
    goodie
  );

const setImg = (img: string, id: string) =>
  format(`UPDATE goodie SET goodie_pic=%L WHERE goodie_id=%L`, img, id);

const deleteGoodie = (id: string) =>
  format(`DELETE FROM goodie WHERE goodie_id=%L`, id);

export default {
  listEveryGoodie,
  getGoodie,
  getGoodiesFromName,
  addGoodie,
  updateGoodie,
  setImg,
  deleteGoodie,
};
