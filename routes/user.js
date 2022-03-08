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
