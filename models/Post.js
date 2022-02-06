const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    // make reference of a category that already exist/store the id of a category
    type: Schema.Types.ObjectId,
    // what kinde of object? the name of the model (Category.js) that is in the end: mongoose.model("categories", Category);
    ref: "categories",
    required: true,
  },
  date: {
    type: String,
    require: true,
    default: Date.now(),
  },
});

// the name of the collection will be posts
mongoose.model("posts", Post);
