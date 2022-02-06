const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Course = new Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

mongoose.model("courses", Course);
