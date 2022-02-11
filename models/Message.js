const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
});

// the name of the collection will be users
mongoose.model("messages", Message);
