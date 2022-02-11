const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Student = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

mongoose.model("students", Student);
