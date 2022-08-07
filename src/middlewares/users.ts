import { pool } from "../db";
import { Request, Response } from "express";
import queries from "../queries/polyuserQueries";

export const validatePasswd = (req: Request, res: Response, next: Function) => {

  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).send({
      msg: "Please enter a password with min. 6 chars",
    });
  }
  if (
    !req.body.password_repeat ||
    req.body.password != req.body.password_repeat
  ) {
    return res.status(400).send({
      msg: "Both passwords must match",
    });
  }
  next();
};
