// signup.js - Full working version

const otpLength = 6;
let generatedOtp = null;

// Captcha generation
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

// Display captcha on page load
document.addEventListener('DOMContentLoaded', () => {
    const captchaTextEl = document.getElementById('captchaText');
    if (captchaTextEl) captchaTextEl.innerText = generateCaptcha();
});

// Generate OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

// ================================================
// CORRECTED OTP SENDING BLOCK (CORS SAFE)
// ================================================
document.getElementById('sendOtpBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    if (!email) { 
        alert("Please enter your email."); 
        return; 
    }

    generatedOtp = generateOtp().toString();

    const url = "https://script.google.com/macros/s/AKfycbx3q9qZyIQ4OgGyZ8sqTz8wnIV0eMYqi3lki3TXQ5BEbMF6MCqQzJv_5tioKdC31RxB/exec";

    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("otp", generatedOtp);

    fetch(url, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert(`OTP sent to ${email}`);
        } else {
            alert("Error sending OTP");
            console.error(data);
        }
    })
    .catch(err => {
        alert("Failed to send OTP");
        console.error(err);
    });
});
// ================================================

// Form submit
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate OTP
    const enteredOtp = document.getElementById('otp').value.trim();
    if (!generatedOtp) {
        alert("Please generate OTP first.");
        return;
    }
    if (parseInt(enteredOtp) !== parseInt(generatedOtp)) {
        alert("Incorrect OTP.");
        return;
    }

    // Validate Captcha
    const enteredCaptcha = document.getElementById('captcha').value.trim().toUpperCase();
    const captchaText = document.getElementById('captchaText').innerText.trim().toUpperCase();
    if (enteredCaptcha !== captchaText) {
        alert("Captcha incorrect.");
        return;
    }

    // Save user data locally (for demo)
    const userData = {
        firstName: document.getElementById('firstName').value.trim(),
        surname: document.getElementById('surname').value.trim(),
        gender: document.getElementById('gender').value,
        country: document.getElementById('country').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value.trim(),
        pincode: document.getElementById('pincode').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        email: document.getElementById('email').value.trim(),
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };

    localStorage.setItem('user_' + userData.username, JSON.stringify(userData));

    // Show success popup
    const box = document.getElementById('successBox');
    box.innerHTML = "Signup successful! You can now login.";
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 5000);

    // Reset form and regenerate captcha
    document.getElementById('signupForm').reset();
    document.getElementById('captchaText').innerText = generateCaptcha();
    generatedOtp = null;
});
