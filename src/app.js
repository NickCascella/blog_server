import "dotenv/config";
import express from "express";
import cors from "cors";
import models from "./models";
import routes from "./routes";
import passport from "./passport";
import path from "path";
import bodyParser from "body-parser";
const mongoose = require("mongoose");

const mongoDb = process.env.database;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  };
  req.user = req.user ? req.user : false;
  console.log(req.user, "check");
  next();
});

app.use("/session", routes.session);
app.use("/user", passport.authenticate("jwt", { session: false }), routes.user);
app.use(
  "/blogs",
  passport.authenticate("jwt", { session: false }),
  routes.blog
);
app.use("/messages", routes.message);
app.use("/auth", routes.auth);

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
