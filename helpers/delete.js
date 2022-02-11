// // --------MODAL WINDOW
// const modal = document.querySelector(".modal");
// const overlay = document.querySelector(".overlay");
// const btnCloseModal = document.querySelector(".btn--close-modal");
// const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
// const deleteCategory = document.querySelector(".btn--delete");

// const openModal = function (e) {
//   e.preventDefault();
//   modal.classList.remove("hidden");
//   overlay.classList.remove("hidden");
// };

// const closeModal = function () {
//   modal.classList.add("hidden");
//   overlay.classList.add("hidden");
// };

// // btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

// // deleteCategory.addEventListener("click", function () {
// //   Category.remove({ _id: req.body.id })
// //     .then(() => {
// //       req.flash("success_msg", "Category deleted successfuly");
// //       // this message is not showing!!
// //       res.redirect("/admin/categories");
// //     })
// //     .catch((err) =>
// //       req.flash("error_msg", "Houve um erro ao excluir a categoria.")
// //     );
// //   res.redirect("/admin/categories");
// // });

// btnCloseModal.addEventListener("click", closeModal);
// overlay.addEventListener("click", closeModal);

// document.addEventListener("keydown", function (e) {
//   if (e.key === "Escape" && !modal.classList.contains("hidden")) {
//     closeModal();
//   }
// });
