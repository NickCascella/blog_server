const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
  blog: { type: Schema.Types.ObjectId, ref: "blog", required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
});

module.exports = mongoose.model("comment", Comment);

// type: Schema.Types.ObjectId, ref: "blog"
