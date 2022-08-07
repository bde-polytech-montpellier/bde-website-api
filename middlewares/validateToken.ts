import { Response } from "express";
import { pool } from "../db";
import userQueries from "../queries/authenticationQueries";

require("dotenv").config();

import jwt from "jsonwebtoken";

const tokenKey = process.env.JWT_SECRET!;

export const validateToken = (
  tokenHeader: string,
  res: Response,
  next: Function
) => {
  const token = tokenHeader.split(" ")[1];
  jwt.verify(token, tokenKey, (err, data) => {
    if (err) return res.status(401).send({ msg: "Ta session est invalide !" });
    else return next(data);
  });
};

export const validateAdmin = (
  tokenHeader: string,
  res: Response,
  next: Function
) => {
  validateToken(tokenHeader, res, (data: any) => {
    pool.query(userQueries.getRoleForUser(data.id), (err, results) => {
      if (err) return res.status(500).send(err);

      if (results.rows[0].polyuser_role === 1) next(data);
      else return res.status(418).send({ msg: "Tu n'es pas une théière !" });
    });
  });
};

export const validatePermissions = (
  tokenHeader: string,
  uuid: string,
  res: Response,
  next: Function
) => {
  validateToken(tokenHeader, res, (data: any) => {
    if (data.role === "admin" || data.uuid == uuid) next(data);
    else return res.status(418).send({ msg: "Tu n'es pas une théière !" });
  });
};
