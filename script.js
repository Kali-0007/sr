document.addEventListener('DOMContentLoaded', () => {
  console.log("Premium glossy website loaded");

  // Example: login/signup button alert
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert("This would link to actual login/signup functionality.");
    });
  });
});
