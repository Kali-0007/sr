// signup.js – Final & Fully Working Version (Sheet + OTP + Hash + Session)

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

// Page load – show captcha
document.addEventListener('DOMContentLoaded', () => {
    const captchaTextEl = document.getElementById('captchaText');
    if (captchaTextEl) captchaTextEl.innerText = generateCaptcha();
});

// Generate OTP (client-side)
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Your latest Web App URL (यहाँ अपना सबसे नया deployment URL डालो)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw4Qf8yjI_BA-sNg_R8T4AcEYsdcjizyAjudSkb_IBfwi6KSgqb7mV0W6ulOb0A-7aO/exec";

// Send OTP button
document.getElementById('sendOtpBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) return alert("Please enter your email");

    generatedOtp = generateOtp();

    const formData = new URLSearchParams({
        action: "send-otp",
        email: email,
        otp: generatedOtp
    });

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        if (data.status === "success") {
            alert(`OTP sent to ${email}. Please check your inbox (and spam folder).`);
        } else {
            alert("Error sending OTP: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        alert("Failed to send OTP. Check console for details.");
        console.error(err);
    }
});

// Form submit – verify OTP & save to Google Sheet
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // OTP validation
    const enteredOtp = document.getElementById('otp').value.trim();
    if (!generatedOtp) return alert("Please send OTP first");
    if (enteredOtp !== generatedOtp) return alert("Incorrect OTP");

    // Captcha validation
    const enteredCaptcha = document.getElementById('captcha').value.trim().toUpperCase();
    const captchaText = document.getElementById('captchaText').innerText.trim().toUpperCase();
    if (enteredCaptcha !== captchaText) return alert("Captcha incorrect");

    // Collect user data
    const userData = {
        firstName: document.getElementById('firstName').value.trim(),
        surname:   document.getElementById('surname').value.trim(),
        gender:    document.getElementById('gender').value,
        country:   document.getElementById('country').value,
        state:     document.getElementById('state').value,
        city:      document.getElementById('city').value.trim(),
        pincode:   document.getElementById('pincode').value.trim(),
        mobile:    document.getElementById('mobile').value.trim(),
        email:     document.getElementById('email').value.trim(),
        username:  document.getElementById('username').value.trim(),
        password:  document.getElementById('password').value  // plain text – backend में hash होगा
    };

    const formData = new URLSearchParams({
        action: "save-user",
        userData: JSON.stringify(userData)
    });

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: formData
        });
        const result = await response.json();

        if (result.status === "success") {
            alert(`Signup successful! Welcome, ${userData.username}`);
            // Reset form
            document.getElementById('signupForm').reset();
            document.getElementById('captchaText').innerText = generateCaptcha();
            generatedOtp = null;
        } else {
            alert("Signup failed: " + (result.message || "Unknown error"));
        }
    } catch (err) {
        alert("Network error. Please try again.");
        console.error(err);
    }
});
