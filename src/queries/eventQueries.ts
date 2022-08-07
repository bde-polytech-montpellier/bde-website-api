import format from "pg-format";

const listEveryEvents = () =>
  `SELECT event_id, event_name, event_short_description, event_description, event_pic, event_date, event_time, event_place, event_datetime, event_price, event_club_id, club_name FROM event LEFT JOIN club ON event_club_id = club_id`;
const listEveryEventsAfter = (date: Date) =>
  format(
    `SELECT event_id, event_name, event_short_description, event_description, event_date, event_time, event_place, event_datetime, event_price, event_club_id, club_name FROM event LEFT JOIN club ON event_club_id = club_id WHERE event_date > %L`,
    date
  );
const listEveryEventsBefore = (date: Date) =>
  format(
    `SELECT event_id, event_name, event_short_description, event_description, event_date, event_time, event_place, event_datetime, event_price, event_club_id, club_name FROM event LEFT JOIN club ON event_club_id = club_id WHERE event_date < %L`,
    date
  );

const getEvent = (id: string) =>
  format(
    `SELECT event_id, event_name, event_short_description, event_description, event_date, event_time, event_place, event_datetime, event_price, event_club_id, club_name FROM event LEFT JOIN club ON event_club_id = club_id WHERE event_id=%L`,
    id
  );
const getEventsFromName = (name: string) =>
  format(
    `SELECT event_id, event_name, event_short_description, event_description, event_date, event_time, event_place, event_datetime, event_price, event_club_id, club_name FROM event LEFT JOIN club ON event_club_id = club_id WHERE event_name LIKE '%s%%'`,
    name
  );

const addEvent = (
  id: string,
  name: string,
  short_desc: string,
  desc?: string,
  date?: Date,
  time?: string,
  place?: string,
  datetime?: string,
  price?: number,
  club?: string
) =>
  format(
    `INSERT INTO event (event_id, event_name, event_short_description, event_description, event_date, event_time, event_place, event_datetime, event_price, event_club_id) VALUES (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L) RETURNING event_id`,
    id,
    name,
    short_desc,
    desc,
    date,
    time,
    place,
    datetime,
    price,
    club
  );

const updateEvent = (
  event: string,
  name: string,
  short_desc: string,
  desc?: string,
  date?: Date,
  time?: string,
  place?: string,
  datetime?: string,
  price?: number,
  club?: string,
) =>
  format(
    `UPDATE event SET event_name=%L, event_short_description=%L, event_description=%L, event_date=%L, event_time=%L, event_place=%L, event_datetime=%L, event_price=%L, event_club_id=%L WHERE event_id=%L`,
    name,
    short_desc,
    desc,
    date,
    time,
    place,
    datetime,
    price,
    club,
    event
  );

const setImg = (img: string, id: string) => format(`UPDATE event SET event_pic=%L WHERE event_id=%L`, img, id);

const deleteEvent = (id: string) =>
  format(`DELETE FROM event WHERE event_id=%L`, id);

export default {
  listEveryEvents,
  listEveryEventsAfter,
  listEveryEventsBefore,
  getEvent,
  getEventsFromName,
  addEvent,
  updateEvent,
  setImg,
  deleteEvent,
};
