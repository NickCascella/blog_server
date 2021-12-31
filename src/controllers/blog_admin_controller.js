import Blog from "../models/blogs";
import Comment from "../models/comment";
import { body, validationResult } from "express-validator";

exports.blog_put = [
  body("data.blog_title")
    .escape()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Comment must be between 1 - 200 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()]+$/)
    .withMessage("Only certain special characters"),
  (req, res, next) => {
    const request = req.body.data;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.send({
        errors: errors.array(),
      });
      return;
    }

    Blog.findByIdAndUpdate(
      { _id: request.blog_id },
      {
        title: request.blog_title,
        body: request.blog_body,
        description: request.blog_description,
        edited_date: request.blog_edited_date,
        published: request.blog_published,
      }
    ).exec((err, results) => {
      if (err) {
        return next(err);
      }
      res.send(results);
    });
  },
];

exports.blog_delete = (req, res, next) => {
  console.log(req.body);
  Blog.findByIdAndDelete(req.body.blog_id).exec((err_one, results_blog) => {
    if (err_one) {
      return next(err_one);
    }
    console.log(results_blog, "second");
    Comment.deleteMany({ blog: req.body.blog_id }).exec(
      (err_two, results_comments) => {
        if (err_two) {
          return next(err_two);
        }

        res.status(400).send("DONE");
        return;
      }
    );
  });
};
