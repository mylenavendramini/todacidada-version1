const express = require("express");
// const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");
require("../models/Post");
const Post = mongoose.model("posts");
const { isAdmin } = require("../helpers/isAdmin"); // inside the isAdmin.js, I only want to take the function isAdmin, so I use {isAdmin}

// Define routes
router.get("/", isAdmin, (req, res) => {
  res.render("admin/index");
});
router.get("/posts", isAdmin, (req, res) => {
  res.send("Post page");
});

// router.get("/categories", (req, res) => {
//   res.render("admin/categories");
// });

router.get("/categories", isAdmin, (req, res) => {
  Category.find()
    .sort({ date: "desc" })
    .then((categories) => {
      res.render("admin/categories", {
        categories: categories.map((category) => category.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error to list the categories");
      res.redirect("/admin");
    });
});

router.get("/categories/add", isAdmin, (req, res) => {
  res.render("admin/addcategories");
});

router.post("/categories/new", isAdmin, (req, res) => {
  // form validation:
  const errors = [];

  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
  ) {
    errors.push({ text: "Invalid name" });
  }
  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    errors.push({ text: "Invalid slug" });
  }

  // I could even put more

  if (req.body.name.length < 2) {
    errors.push({ text: "Category name is too short" });
  }
  if (errors.length > 0) {
    res.render("admin/addcategories", { errors: errors });
  } else {
    const newCategory = {
      // this name and slug (body.) refers to the name in the input (inside addcategories.handlebars)
      name: req.body.name,
      // slug is the link for the categories that will be in the browser URL
      slug: req.body.slug,
    };
    //create a new category:
    new Category(newCategory)
      .save()
      .then(() => {
        req.flash("success_msg", "The category was created successfuly");
        res.redirect("/admin/categories");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "There was an error when you tried to create the category. Try again"
        );
        res.redirect("/admin");
      });
    // To check the categories that the users did:
    // $ mongod
    // > show databases;
    // > use learning;
    // > show collections;
    // > db.users.find()
  }
});

router.get("/categories/edit/:id", isAdmin, (req, res) => {
  Category.findOne({ _id: req.params.id })
    .lean()
    .then((category) => {
      res.render("admin/editcategories", { category: category });
    })
    .catch((err) => {
      req.flash("error_msg", "This category doesnt exist");
      res.redirect("/admin/categories");
    });
});

router.post("/categories/edit", isAdmin, (req, res) => {
  // form validation:
  const errors = [];
  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
  ) {
    errors.push({ text: "Invalid name" });
  }
  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    errors.push({ text: "Invalid slug" });
  }
  if (req.body.name.length < 2) {
    errors.push({ text: "Category name is too short" });
  }
  if (errors.length > 0) {
    // send error message here
    res.render("admin/categories/edit", { errors: errors });
  }

  // apply the editions:
  else {
    Category.findOne({ _id: req.body.id })
      .then((category) => {
        // The name of the category that the user want to edit (category.name) should receive the value that is coming from the edition form (req.body.name):
        category.name = req.body.name;
        category.slug = req.body.slug;
        category
          .save()
          .then(() => {
            req.flash("success_msg", "Category edited successfully");
            res.redirect("/admin/categories");
          })
          .catch((err) => {
            req.flash(
              "error_msg",
              "There was an error to save the category edition"
            );
            res.redirect("/admin/categories");
          });
      })
      .catch((err) => {
        req.flash("error_msg", "There was an error to edit the mesages");
        res.redirect("/admin/categories");
      });
  }
});

router.post("/categories/delete", isAdmin, (req, res) => {
  Category.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Category deleted successfuly");
      // this message is not showing!!
      res.redirect("/admin/categories");
    })
    .catch((err) =>
      req.flash("error_msg", "There was an error deleting the category")
    );
  res.redirect("/admin/categories");
  // which category I want to remove? The one that has the _id req.body.id
  // I use body because this information comes from the form I created in categories.handlebars
});

