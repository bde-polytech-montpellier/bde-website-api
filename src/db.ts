import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

/**
 * Extracting the login information from the environnement variable and creating a connection to the Postgres DB
 */
const database = process.env.DATABASE_URL!;

const regex_user = /\/[\w\d]+:/;
const user = regex_user[Symbol.match](database)![0].slice(1, -1);

const regex_passwd = /:[^:.]+@/;
const passwd = regex_passwd[Symbol.match](database)![0].slice(1, -1);

const regex_host = /@.+\:/;
const host = regex_host[Symbol.match](database)![0].slice(1, -1);

const regex_port = /:\d+\//;
const port = regex_port[Symbol.match](database)![0].slice(1, -1);

const regex_db_name = /[\d\w]+$/;
const db_name = regex_db_name[Symbol.match](database)![0];

export const pool = new pg.Pool({
  user: user,
  password: passwd,
  host: host,
  database: db_name,
  port: Number(port),
});

export interface User {
  id?: string;
  name?: string;
  role?: number;
  mail?: string;
  passwd?: string;
  lastlogin?: Date;
}

export interface Partner {
  id?: string;
  name?: string;
  pic?: string;
  short_desc?: string;
  desc?: string;
  mail?: string;
  website?: string;
}

export interface Club {
  id?: string;
  name?: string;
  pic?: string;
  short_desc?: string;
  desc?: string;
  fb?: string;
  ig?: string;
}

export interface Event {
  id?: string;
  name?: string;
  short_desc?: string;
  pic?: string;
  desc?: string;
  date?: Date;
  time?: string;
  place?: string;
  datetime?: string;
  price: number;
  club?: string;
}

export interface Prevention {
  text: string;
}
