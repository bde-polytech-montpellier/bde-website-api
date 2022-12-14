import { pool } from "../db";
import { Response } from "express";
import queries from "../queries/partnershipQueries";

export const checkMail = (mail: string, res: Response, next: Function) => {
  if (mail) {
    pool.query(queries.validateMail(mail), (err, results) => {
      if (err)
        return res.status(500).json({ message: "Could not verify email" });
      if (results.rows.length > 0 && results.rows[0].partner_mail !== mail)
        return res.status(409).json({ message: "Mail already exists" });
      else next();
    });
  } else next();
};
