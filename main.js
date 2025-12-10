// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// Light/Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Service Accordion
document.querySelectorAll(".more-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.nextElementSibling.classList.toggle("active");
  });
});
