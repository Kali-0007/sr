// header.js - FINAL FIXED VERSION (no document.write)

(function() {
    // Sirf ek baar chalao + agar header pehle se ho to skip karo
    if (document.querySelector('header')) {
        console.log('Header already exists, skipping...');
        return;
    }

    const headerHTML = `
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
  <a href="https://wa.me/91XXXXXXXXXX" class="sticky-btn" style="color: #25D366;">
    <i class="fab fa-whatsapp"></i><span>WhatsApp</span>
  </a>
  <a href="tel:+91XXXXXXXXXX" class="sticky-btn">
    <i class="fas fa-phone-alt"></i><span>Call Now</span>
  </a>
  <a href="contact.html" class="sticky-btn" style="color: var(--primary);">
    <i class="fas fa-envelope"></i><span>Enquiry</span>
  </a>
</div>
    `;

    // Header ko body ke sabse upar daalo
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Mobile menu toggle
    window.toggleMenu = function() {
        const menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.toggle('active');
    };
})();
