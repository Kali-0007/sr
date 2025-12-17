// signup.js – Updated with Google reCAPTCHA v2 (Traditional Captcha Removed)

const otpLength = 6;
let generatedOtp = null;

// Generate OTP (client-side)
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Your latest Web App URL (यहाँ अपना सबसे नया deployment URL डालो)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwUX8CAT_oPEDc7A3EcaPFEMsZmN52KoGOv0OK5Sk6Y4deS5GTgZ3lYjh11HVr7Qres/exec";

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

// Form submit – verify OTP & reCAPTCHA & save to Google Sheet
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // OTP validation
    const enteredOtp = document.getElementById('otp').value.trim();
    if (!generatedOtp) return alert("Please send OTP first");
    if (enteredOtp !== generatedOtp) return alert("Incorrect OTP");

    // reCAPTCHA v2 validation
    const recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse.length === 0) {
        alert("Please verify that you are not a robot (complete reCAPTCHA).");
        return;
    }

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
        userData: JSON.stringify(userData),
        'g-recaptcha-response': recaptchaResponse  // Send reCAPTCHA token to backend
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
            grecaptcha.reset();  // Reset reCAPTCHA after success
            generatedOtp = null;
        } else {
            alert("Signup failed: " + (result.message || "Unknown error"));
            grecaptcha.reset();
        }
    } catch (err) {
        alert("Network error. Please try again.");
        console.error(err);
        grecaptcha.reset();
    }
});
