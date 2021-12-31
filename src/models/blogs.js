const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Blog = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  description: { type: String, required: true },
  created_date: { type: String, required: true },
  edited_date: { type: String },
  published: { type: Boolean, required: true },
});

module.exports = mongoose.model("blog", Blog);
