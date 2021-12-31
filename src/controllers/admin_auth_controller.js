import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/users";
import passport from "passport";
const jwt = require("jsonwebtoken");
import "dotenv/config";

exports.login_post = [
  body("data.username")
    .escape()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 - 20 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()]+$/)
    .withMessage("Only certain special characters"),
  body("data.password", "Password must be between 5 - 10 characters long")
    .trim()
    .isLength({ min: 5, max: 10 })
    .escape(),
  body("data.admin_code", "Incorrect credentials").trim().escape(),

  (req, res, next) => {
    req.body = req.body.data;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      res.send({
        errors: errors.array(),
      });
      return;
    } else if (req.body.admin_code !== process.env.admin_code) {
      let error = [{ msg: "Incorrect credentials" }];
      res.send({
        errors: error,
      });
      return;
    } else {
      passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
          return res.status(400).json({
            message: "Incorrect login",
            user: user,
          });
        }

        req.login(user, { session: false }, (err) => {
          if (err) {
            return res.send(err);
          }

          jwt.sign({ user: user._id }, process.env.secret, (err, token) => {
            if (err) {
              return next(err);
            }
            res.send({ token, user: user.username, userId: user._id });
          });
        });
      })(req, res, next);
    }
  },
];
