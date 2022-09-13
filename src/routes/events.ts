import { pool } from "../db";
import formidable, { File } from "formidable";
import queries from "../queries/eventQueries";
import uploadImage from "../services/uploadImg";
import express, { Request, Response } from "express";
import { validateAdmin } from "../middlewares/validateToken";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const form = formidable({ multiples: true });

router
  .route("/")
  .get((req, res) => {
    pool.query(queries.listEveryEvents(), (err, results) => {
      if (err) res.status(500).json({ message: "Could not list events" });
      else res.status(200).json(results.rows);
    });
  })
  .post((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      form.parse(req, (err, fields, files) => {
        if (err)
          return res.status(500).json({ message: "Could not parse data" });
        return registerEvent(fields, files.pic as File, res);
      });
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    pool.query(queries.getEvent(req.params.id), (err, results) => {
      if (err) res.status(500).json({ message: "Could not get event" });
      else res.status(200).json(results.rows);
    });
  })
  .put((req, res) => {
    validateAdmin(req.headers.authorization, res, () => {
      form.parse(req, (err, fields, files) => {
        if (err)
          return res.status(500).json({ message: "Could not parse data" });
        return updateEvent(req.params.id, fields, files.pic as File, res);
      });
    });
  })
  .delete((req, res) => {
    validateAdmin(req.headers.authorization, res, () => deleteEvent(req, res));
  });

router.route("/name/:name").get((req, res) => {
  const query = queries.getEventsFromName(req.params.name);
  pool.query(query, (err, results) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(results.rows);
  });
});

function registerEvent(
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  const query = queries.addEvent(
    uuidv4(),
    fields.name as string,
    fields.short_description as string,
    fields.description ? (fields.description as string) : undefined,
    fields.date ? new Date(fields.date as string) : undefined,
    fields.time ? (fields.time as string) : undefined,
    fields.place ? (fields.place as string) : undefined,
    fields.datetime ? (fields.datetime as string) : undefined,
    fields.price ? Number(fields.price as string) : undefined,
    fields.follower_price ? Number(fields.follower_price as string) : undefined,
    fields.club_id ? (fields.club_id as string) : undefined
  );
  pool.query(query, async (err, result) => {
    if (file && (fields.imgChanged as string) === "true") {
      await uploadImage(file.filepath, res, (url: any) => {
        pool.query(
          queries.setImg(url.secure_url, result.rows[0].event_id),
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
      return res.status(500).json({ message: "Could not register event" });
    else return res.status(200).json({ message: "Event added" });
  });
}

async function updateEvent(
  event: string,
  fields: formidable.Fields,
  file: formidable.File,
  res: Response
) {
  if (file && (fields.imgChanged as string) === "true") {
    await uploadImage(file.filepath, res, (url: any) => {
      pool.query(queries.setImg(url.secure_url, event), (err) => {
        if (err)
          return res.status(500).json({ message: "Could not upload image" });
      });
    });
  }

  const query = queries.updateEvent(
    event,
    fields.name as string,
    fields.short_description as string,
    fields.description ? (fields.description as string) : undefined,
    fields.date ? new Date(fields.date as string) : undefined,
    fields.time ? (fields.time as string) : undefined,
    fields.place ? (fields.place as string) : undefined,
    fields.datetime ? (fields.datetime as string) : undefined,
    fields.price ? Number(fields.price as string) : undefined,
    fields.follower_price ? Number(fields.follower_price as string) : undefined,
    fields.club_id ? (fields.club_id as string) : undefined
  );

  return pool.query(query, (err) => {
    if (err) return res.status(500).json({ message: "Could not update event" });
    else return res.status(200).json({ message: "Event updated" });
  });
}

function deleteEvent(req: Request, res: Response) {
  const query = queries.deleteEvent(req.params.id);
  pool.query(query, (err) => {
    if (err) return res.status(500).send(err);
    else return res.status(200).json({ message: "Event deleted" });
  });
}
export default router;
