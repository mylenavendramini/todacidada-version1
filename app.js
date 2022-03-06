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
require("./models/Student");
const Student = mongoose.model("students");

require("./models/Course");
const Course = mongoose.model("courses");
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
    defaultLayout: "test",
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
app.use(express.static(path.join(__dirname, "/public")));

// If it doenst work, use this:
app.use(express.static(path.join("public/css")));
app.use(express.static(path.join("public/js")));

// Routes
//main route
// app.get("/", (req, res) => {
//   // res.send("Main route");
//   Post.find()
//     .lean()
//     .populate("category")
//     .sort({ data: "asc" })
//     .then((posts) => {
//       // req.flash("success_msg", "dasdjio");
//       res.render("index", { posts: posts });
//     })
//     .catch((err) => {
//       req.flash("error_msg", "There was an error");
//       console.log(err);
//       res.redirect("/404");
//     });
// });

app.get("/", (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    .sort({ _id: -1 })
    .limit(3)
    .then((posts) => {
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
          .sort({ _id: -1 })
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

app.get("/users/courses", (req, res) => {
  Course.find()
    .lean()
    .then((courses) => {
      res.render("users/courses", { courses: courses });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar os cursos.");
      res.redirect("/");
    });
});

app.get("/courses/:slug", (req, res) => {
  Course.findOne({ slug: req.params.slug })
    .lean()
    .then((course) => {
      if (course) {
        res.render("courses/index", { course: course });
        //post: post is to pass the data of the post it found
      } else {
        req.flash("error_msg", "Esse curso não existe.");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro" + err);
      res.redirect("/");
    });
});

app.get("/form", (req, res) => {
  Course.find()
    .lean()
    .populate("course")
    // the name that I gave in the variable const Post = new Schema in Post.js
    .sort({ _id: -1 })
    .then((courses) => {
      res.render("form/form", { courses: courses });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error listing the courses");
      res.redirect("/");
    });
});

// app.get("/form/:slug", (req, res) => {
//   Course.findOne({ slug: req.params.slug })
//     .lean()
//     .then((course) => {
//       if (course) {
//         res.render("form/form", { course: course });
//         //post: post is to pass the data of the post it found
//       } else {
//         req.flash("error_msg", "Não foi possível abrir a inscrição agora.");
//         res.redirect("/");
//       }
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um erro" + err);
//       res.redirect("/");
//     });
// });

// validate the register.handlebars form
app.post("/form", (req, res) => {
  // form validation
  const errors = [];
  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
  ) {
    errors.push({ text: "Invalid name" });
  }
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    errors.push({ text: "Invalid email" });
  }

  if (errors.length > 0) {
    res.render("users/courses", { errors: errors });
  } else {
    Course.find()
      .lean()
      .then((courses) => {
        // Return all the categories (find), then pass all the categories into the posts1:
        res.render("form/form", { courses: courses });
        const newStudent = new Student({
          // save new Message inside the variable newMessage
          name: req.body.name,
          email: req.body.email,
          course: req.body.course,
        });
        newStudent
          .save()
          .then(() => {
            req.flash("success_msg", "A inscrição foi feita com sucesso!");
            res.redirect("/");
          })
          .catch((err) => {
            req.flash(
              "error_msg",
              "Houve um erro ao tentar fazer sua inscrição. Tente novamente!" +
                err
            );
            res.redirect("/");
          });
      })
      .catch((err) => {
        req.flash("error_msg", "There was an error loading the form");
        res.redirect("/admin");
      });
  }
});

// app.get("/courses/:slug", (req, res) => {
//   Course.findOne({ slug: req.params.slug })
//     .lean()
//     .then((course) => {
//       if (course) {
//         // search in the Course the course that belong to this course that was passed in the :slug
//         Course.find({ course: course._id })
//           .lean()
//           .sort({ _id: -1 })
//           .then((courses) => {
//             res.render("users/courses/addcourses", {
//               courses: courses,
//               course: course,
//             });
//           })
//           .catch((err) => {
//             req.flash("error_msg", "Houve um erro ao mostrar o curso.");
//             console.log(err);
//             res.redirect("/");
//           });
//       } else {
//         req.flash("error_msg", "Esse curso não existe.");
//         res.redirect("/");
//       }
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um erro ao carregar o curso.");
//       console.log(err);
//       res.redirect("/");
//     });
// });

app.get("/about", (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    .sort({ _id: -1 })
    .then((posts) => {
      // req.flash("success_msg", "dasdjio");
      res.render("admin/about", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error");
      console.log(err);
      res.redirect("/404");
    });
});

app.get("/alltheposts", (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    .sort({ _id: -1 })
    .then((posts) => {
      // req.flash("success_msg", "dasdjio");
      res.render("alltheposts", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error");
      console.log(err);
      res.redirect("/404");
    });
});

app.get("/faq", (req, res) => {
  res.render("faq/index");
});

app.get("/course1", (req, res) => {
  res.render("courses/course1");
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
const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log("Server working" + PORT);
});
