// header.js - Common Header for all pages

document.addEventListener('DOMContentLoaded', function() {
  // Header HTML content
  const headerHTML = `
    <header>
      <div class="logo">
        <img src="logo.png" alt="TaxEasePro Logo" style="height: 40px;">
        <span style="font-size: 18px; font-weight: 700; color: var(--primary);">TaxEasePro</span>
      </div>

      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="services.html" style="color: var(--primary);">Services</a>
        <a href="contact.html">Contact</a>
        <a href="login.html" style="border: 1px solid var(--primary); padding: 5px 15px; border-radius: 20px; color: var(--primary);">Login</a>
        <a href="signup.html" style="background: var(--primary); padding: 6px 18px; border-radius: 20px; color: #fff;">Signup</a>
      </nav>

      <button class="mobile-btn" id="mobileMenuBtn">
        <i class="fas fa-bars"></i>
      </button>
    </header>

    <!-- Mobile Slide Menu -->
    <div class="mobile-menu" id="mobileMenu">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="contact.html">Contact</a>
      <hr style="border: 0; border-top: 1px solid #333; margin: 10px 0;">
      <a href="login.html" style="color: var(--primary);">Login to Portal</a>
      <a href="signup.html" style="color: var(--success);">Create Account</a>
    </div>

    <!-- Sticky Bottom Bar (Mobile Only) -->
    <div class="sticky-bar">
      <a href="https://wa.me/919876543210" class="sticky-btn" style="color: #25D366;">
        <i class="fab fa-whatsapp"></i>
        <span>WhatsApp</span>
      </a>
      <a href="tel:919876543210" class="sticky-btn">
        <i class="fas fa-phone-alt"></i>
        <span>Call Now</span>
      </a>
      <a href="contact.html" class="sticky-btn" style="color: var(--primary);">
        <i class="fas fa-envelope"></i>
        <span>Enquiry</span>
      </a>
    </div>
  `;

  // Insert header at the top of body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // Add required CSS if not already present
  if (!document.querySelector('#common-header-styles')) {
    const style = document.createElement('style');
    style.id = 'common-header-styles';
    style.textContent = `
      :root {
        --primary: #667eea;
        --secondary: #764ba2;
        --success: #00c853;
        --dark: #0a0a0f;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 5%;
        background: #111;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
        border-bottom: 1px solid #222;
      }

      .logo { display: flex; align-items: center; gap: 10px; }

      .nav-links { display: flex; gap: 15px; align-items: center; }

      .nav-links a { 
        color: #fff; 
        text-decoration: none; 
        font-size: 14px; 
        font-weight: 500; 
        transition: color 0.3s;
      }

      .nav-links a:hover { color: var(--primary); }

      .mobile-btn { 
        display: none; 
        font-size: 24px; 
        color: var(--primary); 
        cursor: pointer; 
        background: none; 
        border: none; 
      }

      .mobile-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: #111;
        padding: 80px 30px;
        flex-direction: column;
        gap: 20px;
        transition: right 0.4s ease;
        z-index: 999;
        border-left: 1px solid #333;
        display: flex;
      }

      .mobile-menu.active { right: 0; }

      .mobile-menu a { color: #fff; text-decoration: none; font-size: 18px; font-weight: 500; }

      .sticky-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: #111;
        display: none;
        justify-content: space-around;
        align-items: center;
        z-index: 2000;
        border-top: 1px solid #333;
      }

      .sticky-btn {
        flex: 1;
        text-align: center;
        color: #fff;
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .sticky-btn i { font-size: 18px; }

      @media (max-width: 768px) {
        .nav-links { display: none; }
        .mobile-btn { display: block; }
        .sticky-bar { display: flex; }
      }
    `;
    document.head.appendChild(style);
  }

  // Mobile menu toggle functionality
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenu.contains(event.target) && !mobileBtn.contains(event.target)) {
        mobileMenu.classList.remove('active');
      }
    });
  }
});
