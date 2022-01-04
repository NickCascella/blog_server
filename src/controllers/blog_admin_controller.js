import Blog from "../models/blogs";
import Comment from "../models/comment";
import { body, validationResult } from "express-validator";

exports.blog_put = [
  body("data.blog_title")
    .escape()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 1 - 50 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()'?:]+$/)
    .withMessage(
      "Only certain special characters are permitted !&$@#%*()_ - Blog Title"
    ),
  body("data.blog_description")
    .escape()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Description must be between 1 - 100 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()_'?:]+$/)
    .withMessage(
      "Only certain special characters are permitted !&$@#%*()_ - Blog Description"
    ),
  body("data.blog_body")
    .escape()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 - 1000 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()'?:]+$/)
    .withMessage(
      "Only certain special characters are permitted !&$@#%*()_ - Blog Body"
    ),
  body("data.blog_edited_date")
    .escape()
    .trim()
    .matches(/^[A-Za-z0-9 .,'!&$@#%*():'?]+$/)
    .withMessage(
      "Only certain special characters are permitted !&$@#%*()_ - Blog edited date"
    ),
  body("data.published").escape().trim(),
  (req, res, next) => {
    const request = req.body.data;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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
      res.status(201).send("Blog updated");
      return;
    });
  },
];

exports.blog_delete = (req, res, next) => {
  Blog.findByIdAndDelete(req.body.blog_id).exec((err_one, results_blog) => {
    if (err_one) {
      return next(err_one);
    }

    Comment.deleteMany({ blog: req.body.blog_id }).exec(
      (err_two, results_comments) => {
        if (err_two) {
          return next(err_two);
        }

        res.status(201).send("Blog and its comments, deleted");
        return;
      }
    );
  });
};

exports.blog_post = [
  body("data.blog_title")
    .escape()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 1 - 50 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()]+$/)
    .withMessage(
      "Only certain special characters are permitted !&$@#%*()_ - Blog Title"
    ),
  body("data.blog_description")
    .escape()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Description must be between 1 - 100 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()_]+$/)
    .withMessage(
      "Only certain special characters are permitted !&$@#%*()_ - Blog Description"
    ),
  body("data.blog_body")
    .escape()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 - 1000 characters long")
    .matches(/^[A-Za-z0-9 .,'!&$@#%*()]+$/)
    .withMessage(
      "Only certain special characters are permitted !&$@#%*()_ - Blog Body"
    ),
  body("data.created_date")
    .escape()
    .trim()
    .matches(/^[A-Za-z0-9 .,'!&$@#%*():-]+$/)
    .withMessage("Only certain special characters"),
  body("data.published").escape().trim(),
  body("data.author").escape().trim(),
  (req, res, next) => {
    const request = req.body.data;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send({
        errors: errors.array(),
      });
      return;
    }

    const blog = new Blog({
      title: request.blog_title,
      body: request.blog_body,
      description: request.blog_description,
      created_date: request.created_date,
      published: request.blog_published,
      author: request.author,
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(201).send("Blog created");
    });
  },
];
