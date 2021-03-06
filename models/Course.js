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
  description: {
    type: String,
    required: true,
  },

  course: {
    type: String,
  },
});

mongoose.model("courses", Course);
