import { pool } from "../db";
import queries from "../queries/roleQueries";
import express from "express";

const router = express.Router();

router.route("/").get((req, res) => {
  pool.query(queries.listEveryRole(), (err, results) => {
    if (err) return res.status(500).json({ message: "Could not list roles" });
    else return res.status(200).json(results.rows);
  });
});

export default router;
