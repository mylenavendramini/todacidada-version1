const express = require("express");
// const { append } = require("express/lib/response");
// const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");

require("../models/Message");
const Message = mongoose.model("messages");

const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

// validate the register.handlebars form
router.post("/register", (req, res) => {
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
    res.render("users/register", { errors: errors });
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
          res.redirect("/users/register");
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

// router.get("/login", (req, res) => {
//   res.render("login");
// });

// // authentication route
// router.post("/login", (req, res, next) => {
//   //authenticate() is the function that I will always use to authencicate something
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })(req, res, next);
// });

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Logout feito com sucesso!");
  res.redirect("/");
});

module.exports = router;
