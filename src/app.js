import "dotenv/config";
import express from "express";
import cors from "cors";
import User from "./models/users";
import routes from "./routes";
import passport from "./passport";
import path from "path";
import bodyParser from "body-parser";
const jwt = require("jsonwebtoken");
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
const corsOptions = {
  origin: [
    // "http://localhost:3000",
    // "http://localhost:3006",
    "https://blog-user-portal-top.herokuapp.com",
    "https://agile-plains-23571.herokuapp.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization !== `Bearer ${null}`
  ) {
    let authorization = req.headers.authorization.split(" ")[1];

    jwt.verify(authorization, process.env.secret, async (err, results) => {
      if (err) {
        res.status(401).send("EXPIRED TOKEN");
        return next(err);
      }
      await User.findById(results.user).then((profile) => {
        req.context = { user: profile.username, userId: profile._id };
      });
      next();
    });
  } else {
    next();
  }
});

app.use("/", routes.home);
app.use(
  "/blogs",
  passport.authenticate("jwt", { session: false }),
  routes.blog
);
app.use("/auth", routes.auth);
app.listen(process.env.PORT || 5000 || 3000, () =>
  console.log(`App listening on port ${process.env.PORT}!`)
);
