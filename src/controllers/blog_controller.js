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
  body("data.comment", "Comment must be between 1 - 200 characters long")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  (req, res, next) => {
    req.body = req.body.data;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.send({
        errors: errors.array(),
      });
    }
    const comment = new Comment({
      blog: req.body.blog_id,
      body: req.body.comment,
      author: req.context.userId,
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

exports.blog_comment_put = (req, res, next) => {
  req.body = req.body.data;
  console.log(req.body);
  Comment.findByIdAndUpdate(
    { _id: req.body.comment_id },
    { body: req.body.comment.body }
  ).exec((err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
};
