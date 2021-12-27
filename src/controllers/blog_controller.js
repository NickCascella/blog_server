import Blog from "../models/blogs";

exports.blogs_get = (req, res, next) => {
  Blog.find().exec((err, results) => {
    if (err) {
      return next(err);
    }
    console.log(results);
    res.send(results);
  });
};
