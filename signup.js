// Signup JS - Separate from contact.js

// OTP generation & email via Google Apps Script
const otpLength = 6;
let generatedOtp = null;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Captcha generation
function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

// Display captcha
document.getElementById('captchaText').innerText = generateCaptcha();

// Send OTP button click
document.getElementById('sendOtpBtn').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  if (!email) { alert("Enter email first"); return; }

  generatedOtp = generateOtp();

  // Google Apps Script URL
  const url = 'https://script.google.com/macros/s/AKfycbyqGYwq7qxwdaT0XhVg72swDHa6S2ogCFd3gDRcgd0liGg3TNmakFdbDRWjoDOq0JoU/exec';
  const params = {
    method: 'POST',
    body: JSON.stringify({ email: email, otp: generatedOtp }),
    headers: { 'Content-Type': 'application/json' }
  };

  fetch(url, params)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert("OTP sent to your email.");
      } else {
        alert("Error sending OTP. Try again.");
      }
    })
    .catch(err => console.error(err));
});

// Form submit
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Validate OTP
  const enteredOtp = document.getElementById('otp').value;
  if (parseInt(enteredOtp) !== generatedOtp) {
    alert("Incorrect OTP");
    return;
  }

  // Validate Captcha
  const enteredCaptcha = document.getElementById('captcha').value;
  if (enteredCaptcha !== document.getElementById('captchaText').innerText) {
    alert("Captcha incorrect");
    return;
  }

  // Save user data (for demo, storing in localStorage)
  const userData = {
    firstName: document.getElementById('firstName').value,
    surname: document.getElementById('surname').value,
    gender: document.getElementById('gender').value,
    country: document.getElementById('country').value,
    state: document.getElementById('state').value,
    city: document.getElementById('city').value,
    pincode: document.getElementById('pincode').value,
    mobile: document.getElementById('mobile').value,
    email: document.getElementById('email').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  };
  localStorage.setItem('user_' + userData.username, JSON.stringify(userData));

  // Show success popup
  const box = document.getElementById('successBox');
  box.style.display = 'block';
  setTimeout(() => { box.style.display = 'none'; }, 5000);

  // Reset form
  document.getElementById('signupForm').reset();
  document.getElementById('captchaText').innerText = generateCaptcha();
  generatedOtp = null;
});
