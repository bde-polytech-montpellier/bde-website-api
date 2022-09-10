import { pool } from "../db";
import queries from "../queries/clubQueries";
import formidable, { File } from "formidable";
import uploadImage from "../services/uploadImg";
import express, { Request, Response } from "express";
import { validateAdmin } from "../middlewares/validateToken";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const form = formidable({ multiples: true });

router
  .route("/")
  .get((req, res) => {
    pool.query(queries.listEveryClub(), (err, results) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(results.rows);
    });
  })
  .post((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      form.parse(req, (err, fields, files) => {
        if (err)
          return res.status(500).json({ message: "Could not parse data" });
        return registerClub(fields, files.pic as File, res);
      });
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    pool.query(queries.getClub(req.params.id), (err, results) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(results.rows);
    });
  })
  .put((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      form.parse(req, (err, fields, files) => {
        if (err)
          return res.status(500).json({ message: "Could not parse data" });
        return updateClub(req.params.id, fields, files.pic as File, res);
      });
    });
  });

function registerClub(
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  const query = queries.addClub(
    uuidv4(),
    fields.name as string,
    fields.short_description as string,
    fields.description ? (fields.description as string) : undefined,
    fields.fb ? (fields.fb as string) : undefined,
    fields.ig ? (fields.ig as string) : undefined
  );
  pool.query(query, async (err, result) => {
    if (file && (fields.imgChanged as string) === "true") {
      await uploadImage(file.filepath, res, (url: any) => {
        pool.query(
          queries.setImg(url.secure_url, result.rows[0].club_id),
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Could not upload image" });
          }
        );
      });
    }
    if (err)
      return res.status(500).json({ message: "Could not register club" });
    else return res.status(200).json({ message: "Club added" });
  });
}

async function updateClub(
  club: string,
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  if (file && (fields.imgChanged as string) === "true") {
    await uploadImage(file.filepath, res, (url: any) => {
      pool.query(queries.setImg(url.secure_url, club), (err) => {
        if (err)
          return res.status(500).json({ message: "Could not upload image" });
      });
    });
  }
  const query = queries.updateClub(
    club,
    fields.name as string,
    fields.short_description as string,
    fields.description ? (fields.description as string) : undefined,
    fields.fb ? (fields.fb as string) : undefined,
    fields.ig ? (fields.ig as string) : undefined
  );
  pool.query(query, (err) => {
    if (err) return res.status(500).json({ message: "Could not update club" });
    else return res.status(200).json({ message: "Club updated" });
  });
}
export default router;
