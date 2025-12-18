// signup.js – Updated for Server-side OTP Verification
// Your latest Web App URL (यहाँ अपना सबसे नया deployment URL डालो)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSYl-Ns0Yk7Rn0e1DnFN7jBL5HQOx6l1hiEsQOs1D2Gv5IovgavAmuMkwJD7yzDJP6/exec";

let emailForOtp = null; // Email store karenge verify ke liye

// Send OTP button
document.getElementById('sendOtpBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) return alert("Please enter your email");

    emailForOtp = email; // Store for later verification

    const formData = new URLSearchParams({
        action: "send-otp",
        email: email
        // OTP ab nahi bhej rahe server ko!
    });

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (data.status === "success") {
            alert(`OTP sent to ${email}. Please check your inbox (and spam/promotions folder).`);
            document.getElementById('otpSection').style.display = 'block'; // Agar OTP field hide tha
        } else {
            alert("Error sending OTP: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        alert("Failed to send OTP. Check internet connection.");
        console.error(err);
    }
});

// Form submit – pehle OTP verify karo server se, phir save-user
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const enteredOtp = document.getElementById('otp').value.trim();
    if (!enteredOtp || enteredOtp.length !== 6) return alert("Please enter the 6-digit OTP");

    if (!emailForOtp) return alert("Please send OTP first");

    // Step 1: Server se OTP verify karo
    const verifyData = new URLSearchParams({
        action: "verify-otp",
        email: emailForOtp,
        otp: enteredOtp
    });

    try {
        const verifyResponse = await fetch(WEB_APP_URL, {
            method: "POST",
            body: verifyData
        });
        const verifyResult = await verifyResponse.json();

        if (verifyResult.status !== "success") {
            return alert("Incorrect or expired OTP. Please try again.");
        }

        // OTP sahi hai → ab reCAPTCHA check karo
        const recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length === 0) {
            alert("Please complete the reCAPTCHA.");
            return;
        }

        // User data collect karo
        const userData = {
            firstName: document.getElementById('firstName').value.trim(),
            surname: document.getElementById('surname').value.trim(),
            gender: document.getElementById('gender').value,
            country: document.getElementById('country').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value.trim(),
            pincode: document.getElementById('pincode').value.trim(),
            mobile: document.getElementById('mobile').value.trim(),
            email: emailForOtp,
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value
        };

        // Step 2: Save user
        const saveData = new URLSearchParams({
            action: "save-user",
            userData: JSON.stringify(userData),
            'g-recaptcha-response': recaptchaResponse
        });

        const saveResponse = await fetch(WEB_APP_URL, {
            method: "POST",
            body: saveData
        });
        const saveResult = await saveResponse.json();

        if (saveResult.status === "success") {
            alert(`Signup successful! Welcome, ${userData.username}`);
            document.getElementById('signupForm').reset();
            grecaptcha.reset();
            emailForOtp = null;
            document.getElementById('otpSection').style.display = 'none'; // Agar hide karna hai
        } else {
            alert("Signup failed: " + (saveResult.message || "Unknown error"));
            grecaptcha.reset();
        }
    } catch (err) {
        alert("Network error. Please try again.");
        console.error(err);
        grecaptcha.reset();
    }
});
