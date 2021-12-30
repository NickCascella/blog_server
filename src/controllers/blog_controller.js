import Blog from "../models/blogs";
import Comment from "../models/comment";
import { body, validationResult } from "express-validator";

exports.blogs_get = (req, res, next) => {
  Blog.find().exec((err, results) => {
    if (err) {
      return next(err);
    }

    res.send(results);
  });
};

exports.blog_get = (req, res, next) => {
  Blog.findById(req.params.id).exec((err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
};

exports.blog_comment_get = (req, res, next) => {
  Comment.find({ blog: req.params.id })
    .populate("author")
    .exec((err, results) => {
      if (err) {
        return next(err);
      }

      res.send(results);
    });
};

exports.blog_comment_post = [
  body("data.comment")
    .escape()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Comment must be between 1 - 200 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()]+$/)
    .withMessage("Only certain special characters"),
  (req, res, next) => {
    req.body = req.body.data;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.send({
        errors: errors.array(),
      });
      return;
    }
    const comment = new Comment({
      blog: req.body.blog_id,
      body: req.body.comment,
      author: req.context.userId,
      date: req.body.date,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.send("hi");
    });
  },
];

exports.blog_comment_delete = (req, res, next) => {
  Comment.findByIdAndDelete(req.body.blog_comment_id).exec((err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
};

exports.blog_comment_put = [
  body("data.comment.body")
    .escape()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Comment must be between 1 - 200 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()]+$/)
    .withMessage("Only certain special characters"),

  (req, res, next) => {
    req.body = req.body.data;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.send({
        errors: errors.array(),
      });
      return;
    }

    Comment.findByIdAndUpdate(
      { _id: req.body.comment_id },
      { body: req.body.comment.body, date: req.body.comment.date }
    ).exec((err, results) => {
      if (err) {
        return next(err);
      }
      res.send(results);
    });
  },
];