router.get("/posts1", isAdmin, (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    // the name that I gave in the variable const Post = new Schema in Post.js
    .sort({ data: "desc" })
    .then((posts) => {
      res.render("admin/posts1", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error listing the posts");
      res.redirect("/admin");
    });
});

router.get("/posts1/add", isAdmin, (req, res) => {
  Category.find()
    .lean()
    .then((categories) => {
      // Return all the categories (find), then pass all the categories into the posts1:
      res.render("admin/addpost1", { categories: categories });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error loading the form");
      res.redirect("/admin");
    });
});

router.post("/posts1/new", isAdmin, (req, res) => {
  // form validation:
  const errors = [];
  if (req.body.category == 0) {
    errors.push({ text: "Invalid category, you must register a category" });
  }
  if (
    !req.body.title ||
    typeof req.body.title == undefined ||
    req.body.title == null
  ) {
    errors.push({ text: "Invalid title" });
  }
  if (
    !req.body.description ||
    typeof req.body.description == undefined ||
    req.body.description == null
  ) {
    errors.push({ text: "Invalid description" });
  }
  if (
    !req.body.content ||
    typeof req.body.content == undefined ||
    req.body.content == null
  ) {
    errors.push({ text: "Invalid content" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    errors.push({ text: "Invalid slug" });
  }
  if (req.body.title.length < 2) {
    errors.push({ text: "Title name is too short" });
  }
  if (errors.length > 0) {
    // send error message here
    res.render("admin/addpost1", { errors: errors });
  } else {
    const newPost = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      category: req.body.category,
      slug: req.body.slug,
    };
    new Post(newPost)
      .save()
      .then(() => {
        req.flash("success_msg", "Post created succsessfully");
        res.redirect("/admin/posts1");
      })
      .catch((err) => {
        req.flash("error_msg", "There was an error saving the post" + err);
        res.redirect("/admin/posts1");
      });
  }
});

router.get("/posts1/edit/:id", isAdmin, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    // I use params and not body becase Im using /:id, which is an parameter
    .then((post) => {
      Category.find()
        .lean()
        .then((categories) => {
          res.render("admin/editposts1", {
            categories: categories,
            post: post,
          });
        })
        .catch((err) => {
          req.flash("error_msg", "There was an error listing the categories");
          res.redirect("/admin/posts1");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error loading the edition posts");
      res.redirect("/admin/posts1");
    });
});

router.post("/posts1/edit", isAdmin, (req, res) => {
  // form validation:
  const errors = [];
  if (req.body.category == 0) {
    errors.push({ text: "Invalid category, you must register a category" });
  }
  if (
    !req.body.title ||
    typeof req.body.title == undefined ||
    req.body.title == null
  ) {
    errors.push({ text: "Invalid title" });
  }
  if (
    !req.body.description ||
    typeof req.body.description == undefined ||
    req.body.description == null
  ) {
    errors.push({ text: "Invalid description" });
  }
  if (
    !req.body.content ||
    typeof req.body.content == undefined ||
    req.body.content == null
  ) {
    errors.push({ text: "Invalid content" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    errors.push({ text: "Invalid slug" });
  }
  if (req.body.title.length < 2) {
    errors.push({ text: "Title name is too short" });
  }
  if (errors.length > 0) {
    // send error message here
    res.render("admin/editpost1", { errors: errors });
  } else {
    Post.findOne({ _id: req.body.id })

      .then((post) => {
        post.title = req.body.title;
        post.slug = req.body.slug;
        post.description = req.body.description;
        post.content = req.body.content;
        post.category = req.body.category;

        post
          .save()
          .then(() => {
            req.flash("success_msg", "Post was edited successfully");
            res.redirect("/admin/posts1");
          })
          .catch((err) => {
            req.flash("error_msg", "There was an error editing the post");
            console.log(err);
            res.redirect("/admin/posts1");
          });
      })
      .catch((err) => {
        req.flash("error_msg", "There was an error saving the edition");
        console.log(err);
        res.redirect("/admin/posts1");
      });
  }
});

// Its better to do like I did in the categories, but theres this way to delete stuffs:
router.get("/posts1/delete/:id", isAdmin, (req, res) => {
  Post.remove({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Post deleted successfully");
      res.redirect("/admin/posts1");
    })
    .catch((err) => {
      req.flash("error_msg", "Theres was an error deleting the post");
      res.redirect("/admin/posts1/");
    });
});

///////////////////
module.exports = router;
