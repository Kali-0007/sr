document.addEventListener('DOMContentLoaded', () => {
  console.log("Premium GST & Income Tax website loaded");

  // Button click alert (placeholder for real functionality)
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert("This is a placeholder for the actual functionality.");
    });
  });
});
