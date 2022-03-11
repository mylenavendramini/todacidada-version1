const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Number,
    default: 0,
    // when is 0 it means is not admin!
  },

  password: {
    type: String,
    required: true,
  },
});

// the name of the collection will be users
mongoose.model("users", User);
