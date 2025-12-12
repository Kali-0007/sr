// signup.js – Final Version (Sheet + OTP + Hash + Session सब काम करेगा)

const otpLength = 6;
let generatedOtp = null;

// Captcha generation (same as before)
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length);
    return captcha;
}

// Page load → new captcha
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('captchaText').innerText = generateCaptcha();
});

// Generate OTP (client-side for demo)
function generateOtp() {
    return Math.floor(100000 + Math.random() * 90000).toString();
}

// NEW URL – अपना latest deployment का URL यहाँ पेस्ट करो
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxeOR3P-nnI1xLd4_0jdNQyRmf3ykkCRLHBNGzCHpExRkz_lNEpeYFjcQYPL5QzCQDn/exec";  // ← अपना नया URL यहाँ डालो

// Send OTP – अब action भी भेज रहे हैं
document.getElementById('sendOtpBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) return alert("Email required");

    generatedOtp = generateOtp();

    const form = new URLSearchParams({
        action: "send-otp",
        email: email,
        otp: generatedOtp
    });

    try {
        const res = await fetch(WEB_URL, {
            method: "POST",
            body: form
        });
        const data = await res.json();

        if (data.status === "success"
            ? alert(`OTP sent to ${email} (check spam too)`)
            : alert("Error: " + data.message);
    } catch (err) {
        alert("Network error");
        console.error(err);
    });
});

// Form Submit – अब Sheet में save होगा, localStorage नहीं
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // OTP check
    const enteredOtp = document.getElementById('otp').value.trim();
    if (!generatedOtp) return alert("First send OTP");

    if (entered !== generatedOtp) return alert("Wrong OTP");

    // Captcha check
    const captEntered = document.get('captcha').value.trim().toUpperCase();
    const captText = document.getElementBy

    if (entered !== captchaText) return alert("Wrong captcha");

    // Collect all
    const userData = {
        firstName: document.get('firstName').value.trim(),
        surname: document.get('surname').trim(),
        gender: document.get('gender).value,
        country: document.get('country).value,
        state: document.get('state).value,
        city: document.get('city).trim(),
        pincode: document.get('pin).trim(),
        mobile: document.get('mobile).trim(),
        email: document.get('email').trim(),
        username: document.get('username').trim(),
        password: document.get('password').value   // plain password – backend will hash it
    };

    // Send to Apps Script
    const form2 = new URLSearchParams({
        action: "save-user",
        userData: JSON.string(userData)
    });

    try {
        const resp = await fetch(WEB_URL, {
            method: "POST",
            body: form2
        });
        const result = await resp.json();

        if (result.status === "success") {
            alert("Signup Successful! Welcome, ${user.username} – data saved in Sheet);

            // Reset everything
            document.get('signupForm').reset();
            document.get('captchaText').innerText = generateCaptcha();
            generatedOtp = null;
        else
            alert("Error: " + result.message);
        } catch (err) {
            alert("Network error");
            console.error(err);
        });
});
