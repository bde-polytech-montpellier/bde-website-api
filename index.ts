import router from "./src/routes/router";
import config from "./src/config/default";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port =
  process.env.PORT == null || process.env.PORT == "" ? 8000 : process.env.PORT;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
bodyParser.urlencoded({
  extended: true,
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
});

app.use(cors({ origin: config.client, optionsSuccessStatus: 204 }));
app.use(bodyParser.json());
app.use("/api", router);
app.use("/api", limiter);

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

export default app;
