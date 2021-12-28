import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/users";
import passport from "passport";
const jwt = require("jsonwebtoken");
import "dotenv/config";

exports.sign_up_post = [
  body("data.username", "Username must be between 3 - 20 characters long")
    .trim()
    .isLength({ min: 3, max: 20 })
    .escape(),

  body("data.password", "Password must be between 5 - 10 characters long")
    .trim()
    .isLength({ min: 5, max: 10 })
    .escape(),

  body(
    "data.password_confirmation",
    "The Password Confirmation field must have the same value as the Password field"
  )
    .exists()
    .custom((value, { req }) => value === req.body.data.password),
  (req, res, next) => {
    req.body = req.body.data;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.send({
        errors: errors.array(),
      });
      return;
    } else {
      User.findOne({ username: req.body.username }).exec(function (
        err,
        results
      ) {
        if (err) {
          return next(err);
        }

        if (results) {
          let errorArray = [];
          let error = {
            msg: "Please choose a different username. User already exists.",
          };
          errorArray.push(error);

          res.send({
            errors: errorArray,
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
              return next(err);
            }
            const user = new User({
              username: req.body.username,
              password: hashedPassword,
            }).save((err) => {
              if (err) {
                return next(err);
              }
              res.send("successful login!");
              //   res.redirect("/home/login");
            });
          });
        }
      });
    }
  },
];

exports.login_post = [
  body("data.username", "Username must be between 3 - 20 characters long")
    .trim()
    .isLength({ min: 3, max: 20 })
    .escape(),

  body("data.password", "Password must be between 5 - 10 characters long")
    .trim()
    .isLength({ min: 5, max: 10 })
    .escape(),
  (req, res, next) => {
    req.body = req.body.data;

    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Something is not right",
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
          res.send({ token });
        });
      });
    })(req, res, next);
  },
];
