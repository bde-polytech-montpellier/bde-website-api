import express, { Request, Response } from "express";
const router = express.Router();
// const middlewares = require("../middleware/user");

const clubs = require("./clubs");
const events = require("./events");
const roles = require("./roles.ts");
const partners = require("./partners");
const polyusers = require("./polyusers");
const promos = require("./promos");
const tokenGen = require("../services/tokenGenerator");
const signup = require("./signup");
const signin = require("./signin");

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
