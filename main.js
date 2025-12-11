/* main.js — basic interactions: mobile nav, smooth scroll, toast, contact form validation */
document.addEventListener('DOMContentLoaded', function () {
  // ELEMENTS
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const toastRoot = document.getElementById('toast');
  const contactForm = document.getElementById('contactForm');
  const yearEl = document.getElementById('year');

  // set current year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close mobile nav on link click + smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (!target || target === '#') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        // close nav if open (mobile)
        if (mainNav && mainNav.classList.contains('open')) mainNav.classList.remove('open');
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Toast helper (non-blocking)
  function showToast(message, timeout = 3500) {
    const item = document.createElement('div');
    item.className = 'toast-item';
    item.textContent = message;
    toastRoot.appendChild(item);
    setTimeout(() => {
      item.style.transition = 'opacity 300ms ease, transform 300ms ease';
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
      setTimeout(() => toastRoot.removeChild(item), 320);
    }, timeout);
  }

  // Replace placeholder alerts: buttons with .btn that were placeholders
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // allow normal anchor navigation if it links to other pages (external)
      const href = btn.getAttribute('href');
      if (href && href.startsWith('http')) return;
      // Prevent double-handling if form submit
      if (btn.type && btn.type === 'submit') return;
      // Friendly toast for CTA actions (signup/login placeholders)
      if (btn.id === 'getStarted' || btn.id === 'signupBtn' || btn.id === 'loginBtn') {
        e.preventDefault();
        showToast('This is a demo site — signup / login flow not hooked up yet.');
      }
    });
  });

  // Contact form validation & fake submit
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      // simple validation
      if (!name.value.trim()) { showToast('Please enter your name'); name.focus(); return; }
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { showToast('Please enter a valid email'); email.focus(); return; }
      if (!message.value.trim()) { showToast('Please type a message'); message.focus(); return; }

      // simulate send
      showToast('Message sent. We will contact you shortly.');
      contactForm.reset();
    });
  }

  // Accessibility: close mobile nav on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // small console notice for devs
  console.log('TaxGSTPro UI loaded — mobile nav, smooth-scroll, toast, form validation active.');
});
