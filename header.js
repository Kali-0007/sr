// header.js - Yeh version body ready hone ke baad hi chalega

// Function to load header
function loadHeader() {
    // Agar header pehle se exist na kare to hi daalo
    if (document.querySelector('header')) return;

    const headerContent = `
<header>
  <div class="logo">
    <img src="logo.png" alt="TaxEasePro - Professional Tax Consultant Logo" style="height: 40px;">
    <span style="font-size: 18px; font-weight: 700; color: var(--primary);">TaxEasePro</span>
  </div>

  <nav class="nav-links">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="services.html" style="color:var(--primary)">Services</a>
    <a href="contact.html">Contact</a>
    <a href="login.html" style="border: 1px solid var(--primary); padding: 5px 15px; border-radius: 20px; color: var(--primary);">Login</a>
    <a href="signup.html" style="background:var(--primary); padding:6px 18px; border-radius:20px; color: #fff;">Signup</a>
  </nav>

  <i class="fas fa-bars mobile-btn" onclick="toggleMenu()" aria-label="Open Menu"></i>
</header>

<div class="mobile-menu" id="mobileMenu">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="services.html">Services</a>
  <a href="contact.html">Contact</a>
  <hr style="border: 0; border-top: 1px solid #333; margin: 10px 0;">
  <a href="login.html" style="color: var(--primary);">Login to Portal</a>
  <a href="signup.html" style="color: var(--success);">Create Account</a>
</div>

<div class="sticky-bar">
  <a href="https://wa.me/919876543210" class="sticky-btn" style="color: #25D366;">
    <i class="fab fa-whatsapp"></i><span>WhatsApp</span>
  </a>
  <a href="tel:+919876543210" class="sticky-btn">
    <i class="fas fa-phone-alt"></i><span>Call Now</span>
  </a>
  <a href="contact.html" class="sticky-btn" style="color: var(--primary);">
    <i class="fas fa-envelope"></i><span>Enquiry</span>
  </a>
</div>
    `;

    // Ab body ready hai, safely insert karo
    document.body.insertAdjacentHTML('afterbegin', headerContent);
}

// Toggle function
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

// Yeh script ko sahi time pe chalao
if (document.readyState === 'loading') {
    // Agar page abhi load ho raha hai
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    // Agar script body ke baad load ho raha hai (ya page already loaded)
    loadHeader();
}
