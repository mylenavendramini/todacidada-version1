const express = require("express");
// const { append } = require("express/lib/response");
// const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
require("../models/Course");
const Course = mongoose.model("courses");
require("../models/Student");
require("../models/Message");
const Message = mongoose.model("messages");
require("../models/Student");
const Student = mongoose.model("students");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// router.get("/register", (req, res) => {
//   res.render("users/register");
// });

// router.get("/register", (req, res) => {
//   Course.find()
//     .lean()
//     .populate("course")
//     // the name that I gave in the variable const Post = new Schema in Post.js
//     .sort({ _id: -1 })
//     .then((courses) => {
//       res.render("users/register", { courses: courses });
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um erro ao abrir as inscrições", err);
//       res.redirect("/");
//     });
// });

// router.get("/register/add", (req, res) => {
//   Course.find()
//     .lean()
//     .then((courses) => {
//       // Return all the categories (find), then pass all the categories into the posts1:
//       res.render("users/register", { courses: courses });
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um errin", err);
//       res.redirect("/");
//     });
// });
// router.get("/courses", (req, res) => {
//   res.render("users/courses");
// });

// router.get("/courses/:slug/add", (req, res) => {
//   Course.find()
//     .lean()
//     .then((courses) => {
//       // Return all the categories (find), then pass all the categories into the posts1:
//       res.render("users/addcourses", { courses: courses });
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um erro ao carregar o curso! :(" + err);
//       res.redirect("/");
//     });
// });

// validate the register.handlebars form
// router.post("/courses/new", (req, res) => {
//   // form validation
//   const errors = [];
//   if (
//     !req.body.name ||
//     typeof req.body.name == undefined ||
//     req.body.name == null
//   ) {
//     errors.push({ text: "Invalid name" });
//   }
//   if (
//     !req.body.email ||
//     typeof req.body.email == undefined ||
//     req.body.email == null
//   ) {
//     errors.push({ text: "Invalid email" });
//   }

//   if (errors.length > 0) {
//     res.render("/", { errors: errors });
//   } else {
//   // register the user in the database
//   const newStudent = {
//     // save new User inside the variable newUser
//     name: req.body.name,
//     email: req.body.email,
//   };
//   new Student(newStudent)
//     .save()
//     .then(() => {
//       req.flash("success_msg", "Inscrição feita com sucesso!");
//       res.redirect("/users/courses");
//     })
//     .catch((err) => {
//       req.flash("error_msg", "Houve um erro ao realizar a inscrição." + err);
//       res.redirect("/users/courses");
//     });
// }
// });

router.get("/contact", (req, res) => {
  res.render("users/contact");
});

// validate the register.handlebars form
router.post("/contact", (req, res) => {
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
  if (
    !req.body.message ||
    typeof req.body.message == undefined ||
    req.body.message == null
  ) {
    errors.push({ text: "Invalid message" });
  }

  if (errors.length > 0) {
    res.render("users/contact", { errors: errors });
  } else {
    // register the user in the database
    // const newMessage = {
    //   // save new Message inside the variable newMessage
    //   name: req.body.name,
    //   email: req.body.email,
    //   message: req.body.message,
    // };
    // //create a new course:
    // new Message(newMessage)
    //   .save()
    //   .then(() => {
    //     req.flash("success_msg", "A mensagem foi enviada com sucesso!");
    //     res.redirect("/");
    //   })
    //   .catch((err) => {
    //     req.flash(
    //       "error_msg",
    //       "Houve um erro ao tentar enviar a mensagem. Tente novamente!" + err
    //     );
    //     console.log(err);
    //     res.redirect("/users/contact");
    //   });
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
        res.redirect("/users/contact");
      });
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

// authentication route
router.post("/login", (req, res, next) => {
  //authenticate() is the function that I will always use to authencicate something
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Logout successfully");
  res.redirect("/");
});

module.exports = router;
