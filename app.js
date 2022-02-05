// Loading modules
const express = require("express");
// const handlebars = require("express-handlebars");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
// const { handle } = require("express/lib/application");
const app = express();
const admin = require("./routes/admin");
const path = require("path"); // module that allows me to work with folders
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Post");
const Post = mongoose.model("posts");
require("./models/Category");
const Category = mongoose.model("categories");
const users = require("./routes/user");
const passport = require("passport");
require("./config/auth")(passport);
const db = require("./db");

// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }); /// ?????

// Config
// Session
app.use(
  session({
    // secret: a key to create a session, I can put anything
    secret: "nodeclass",
    ressave: true,
    saveUninitialized: true,
  })
);
// Passport has to be after session and before flash:
app.use(passport.initialize());
app.use(passport.session());

// Flash has to be under the session:
app.use(flash());
// Middleware
app.use((req, res, next) => {
  // create global variables using local.
  // message when is success
  res.locals.success_msg = req.flash("success_msg");
  // message when is error
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next(); // I have to put next to pass the requisition!!
});
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Handlebars
// app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.engine(
  "handlebars",
  engine({
    extname: "handlebars",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("view engine", "handlebars");
// Mongoose
mongoose.Promise = global.Promise;

mongoose
  .connect(db.mongoURI, { useNewUrlParser: true })

  .then(() => {
    console.log("Connected at mongo");
  })
  .catch((err) => {
    console.log("Error in connection" + err);
  });
// Public
app.use(express.static(path.join(__dirname, "public")));
// If it doenst work, use this:
// app.use(express.static(path.join("public/css")));

// Routes
//main route
app.get("/", (req, res) => {
  // res.send("Main route");
  Post.find()
    .lean()
    .populate("category")
    .sort({ data: "desc" })
    .then((posts) => {
      // req.flash("success_msg", "dasdjio");
      res.render("index", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error");
      console.log(err);
      res.redirect("/404");
    });
});

app.get("/post/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .lean()
    .then((post) => {
      if (post) {
        res.render("post/index", { post: post });
        //post: post is to pass the data of the post it found
      } else {
        req.flash("error_msg", "This post doens't exist");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error");
      res.redirect("/");
    });
});

app.get("/categories", (req, res) => {
  Category.find()
    .lean()
    .then((categories) => {
      res.render("categories/index", { categories: categories });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error listing the categories");
      res.redirect("/");
    });
});
app.get("/categories/:slug", (req, res) => {
  Category.findOne({ slug: req.params.slug })
    .lean()
    .then((category) => {
      if (category) {
        // search in the Post the post that belong to this category that was passed in the :slug
        Post.find({ category: category._id })
          .lean()
          .then((posts) => {
            res.render("categories/posts1", {
              posts: posts,
              categoriy: category,
            });
          })
          .catch((err) => {
            req.flash("error_msg", "There was an error listing the posts");
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "This category doens't exist");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error loading the categories");
      res.redirect("/");
    });
});

app.get("/404", (req, res) => {
  res.send("Error 404");
});

app.get("/posts", (req, res) => {
  res.send("Post list");
});
// call routes there are in an specifict file:
app.use("/admin", admin);
app.use("/users", users);

// Others
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server working" + PORT);
});
