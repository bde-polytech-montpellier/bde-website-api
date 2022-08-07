import { pool } from "../db";
import queries from "../queries/promoQueries";
import express, { Request, Response } from "express";
import { validateAdmin } from "../middlewares/validateToken";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    pool.query(queries.listEveryPromos(), (err, results) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(results.rows);
    });
  })
  .post((req, res) => {
    validateAdmin(req.headers.authorization!, res, () =>
      registerPromo(req, res)
    );
  });

router
  .route("/:id")
  .get((req, res) => {
    pool.query(queries.getPromo(req.params.id), (err, results) => {
      if (err) return res.status(500).send(err);
      else return res.status(200).json(results.rows);
    });
  })
  .put((req, res) => {
    validateAdmin(req.headers.authorization!, res, () => updatePromo(req, res));
  })
  .delete((req, res) => {
    validateAdmin(req.headers.authorization!, res, () => deletePromo(req, res));
  });

router.route("/name/:name").get((req, res) => {
  const query = queries.getPromosFromName(req.params.name);
  pool.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    else return res.status(200).json(results.rows);
  });
});

function registerPromo(req: Request, res: Response) {
  const query = queries.addPromo(
    req.body.name,
    req.body.description,
    req.body.partner
  );
  pool.query(query, (err) => {
    if (err) return res.status(500).send(err);
    else return res.status(200).json({ message: "Promo registered" });
  });
}

function updatePromo(req: Request, res: Response) {
  const query = queries.updatePromo(
    req.body.name,
    req.body.description,
    req.body.partner,
    req.params.id
  );
  pool.query(query, (err) => {
    if (err) return res.status(500).send(err);
    else return res.status(200).json({ message: "Promo updated" });
  });
}

function deletePromo(req: Request, res: Response) {
  const query = queries.deletePromo(req.params.id);
  pool.query(query, (err) => {
    if (err) return res.status(500).send(err);
    else return res.status(200).json({ message: "Promo deleted" });
  });
}

export default router;
