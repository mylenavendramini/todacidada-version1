const express = require("express");
// const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");
require("../models/Post");
const Post = mongoose.model("posts");
require("../models/Message");
const Message = mongoose.model("messages");
require("../models/Student");
const Student = mongoose.model("students");
const { isAdmin } = require("../helpers/isAdmin"); // inside the isAdmin.js, I only want to take the function isAdmin, so I use {isAdmin}
require("../models/Course");
const Course = mongoose.model("courses");

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

///////// -- CATEGORIES

router.get("/categories", isAdmin, (req, res) => {
  Category.find()
    .sort({ _id: -1 })
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
      description: req.body.description,
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
          "There was an error when you tried to create the category. Try again" +
            err
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
      req.flash("error_msg", "Houve um erro ao excluir a categoria.")
    );
  res.redirect("/admin/categories");
  // which category I want to remove? The one that has the _id req.body.id
  // I use body because this information comes from the form I created in categories.handlebars
});

// router.get("/categories/delete", isAdmin, (req, res) => {
//   res.render("admin/deletecategories");
//   // which category I want to remove? The one that has the _id req.body.id
//   // I use body because this information comes from the form I created in categories.handlebars
// });

// router.post("/categories/delete-category", isAdmin, (req, res) => {
//   Category.remove({ _id: req.body.id })
//     .then(() => {
//       req.flash("success_msg", "Category deleted successfuly");
//       // this message is not showing!!
//       res.redirect("/admin/categories");
//     })
//     .catch((err) =>
//       req.flash("error_msg", "Houve um erro ao excluir a categoria.")
//     );
//   res.redirect("/admin/categories");
//   // which category I want to remove? The one that has the _id req.body.id
//   // I use body because this information comes from the form I created in categories.handlebars
// });

///////// -- POSTS

router.get("/posts1", isAdmin, (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    // the name that I gave in the variable const Post = new Schema in Post.js
    .sort({ _id: -1 })
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
  if (req.body.title.length < 2) {
    errors.push({ text: "Title name is too short" });
  }
  if (
    !req.body.description ||
    typeof req.body.description == undefined ||
    req.body.description == null
  ) {
    errors.push({ text: "Invalid description" });
  }
  if (
    !req.body.date ||
    typeof req.body.date == undefined ||
    req.body.date == null
  ) {
    errors.push({ text: "Digite a data no formato Dia/Mês/Ano" });
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

  if (errors.length > 0) {
    // send error message here
    res.render("admin/addpost1", { errors: errors });
  } else {
    const newPost = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      date: req.body.date,
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
        post.date = req.body.date;
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

router.get("/admin/posts1", isAdmin, (req, res) => {
  Post.find()
    .sort({ _id: -1 })
    .then((posts) => {
      res.render("posts", {
        posts: posts.map((posts) => posts.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro enviando postagem principal");
      res.redirect("/admin/posts1");
    });
});

///////// -- COURSES

router.get("/courses", isAdmin, (req, res) => {
  Course.find()
    .sort({ _id: -1 })
    .then((courses) => {
      res.render("admin/courses", {
        courses: courses.map((course) => course.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao mostrar os cursos.");
      console.log(err);
      res.redirect("/admin");
    });
});

router.get("/courses/add", isAdmin, (req, res) => {
  res.render("admin/addcourses");
});

router.post("/courses/new", isAdmin, (req, res) => {
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

  if (
    !req.body.description ||
    typeof req.body.description == undefined ||
    req.body.description == null
  ) {
    errors.push({ text: "Invalid description" });
  }

  // I could even put more

  if (req.body.name.length < 2) {
    errors.push({ text: "course name is too short" });
  }
  if (errors.length > 0) {
    res.render("admin/addcourses", { errors: errors });
  } else {
    const newCourse = {
      // this name and slug (body.) refers to the name in the input (inside addcourses.handlebars)
      name: req.body.name,
      // slug is the link for the courses that will be in the browser URL
      slug: req.body.slug,
      description: req.body.description,
    };
    //create a new course:
    new Course(newCourse)
      .save()
      .then(() => {
        req.flash("success_msg", "O curso foi criado com sucesso!");
        res.redirect("/admin/courses");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Houve um erro ao tentar criar um novo curso. Tente novamente!" + err
        );
        console.log(err);
        res.redirect("/admin");
      });
    // To check the courses that the users did:
    // $ mongod
    // > show databases;
    // > use learning;
    // > show collections;
    // > db.users.find()
  }
});

router.get("/courses/edit/:id", isAdmin, (req, res) => {
  Course.findOne({ _id: req.params.id })
    .lean()
    .then((course) => {
      res.render("admin/editcourses", { course: course });
    })
    .catch((err) => {
      req.flash("error_msg", "Este curso não existe!");
      res.redirect("/admin/courses");
    });
});

router.post("/courses/edit", isAdmin, (req, res) => {
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
  if (
    !req.body.description ||
    typeof req.body.description == undefined ||
    req.body.description == null
  ) {
    errors.push({ text: "Invalid description" });
  }
  if (req.body.name.length < 2) {
    errors.push({ text: "course name is too short" });
  }
  if (errors.length > 0) {
    // send error message here
    res.render("admin/courses/edit", { errors: errors });
  }

  // apply the editions:
  else {
    Course.findOne({ _id: req.body.id })
      .then((course) => {
        // The name of the course that the user want to edit (course.name) should receive the value that is coming from the edition form (req.body.name):
        course.name = req.body.name;
        course.slug = req.body.slug;
        course.description = req.body.description;
        course
          .save()
          .then(() => {
            req.flash("success_msg", "Curso editado com sucesso!");
            res.redirect("/admin/courses");
          })
          .catch((err) => {
            req.flash(
              "error_msg",
              "Houve um erro ao salvar o curso. Tente novamente!"
            );
            console.log(err);
            res.redirect("/admin/courses");
          });
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro interno. Desculpe!");
        console.log(err);
        res.redirect("/admin/courses");
      });
  }
});

router.post("/courses/delete", isAdmin, (req, res) => {
  Course.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Curso excluído com sucesso!");
      // this message is not showing!!
      res.redirect("/admin/courses");
    })
    .catch((err) =>
      req.flash("error_msg", "Houve um erro ao excluir o curso.")
    );
  console.log(err);
  res.redirect("/admin/courses");
  // which course I want to remove? The one that has the _id req.body.id
  // I use body because this information comes from the form I created in categories.handlebars
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

router.get("/students", isAdmin, (req, res) => {
  Student.find()
    .lean()
    // the name that I gave in the variable const Post = new Schema in Post.js
    .sort({ _id: -1 })
    .then((students) => {
      res.render("admin/showstudents", { students: students });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as inscriçoes.");
      res.redirect("/admin");
    });
});

router.get("/admin/students", isAdmin, (req, res) => {
  Student.find()
    .sort({ _id: -1 })
    .then((students) => {
      res.render("admin/showstudents", {
        students: students.map((students) => students.toJSON()),
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao mostrar as inscrições");
      res.redirect("/admin");
    });
});

///////////////////
module.exports = router;
