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

require("./models/Message");
const Message = mongoose.model("messages");
require("./models/User");
const User = mongoose.model("users");
require("./models/Course");
const Course = mongoose.model("courses");
require("./models/Cupom");
const Cupom = mongoose.model("cupoms");

const { isAdmin } = require("./helpers/isAdmin"); // inside the isAdmin.js, I only want to take the function isAdmin, so I use {isAdmin}

const users = require("./routes/user");
const bcrypt = require("bcryptjs");
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
app.use(express.static(path.join(__dirname + "/public")));
// app.use(express.static(__dirname + "/public"));
// app.use("/static", express.static(path.join(__dirname, "public")));

// If it doenst work, use this:
// app.use(express.static(path.join("public/css")));
// app.use(express.static(path.join("public/js")));
// app.use(express.static(path.join("public/img")));

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

// app.get("/", (req, res) => {
//   Post.find()
//     .lean()
//     .populate("category")
//     .sort({ _id: -1 })
//     .limit(3)
//     .then((posts) => {
//       res.render("index", { posts: posts });
//     })

//     .catch((err) => {
//       req.flash("error_msg", "There was an error");
//       console.log(err);
//       res.redirect("/404");
//     });
// });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  // form validation
  const errors = [];
  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
  ) {
    errors.push({ text: "Nome inválido" });
  }
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    errors.push({ text: "Email inválido" });
  }
  if (
    !req.body.message ||
    typeof req.body.message == undefined ||
    req.body.message == null
  ) {
    errors.push({ text: "Mensagem inválida" });
  }

  if (errors.length > 0) {
    res.render("/", { errors: errors });
  } else {
    const newMessage = new Message({
      // save new Message inside the variable newMessage
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });
    newMessage
      .save()
      .then(() => {
        req.flash("success_msg", "A mensagem foi enviada com sucesso!");
        res.redirect("/");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Houve um erro ao tentar enviar a mensagem. Tente novamente!" + err
        );
        res.redirect("/");
      });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

// validate the register.handlebars form
app.post("/register", (req, res) => {
  // form validation
  const errors = [];
  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
  ) {
    errors.push({ text: "Nome inválido" });
  }
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    errors.push({ text: "E-mail inválido" });
  }

  if (
    !req.body.password ||
    typeof req.body.password == undefined ||
    req.body.password == null
  ) {
    errors.push({ text: "Senha inválida" });
  }

  // if (req.body.name.length < 2) {
  //   errors.push({ text: "Category name is too short" });
  // }

  if (req.body.password.length < 8) {
    errors.push({ text: "A senha tem que ter ao menos 8 caracteres" });
  }

  if (req.body.password != req.body.password2) {
    errors.push({ text: "As senhas não são a mesma. Tente novamente." });
  }
  if (errors.length > 0) {
    res.render("register", { errors: errors });
  } else {
    // verify if the email that the user is trying to register already doesnt exist in the database
    User.findOne({ email: req.body.email })
      .lean()
      .then((user) => {
        if (user) {
          // here, it means that theres already an user with the email (req.body.email) register already
          req.flash(
            "error_msg",
            "Já tem uma conta com esse e-mail no sistema."
          );
          res.redirect("/register");
        } else {
          // register the user in the database
          const newUser = new User({
            // save new User inside the variable newUser
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            // I dont need to pass isAdmin becasue the defalut value is 0 already
            // isAdmin: 1,
          });
          // I cant only save here, I need to hash it:

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                req.flash(
                  "err_msg",
                  "Houve um erro ao salvar o usuário." + err
                );
                res.redirect("/");
              }
              newUser.password = hash;
              // Im getting password that is inside newUser and saying that it = the hash that was created and was passed in the hash parameter (err, hash)
              newUser
                .save()
                .then(() => {
                  req.flash("success_msg", "Usuário criado com sucesso!");
                  res.redirect("/");
                })
                .catch((err) => {
                  req.flash(
                    "error_msg",
                    "Houve um erro ao criar o usuário. Tente novamente." + err
                  );
                  res.redirect("/users/register");
                });
            });
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro interno.");
        res.redirect("/");
      });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

// authentication route
app.post("/login", (req, res, next) => {
  //authenticate() is the function that I will always use to authencicate something
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

app.get("/mensagens", isAdmin, (req, res) => {
  Message.find()
    .sort({ _id: -1 })
    .then((messages) => {
      res.render("showmessages", {
        messages: messages.map((messages) => messages.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao mostrar as mensagens");
      res.redirect("/");
    });
});

app.get("/mensagens", isAdmin, (req, res) => {
  Message.find()
    .lean()
    // the name that I gave in the variable const Post = new Schema in Post.js
    .sort({ _id: -1 })
    .then((messages) => {
      res.render("showmessages", { messages: messages });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as mensagens." + err);
      res.redirect("/");
    });
});

app.get("/cursos-advocaciafeminista", (req, res) => {
  res.render("cursos-advocaciafeminista");
});

app.post("/cursos-advocaciafeminista", (req, res) => {
  // form validation
  const errors = [];
  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
  ) {
    errors.push({ text: "Nome inválido" });
  }
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    errors.push({ text: "Email inválido" });
  }

  if (errors.length > 0) {
    res.render("/cursos-advocaciafeminista", { errors: errors });
  } else {
    const newCupom = new Cupom({
      // save new cupom inside the variable newcupom
      name: req.body.name,
      email: req.body.email,
    });
    newCupom
      .save()
      .then(() => {
        req.flash("success_msg", "Cupom aceito");
        res.redirect("/cursos-advocaciafeminista");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Houve um erro ao tentar ganhar o desconto. Tente novamente!" + err
        );
        res.redirect("/cursos-advocaciafeminista");
      });
  }
});

app.get("/emails", isAdmin, (req, res) => {
  Cupom.find()
    .sort({ _id: -1 })
    .then((emails) => {
      res.render("showemails", {
        emails: emails.map((emails) => emails.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao mostrar os e-mails cadastrados");
      res.redirect("/cursos-advocaciafeminista");
    });
});

app.get("/emails", isAdmin, (req, res) => {
  Cupom.find()
    .lean()
    // the name that I gave in the variable const Post = new Schema in Post.js
    .sort({ _id: -1 })
    .then((emails) => {
      res.render("showemails", { emails: emails });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar os e-mails." + err);
      res.redirect("/cursos-advocaciafeminista");
    });
});

// app.get("/courses", (req, res) => {
//   Course.find()
//     .lean()
//     .then((courses) => {
//       res.render("courses", { courses: courses });
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um erro ao listar os cursos.");
//       res.redirect("/");
//     });
// });

// app.get("/courses/:slug", (req, res) => {
//   Course.findOne({ slug: req.params.slug })
//     .lean()
//     .then((course) => {
//       if (course) {
//         res.render("courses-index", { course: course });
//         //post: post is to pass the data of the post it found
//       } else {
//         req.flash("error_msg", "Esse curso não existe.");
//         res.redirect("/");
//       }
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um erro" + err);
//       res.redirect("/");
//     });
// });

app.get("/404", (req, res) => {
  res.send("Error 404");
});

// call routes there are in an specifict file:
app.use("/admin", admin);
app.use("/users", users);

// Others
const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log("Server working" + PORT);
});
