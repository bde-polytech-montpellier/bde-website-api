import { pool } from "../db";
import { Request, Response } from "express";

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import queries from "../queries/authenticationQueries";

const router = express.Router();
const TOKEN_LIFETIME = "7d";

router.post("/", (req: Request, res: Response) => {
  connectUser(req, res);
});

const connectUser = (req: Request, res: Response) => {
  pool.query(queries.getIdForUser(req.body.mail), (err, results) => {
    if (err) res.status(500).send(err);
    else {
      if (results.rowCount == 0)
        return res.status(404).json({
          message: "Le mail ou mot de passe est incorrect !",
        });

      comparePasswd(req, results.rows[0], res);
    }
  });
};

const comparePasswd = (req: Request, user: any, res: Response) => {
  pool.query(queries.getUser(user.polyuser_id), (err, results) => {
    if (err) return res.status(500).send(err);

    bcrypt.compare(
      req.body.password,
      results.rows[0].polyuser_password,
      (bErr, bResult) => {
        if (bErr)
          return res
            .status(404)
            .json({ message: "Le mail ou mot de passe est incorrect !" });

        if (bResult) return signJWT(req, results.rows[0], res);
        else
          return res
            .status(401)
            .json({ message: "Le mail ou le mot de passe est incorrect !" });
      }
    );
  });
};

const signJWT = (req: Request, user: any, res: Response) => {
  const token = jwt.sign(
    {
      id: user.polyuser_id,
      role: user.role_name,
    },
    process.env.JWT_SECRET!,
    { expiresIn: TOKEN_LIFETIME }
  );
  const userPayload = {
    id: user.polyuser_id,
    name: user.polyuser_name,
    mail: user.polyuser_mail,
    role: user.role_name,
    token: token,
  };

  pool.query(queries.setLastLogin(user.polyuser_id), (err, results) => {
    if (err) return res.status(500).json({message: "Could not update last login"});
    else
      return res
        .status(200)
        .send({ message: "Connection réussie !", token, userPayload });
  });
};

export default router;
