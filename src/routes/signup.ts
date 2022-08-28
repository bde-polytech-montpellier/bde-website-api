import { pool } from "../db";
import { Request, Response } from "express";

import express from "express";
import bcrypt from "bcryptjs";
import {v4 as uuidv4} from "uuid"

import queries from "../queries/authenticationQueries";
import { validatePasswd } from "../middlewares/users";

const router = express.Router();

router.post("/", validatePasswd, (req: Request, res: Response) => {
  registerUser(req, res);
});

const registerUser = (req: Request, res: Response) => {
  pool.query(queries.getIdForUser(req.body.mail), (err, results) => {
    if (err) res.status(500).send(err);
    else {
      if (results.rowCount !== 0)
        return res.status(409).json({
          message: "Cette adresse mail est déjà utilisée !",
        });

      hashPasswd(req, res);
    }
  });
};

const hashPasswd = (req: Request, res: Response) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.status(500).send(err);
    addUser(req, res, hash);
  });
};

const addUser = (req: Request, res: Response, hash: string) => {
  const { name, mail } = req.body;
  pool.query(queries.createUser(uuidv4(), name, mail, hash), (err, results) => {
    if (err) return res.status(500).send(err);
    else return res.status(200).json({ message: "Utilisateur créé avec succès !" });
  });
};

export default router;
