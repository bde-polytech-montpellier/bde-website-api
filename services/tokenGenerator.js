require("dotenv").config();

const router = require("express").Router();
const jwt = require("jsonwebtoken");

const tokenKey = process.env.TOKEN_SIGNATURE;

router.route("/").get((req, res) => {
  const token = jwt.sign(
    {
      userid: "b9c0d262-4586-4d0d-a07b-c21d1e397f0e",
      admin: true,
    },
    tokenKey,
    {
      expiresIn: "6h",
    })
  res.status(200).send(token)
})

module.exports = router;;;