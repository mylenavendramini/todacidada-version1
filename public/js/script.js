"use strict";

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav__links");
const navLink = document.querySelectorAll(".nav__link");
const getCupom = document.querySelector(".get--cupom");
const cupom = document.querySelector(".cupom");
const modalLogin = document.querySelector(".modal--login");
const modalSingUp = document.querySelector(".modal--singup");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModalLogin = document.querySelector(".btn--show-modal--login");
const btnsOpenModalSingUp = document.querySelector(".btn--show-modal--singup");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section2 = document.querySelector("#section--2");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".courses__tab");
const tabsContainer = document.querySelector(".courses__tab-container");
const tabsContent = document.querySelectorAll(".courses__content");
const loginToChange = document.querySelector(".btn--SignUpToChange");
const signUpToChange = document.querySelector(".btn--LoginToChange");

///////////////////////////////////////
// Hamburger menu

// Open hamburger:

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  // overlay.classList.toggle("hidden");
}

// Closing the hamburger when click some link
navLink.forEach((n) => n.addEventListener("click", closeHamburger));

function closeHamburger() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
  // overlay.classList.add("hidden");
}

// Closing the hamburger when click outside

overlay.addEventListener("click", closeHamburger);

// Closing the hamburger when button scape

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
    closeHamburger();
  }
});

///////////////////////////////////////

// Cupom discont

// getCupom.addEventListener("click", showCupom);

// function showCupom() {
//   cupom.classList.remove("hidden");
// }

// // Closing the cupom when click some link
// navLink.forEach((n) => n.addEventListener("click", closecupom));

// function closecupom() {
//   cupom.classList.remove("active");
//   navMenu.classList.remove("active");
//   // overlay.classList.add("hidden");
// }
///////////////////////////////////////
// Button scrolling

/*
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section2.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section2.scrollIntoView({ behavior: "smooth" });
}); */

///////////////////////////////////////
// Page navigation

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   e.preventDefault();

//   // Matching strategy
//   if (e.target.classList.contains("nav__link")) {
//     const id = e.target.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   }
// });

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".courses__tab");

  // Guard clauses
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("courses__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("courses__content--active"));

  // Activate tab
  clicked.classList.add("courses__tab--active");

  // Activate content area
  document
    .querySelector(`.courses__content--${clicked.dataset.tab}`)
    .classList.add("courses__content--active");
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

// const header = document.querySelector(".header");
// const navHeight = nav.getBoundingClientRect().height;

// const stickyNav = function (entries) {
//   const [entry] = entries;
//   // console.log(entry);

//   if (!entry.isIntersecting) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// };

// const headerObserver = new IntersectionObserver(stickyNav, {
//   root: null,
//   threshold: 0,
//   rootMargin: `-${navHeight}px`,
// });

// headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
// const allSections = document.querySelectorAll(".section");

// const revealSection = function (entries, observer) {
//   const [entry] = entries;

//   if (!entry.isIntersecting) return;

//   entry.target.classList.remove("section--hidden");
//   observer.unobserve(entry.target);
// };

// const sectionObserver = new IntersectionObserver(revealSection, {
//   root: null,
//   threshold: 0.15,
// });

// allSections.forEach(function (section) {
//   sectionObserver.observe(section);
//   section.classList.add("section--hidden");
// });

///////////////////////////////////////
