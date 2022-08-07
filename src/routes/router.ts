import express, { Request, Response } from "express";
import clubs from "./clubs";
import events from "./events";
import roles from "./roles";
import partners from "./partners";
import polyusers from "./polyusers";
import promos from "./promos";
import signup from "./signup";
import signin from "./signin";

const router = express.Router();


router.get("/", (req, res) => res.status(200).send("New bde website"));
router.use("/clubs", clubs);
router.use("/events", events);
router.use("/roles", roles);
router.use("/partners", partners);
router.use("/users", polyusers);
router.use("/promos", promos);
router.use("/signup", signup);
router.use("/signin", signin);

export default router;
