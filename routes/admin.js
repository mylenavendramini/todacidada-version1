const express = require("express");
// const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/Message");
const Message = mongoose.model("messages");

const { isAdmin } = require("../helpers/isAdmin"); // inside the isAdmin.js, I only want to take the function isAdmin, so I use {isAdmin}

// Define routes
router.get("/", isAdmin, (req, res) => {
  res.render("admin/index");
});

router.get("/admin/messages", isAdmin, (req, res) => {
  Message.find()
    .sort({ _id: -1 })
    .then((messages) => {
      res.render("admin/showmessages", {
        messages: messages.map((messages) => messages.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao mostrar as mensagens");
      res.redirect("/admin");
    });
});

router.get("/messages", isAdmin, (req, res) => {
  Message.find()
    .lean()
    // the name that I gave in the variable const Post = new Schema in Post.js
    .sort({ _id: -1 })
    .then((messages) => {
      res.render("admin/showmessages", { messages: messages });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as mensagens.");
      res.redirect("/admin");
    });
});

///////////////////
module.exports = router;
