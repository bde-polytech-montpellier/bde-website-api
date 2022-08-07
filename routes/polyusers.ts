import { pool } from "../db";
import queries from "../queries/polyuserQueries";
import express, { Request, Response } from "express";
import {
  validateAdmin,
  validatePermissions,
} from "../middlewares/validateToken";
import bcrypt from "bcryptjs";
import { validatePasswd } from "../middlewares/users";

const router = express.Router();
const DEFAULT_ROLE = "2";

router.route("/").get((req, res) => {
  pool.query(queries.listEveryUsers(), (err, results) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(results.rows);
  });
});

router.route("/permissions").patch((req, res) => {
  validateAdmin(req.headers.authorization!, res, () => {
    updatePermissions(req, res);
  });
});

router
  .route("/:id")
  .get((req, res) => {
    pool.query(queries.getUser(req.params.id), (err, results) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(results.rows);
    });
  })
  .put((req, res) => {
    validatePermissions(req.headers.authorization!, req.params.id, res, () => {
      updateUser(req, res);
    });
  })
  .delete((req, res) => {
    validatePermissions(req.headers.authorization!, req.params.id, res, () => {
      queries.deleteUser(req.body.id);
    });
  });

router.route("/:id/role/:role").patch((req, res) => {
  validateAdmin(req.headers.authorization!, res, () => {
    updatePermissions(req, res);
  });
});

router.route("/name/:name").get((req, res) => {
  pool.query(queries.getUsersFromName(req.params.name), (err, results) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(results.rows);
  });
});

function updateUser(req: Request, res: Response) {
  const query = queries.updateUser(req.body.name, req.body.mail, req.params.id);
  pool.query(query, (err) => {
    if (err) return res.status(500).send(err);

    if (req.body.password)
      validatePasswd(req, res, () => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          const query = queries.updateUserPassword(req.params.id, hash);
          pool.query(query, (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Could not update password" });

            return res.status(200).json({ message: "Polyuser updated" });
          });
        });
      });
    else return res.status(200).json({ message: "Polyuser updated" });
  });
}

function updatePermissions(req: Request, res: Response) {
  const query = queries.updateUserPermission(req.body.changes);
  pool.query(query, (err) => {
    if (err) res.status(500).send(err);
    else res.status(200).json({ message: "Polyuser(s) updated" });
  });
}
module.exports = router;
