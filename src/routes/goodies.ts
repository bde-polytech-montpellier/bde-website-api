import { pool } from "../db";
import queries from "../queries/goodieQueries";
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
    pool.query(queries.listEveryGoodie(), (err, results) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(results.rows);
    });
  })
  .post((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      form.parse(req, (err, fields, files) => {
        if (err)
          return res.status(500).json({ message: "Could not parse data" });
        return registerGoodie(fields, files.pic as File, res);
      });
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    pool.query(queries.getGoodie(req.params.id), (err, results) => {
      if (err) res.status(500).send(err);
      else res.status(200).json(results.rows);
    });
  })
  .put((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      form.parse(req, (err, fields, files) => {
        if (err)
          return res.status(500).json({ message: "Could not parse data" });
        return updateGoodie(req.params.id, fields, files.pic as File, res);
      });
    });
  })
  .delete((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      pool.query(queries.deleteGoodie(req.params.id), (err, results) => {
        if (err) res.status(500).send(err);
        else res.status(200).json({ message: "Goodie deleted" });
      });
    });
  });

function registerGoodie(
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  const query = queries.addGoodie(
    uuidv4(),
    fields.name as string,
    fields.description ? (fields.description as string) : undefined,
    fields.price ? Number(fields.price as string) : undefined
  );

  pool.query(query, async (err, results) => {
    if (err)
      return res.status(500).json({ message: "Could not register goodie" });
    if (file && (fields.imgChanged as string) === "true") {
      await uploadImage(file.filepath, res, (url: any) => {
        pool.query(
          queries.setImg(url.secure_url, results.rows[0].goodie_id),
          (err) => {
            if (err)
              return res.status(500).json({ message: "Could not set image" });
          }
        );
      });
    }

    return res.status(200).json({ message: "Goodie registered" });
  });
}

async function updateGoodie(
  goodie: string,
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  if (file && (fields.imgChanged as string) === "true") {
    await uploadImage(file.filepath, res, (url: any) => {
      pool.query(queries.setImg(url.secure_url, goodie), (err) => {
        if (err)
          return res.status(500).json({ message: "Could not set image" });
      });
    });
  }

  const query = queries.updateGoodie(
    goodie,
    fields.name as string,
    fields.description ? (fields.description as string) : undefined,
    fields.price ? Number(fields.price as string) : undefined
  );

  pool.query(query, async (err) => {
    if (err)
      return res.status(500).json({ message: "Could not update goodie" });
    else return res.status(200).json({ message: "Goodie updated" });
  });
}

export default router;
