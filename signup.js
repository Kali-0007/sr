// signup.js – Updated with Mobile +91, Pincode 6-digits, Strong Password, Unique Username Check
// Your latest Web App URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSYl-Ns0Yk7Rn0e1DnFN7jBL5HQOx6l1hiEsQOs1D2Gv5IovgavAmuMkwJD7yzDJP6/exec";

let emailForOtp = null;

// Page load par mobile field mein +91 set karo
document.addEventListener('DOMContentLoaded', () => {
    const mobileField = document.getElementById('mobile');
    if (mobileField && !mobileField.value) {
        mobileField.value = '+91';
    }
    // Real-time validations setup
    setupValidations();
});

// Real-time validations setup function
function setupValidations() {
    // Mobile: Sirf numbers after +91, max 10 digits
    const mobileField = document.getElementById('mobile');
    if (mobileField) {
        mobileField.addEventListener('input', (e) => {
            let value = e.target.value;
            // Sirf +91 ke baad 10 digits allow
            if (value.startsWith('+91')) {
                value = '+91' + value.slice(3).replace(/\D/g, '').slice(0, 10);
            } else {
                value = '+91' + value.replace(/\D/g, '').slice(0, 10);
            }
            e.target.value = value;
        });
        mobileField.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) e.preventDefault(); // Sirf numbers
        });
    }

    // Pincode: Sirf 6 numbers
    const pincodeField = document.getElementById('pincode');
    if (pincodeField) {
        pincodeField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '').slice(0, 6);
            e.target.value = value;
        });
        pincodeField.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });
    }

    // Password strength check real-time
    const passwordField = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength') || createStrengthIndicator(); // Agar HTML mein nahi hai toh create karo
    if (passwordField) {
        passwordField.addEventListener('input', (e) => {
            const strength = checkPasswordStrength(e.target.value);
            updateStrengthIndicator(strength, strengthIndicator);
        });
    }

    // Username real-time unique check
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.addEventListener('blur', async (e) => { // Blur par check (type khatam hone par)
            const username = e.target.value.trim();
            if (username.length < 3) return; // Min length check

            const checkData = new URLSearchParams({
                action: "check-username",
                username: username
            });

            try {
                const response = await fetch(WEB_APP_URL, { method: "POST", body: checkData });
                const result = await response.json();
                if (result.status === "error") {
                    showFieldError('username', result.message);
                } else {
                    clearFieldError('username');
                }
            } catch (err) {
                console.error('Username check failed:', err);
            }
        });
    }
}

// Password strength check function
function checkPasswordStrength(password) {
    const minLength = 10;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (password.length >= minLength) score++;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (score === 5) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
}

// Strength indicator update
function updateStrengthIndicator(strength, indicator) {
    indicator.textContent = `Password Strength: ${strength.toUpperCase()}`;
    indicator.className = `strength-${strength}`;
    // Colors: CSS mein add karo ya inline style
    if (strength === 'strong') indicator.style.color = 'green';
    else if (strength === 'medium') indicator.style.color = 'orange';
    else indicator.style.color = 'red';
}

// Strength indicator create (agar HTML mein nahi hai)
function createStrengthIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'passwordStrength';
    indicator.style.marginTop = '5px';
    document.getElementById('password').parentNode.appendChild(indicator);
    return indicator;
}

// Error show/clear for fields
function showFieldError(fieldId, message) {
    let errorEl = document.getElementById(fieldId + 'Error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = fieldId + 'Error';
        errorEl.style.color = 'red';
        errorEl.style.fontSize = '12px';
        document.getElementById(fieldId).parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearFieldError(fieldId) {
    const errorEl = document.getElementById(fieldId + 'Error');
    if (errorEl) errorEl.remove();
}

// Send OTP button (same as before)
document.getElementById('sendOtpBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) return alert("Please enter your email");

    // Email validation (basic)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Invalid email format");

    emailForOtp = email;

    const formData = new URLSearchParams({
        action: "send-otp",
        email: email
    });

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (data.status === "success") {
            alert(`OTP sent to ${email}. Please check your inbox (and spam/promotions folder).`);
            document.getElementById('otpSection').style.display = 'block';
        } else {
            alert("Error sending OTP: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        alert("Failed to send OTP. Check internet connection.");
        console.error(err);
    }
});

// Form submit – Enhanced with all validations
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validations pehle
    const enteredOtp = document.getElementById('otp').value.trim();
    if (!enteredOtp || enteredOtp.length !== 6) return alert("Please enter the 6-digit OTP");

    if (!emailForOtp) return alert("Please send OTP first");

    // Mobile validation
    const mobile = document.getElementById('mobile').value.trim();
    if (!mobile.startsWith('+91') || mobile.length !== 12 || !/^\+91[0-9]{10}$/.test(mobile)) {
        return showFieldError('mobile', 'Mobile must be +91 followed by 10 digits');
    }

    // Pincode validation
    const pincode = document.getElementById('pincode').value.trim();
    if (pincode.length !== 6 || !/^[0-9]{6}$/.test(pincode)) {
        return showFieldError('pincode', 'Pincode must be exactly 6 digits');
    }

    // Password validation
    const password = document.getElementById('password').value;
    const strength = checkPasswordStrength(password);
    if (strength !== 'strong') {
        return showFieldError('password', 'Password must be strong: Min 10 chars, 1 lowercase, 1 uppercase, 1 number, 1 special char');
    }

    // Username min length (basic frontend check)
    const username = document.getElementById('username').value.trim();
    if (username.length < 3) {
        return showFieldError('username', 'Username must be at least 3 characters');
    }

    // Other fields basic check
    const firstName = document.getElementById('firstName').value.trim();
    const surname = document.getElementById('surname').value.trim();
    if (!firstName || !surname) return alert("First name and surname are required");

    // Step 1: OTP verify (same)
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

        // Step 2: reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length === 0) {
            alert("Please complete the reCAPTCHA.");
            return;
        }

        // User data
        const userData = {
            firstName,
            surname,
            gender: document.getElementById('gender').value,
            country: document.getElementById('country').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value.trim(),
            pincode,
            mobile,
            email: emailForOtp,
            username,
            password
        };

        // Step 3: Save user
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
            document.getElementById('otpSection').style.display = 'none';
            // Clear all errors
            ['mobile', 'pincode', 'password', 'username'].forEach(clearFieldError);
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
