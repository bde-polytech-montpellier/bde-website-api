import router from "./src/routes/router";
import config from "./src/config/default";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import express from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()

const app = express();
const port =
  process.env.PORT == null || process.env.PORT == "" ? 8000 : process.env.PORT;

bodyParser.urlencoded({
  extended: false,
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
});

app.use(cors({ origin: config.client, optionsSuccessStatus: 204 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use("/api", router);

app.get("/authorized", function (req, res) {
  res.send("Secured Resource");
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

export default app;
