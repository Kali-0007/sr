console.log("Home page loaded");
<script>
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault(); // stops page reload

    const box = document.getElementById("successBox");
    box.style.display = "block";

    // auto-hide after 4 seconds
    setTimeout(() => {
        box.style.display = "none";
    }, 4000);
});
</script>
