import express from "express";
import DbConnection from "./db/index.js";
import home from "./routes/home/index.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import user from "./routes/user/index.js";
import bodyParser from "body-parser";
import posts from "./routes/post/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public", "client")));
app.set("view engine", "pug");

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

app.use("/", home);
app.use("/user", user);
app.use("/posts", posts);

Promise.all([DbConnection()])
  .then(() => {
    console.log("Server connected to Database successfully");
  })
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log(
        `App listening on port ${process.env.PORT}\nClick the link to connect to the server: http://localhost:${process.env.PORT}`
      );
    });
  });
