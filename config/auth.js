const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("../models/User");
const User = mongoose.model("users");

module.exports = function (passport) {
  // authentication system
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        // here I can put what is the field I will analyze and choose email, but it could be userName, for exampleusernameField: "email"
        // passwordField is good when I use a portuguese name, and them I can put "senha", for example
      },
      (email, password, done) => {
        User.findOne({ email: email })
          .lean()
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "This account doesn't exist",
              });
              // done() is a callback function
            } else {
              bcrypt.compare(password, user.password, (error, match) => {
                if (match) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: "Wrong password" });
                }
              });
            }
          })
          .catch((err) => {
            req.flash("error_msg", "There was an error");
          });
        // email: email is to find the user that has the same email that wass passed into the authentication
      }
    )
  );
  // save the user data in a session:
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
