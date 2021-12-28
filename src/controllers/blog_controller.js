import Blog from "../models/blogs";

exports.blogs_get = (req, res, next) => {
  Blog.find().exec((err, results) => {
    if (err) {
      return next(err);
    }

    res.send(results);
  });
};

exports.blog_get = (req, res, next) => {
  console.log(req.params, "check");
  Blog.findById(req.params.id).exec((err, results) => {
    if (err) {
      return next(err);
    }

    res.send(results);
  });
};
