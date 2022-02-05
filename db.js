if (process.env.NODE_ENV == "production") {
  // in heroko
  module.exports = {
    mongoURI:
      "mongodb+srv://mylenavendramini:997812220@cluster0.pihxa.mongodb.net/todacidada?retryWrites=true&w=majority",
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/blogapp" };
}
