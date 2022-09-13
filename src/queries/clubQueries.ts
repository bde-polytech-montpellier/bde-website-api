import format from "pg-format";

const listEveryClub = () => `SELECT * FROM club ORDER BY club_name`;

const getClub = (id: string) =>
  format(`SELECT * FROM club WHERE club_id=%L`, id);
const getClubsFromName = (name: string) =>
  format(`SELECT * FROM club WHERE club_name LIKE '%s%%'`, name);

const addClub = (
  id: string,
  name: string,
  short_desc: string,
  desc?: string,
  fb?: string,
  ig?: string
) =>
  format(
    `INSERT INTO club (club_id, club_name, club_short_description, club_description, club_fb, club_ig) VALUES (%L, %L, %L, %L, %L, %L) RETURNING club_id`,
    id,
    name,
    short_desc,
    desc != undefined ? desc : null,
    fb != undefined ? fb : null,
    ig != undefined ? ig : null
  );

const updateClub = (
  club: string,
  name: string,
  short_desc: string,
  desc?: string,
  fb?: string,
  ig?: string
) =>
  format(
    `UPDATE club SET club_name=%L, club_short_description=%L, club_description=%L, club_fb=%L, club_ig=%L WHERE club_id=%L`,
    name,
    short_desc,
    desc != undefined ? desc : null,
    fb != undefined ? fb : null,
    ig != undefined ? ig : null,
    club
  );

const setImg = (img: string, id: string) =>
  format(`UPDATE club SET club_pic=%L WHERE club_id=%L`, img, id);

export default {
  listEveryClub,
  getClub,
  getClubsFromName,
  addClub,
  updateClub,
  setImg,
};
