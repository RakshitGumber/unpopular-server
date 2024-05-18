import express from "express";
import { createServer } from "http";
import DbConnection from "./db/index.js";
import home from "./routes/home/index.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import user from "./routes/user/index.js";
import bodyParser from "body-parser";
import posts from "./routes/post/index.js";

const app = express();
app.use(cors());

const httpServer = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// io.on("connection", (socket) => {});

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
    httpServer.listen(process.env.PORT || 8080, () => {
      console.log(
        "Server Started on " +
          process.env.PORT +
          "\nTo connect, go to: http://localhost:" +
          process.env.PORT
      );
    });
  });
