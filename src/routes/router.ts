import express, { Request, Response } from "express";
import clubs from "./clubs";
import events from "./events";
import roles from "./roles";
import partners from "./partners";
import polyusers from "./polyusers";
import promos from "./promos";
import tokenGen from "../services/tokenGenerator";
import signup from "./signup";
import signin from "./signin";

const router = express.Router();
// const middlewares = require("../middleware/user");


router.get("/", (req, res) => res.status(200).send("New bde website"));
router.use("/clubs", clubs);
router.use("/events", events);
router.use("/roles", roles);
router.use("/partners", partners);
router.use("/users", polyusers);
router.use("/promos", promos);
router.use("/token", tokenGen);
// router.use("/account", middlewares.isLoggedIn, users);
router.use("/signup", signup);
router.use("/signin", signin);

export default router;
