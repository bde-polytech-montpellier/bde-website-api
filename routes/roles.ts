import { pool } from "../db";
import queries from "../queries/roleQueries";
import express from "express";

const router = express.Router();

router.route("/").get((req, res) => {
  pool.query(queries.listEveryRole(), (err, results) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(results.rows);
  });
});

module.exports = router;
