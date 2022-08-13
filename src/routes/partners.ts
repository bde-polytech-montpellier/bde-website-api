import { pool } from "../db";
import formidable, { File } from "formidable";
import uploadImage from "../services/uploadImg";
import queries from "../queries/partnershipQueries";
import express, { Request, Response } from "express";
import { validateAdmin } from "../middlewares/validateToken";
import { checkMail } from "../middlewares/partners";
import {v4 as uuidv4} from "uuid"

const router = express.Router();
const form = formidable({ multiples: true });

router
  .route("/")
  .get((req, res) => {
    pool.query(queries.listEveryPartners(), (err, results) => {
      if (err) res.status(500).json({ message: "Could not list partners" });
      else res.status(200).json(results.rows);
    });
  })
  .post((req, res) => {
    validateAdmin(req.headers.authorization, res, async () => {
      form.parse(req, (err, fields, files) => {
        checkMail(fields.mail as string, res, () => {
          if (err)
            return res.status(500).json({ message: "Could not parse data" });
          return registerPartner(fields, files.pic as File, res);
        });
      });
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    pool.query(queries.getPartner(req.params.id), (err, results) => {
      if (err) return res.status(500).json({ message: "Could not get partner" });
      else return res.status(200).json(results.rows);
    });
  })
  .put((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      form.parse(req, (err, fields, files) => {
        checkMail(fields.mail as string, res, () => {
          if (err)
            return res.status(500).json({ message: "Could not parse data" });
          return updatePartner(req.params.id, fields, files.pic as File, res);
        });
      });
    });
  })
  .delete((req, res) => {
    validateAdmin(req.headers.authorization, res, () => deletePartner(req, res));
  });

router.route("/name/:name").get((req, res) => {
  const query = queries.getPartnersFromName(req.params.name);
  pool.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    else return res.status(200).json(results.rows);
  });
});

function registerPartner(
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  const query = queries.addPartner(
    uuidv4(),
    fields.name as string,
    fields.short_description as string,
    fields.description ? (fields.description as string) : undefined,
    fields.mail ? (fields.mail as string) : undefined,
    fields.website ? (fields.website as string) : undefined
  );
  pool.query(query, async (err, result) => {
    if (file && (fields.imgChanged as string) === "true") {
      await uploadImage(file.filepath, res, (url: any) => {
        console.log(result.rows[0], url.secure_url);
        pool.query(
          queries.setImg(url.secure_url, result.rows[0].partenaire_id),
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
      return res.status(500).json({ message: "Could not register partner" });
    else return res.status(200).json({ message: "Partner added" });
  });
}

async function updatePartner(
  partner: string,
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  console.log(file, fields.imgChanged);
  if (file && (fields.imgChanged as string) === "true") {
    await uploadImage(file.filepath, res, (url: any) => {
      pool.query(queries.setImg(url.secure_url, partner), (err) => {
        if (err)
          return res.status(500).json({ message: "Could not upload image" });
      });
    });
  }

  const query = queries.updatePartner(
    partner,
    fields.name as string,
    fields.short_description as string,
    fields.description ? (fields.description as string) : undefined,
    fields.mail ? (fields.mail as string) : undefined,
    fields.website ? (fields.website as string) : undefined
  );
  pool.query(query, (err) => {
    if (err) return res.status(500).json({ message: "Could not update partner" });
    else return res.status(200).json({ message: "Partner updated" });
  });
}

function deletePartner(req: Request, res: Response) {
  const query = queries.deletePartner(req.params.id);
  pool.query(query, (err) => {
    if (err) return res.status(500).json({ message: "Could not delete partner" });
    else return res.status(200).json({ message: "Partner deleted" });
  });
}

export default router;
