import format from "pg-format";

const listEveryEvents = () =>
  `SELECT event_id, event_name, event_short_description, event_description, event_pic, event_date, event_time, event_place, event_datetime, event_price, event_club_id, club_name FROM event LEFT JOIN club ON event_club_id = club_id ORDER BY event_name`;
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
    desc != undefined ? desc : null,
    date != undefined ? date : null,
    time != undefined ? time : null,
    place != undefined ? place : null,
    datetime != undefined ? datetime : null,
    price != undefined ? price : null,
    club != undefined ? club : null
  );

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
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
  club?: string
) =>
  format(
    `UPDATE event SET event_name=%L, event_short_description=%L, event_description=%L, event_date=%L, event_time=%L, event_place=%L, event_datetime=%L, event_price=%L, event_club_id=%L WHERE event_id=%L`,
    name,
    short_desc,
    desc != undefined ? desc : null,
    date && isNaN(date!.getTime()) ? null : date,
    time && timeRegex.test(time) ? time : null,
    place != undefined ? place : null,
    datetime != undefined ? datetime : null,
    price != undefined ? price : null,
    club != undefined ? club : null,
    event
  );

const setImg = (img: string, id: string) =>
  format(`UPDATE event SET event_pic=%L WHERE event_id=%L`, img, id);

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
