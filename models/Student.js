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
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
  },
});

mongoose.model("students", Student);
