const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSYl-Ns0Yk7Rn0e1DnFN7jBL5HQOx6l1hiEsQOs1D2Gv5IovgavAmuMkwJD7yzDJP6/exec";

let emailForOtp = null;

// Page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('otpSection').style.display = 'none';
    document.getElementById('mobile').value = '+91';
    setupRealTimeValidations();
});

function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}

function setupRealTimeValidations() {
    // Mobile: +91 fixed + 10 digits only
    const mobile = document.getElementById('mobile');
    mobile.addEventListener('input', () => {
        let val = mobile.value.replace(/\D/g, '');
        if (val.length > 10) val = val.slice(0, 10);
        mobile.value = '+91' + val.slice(0, 10);
    });

    // Pincode: 6 digits only
    const pincode = document.getElementById('pincode');
    pincode.addEventListener('input', () => {
        pincode.value = pincode.value.replace(/\D/g, '').slice(0, 6);
    });

    // Password strength
    const password = document.getElementById('password');
    const strengthEl = document.getElementById('passwordStrength');
    password.addEventListener('input', () => {
        const strength = checkPasswordStrength(password.value);
        strengthEl.textContent = `Password Strength: ${strength.toUpperCase()}`;
        strengthEl.className = `strength-${strength}`;
    });

    // Username live check
    const username = document.getElementById('username');
    let timeout;
    username.addEventListener('input', () => {
        clearTimeout(timeout);
        clearError('usernameError');
        clearError('usernameSuccess');
        if (username.value.trim().length < 3) return;
        timeout = setTimeout(checkUsernameAvailability, 800);
    });
}

function checkPasswordStrength(pass) {
    let score = 0;
    if (pass.length >= 10) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    if (score === 5) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
}

async function checkUsernameAvailability() {
    const username = document.getElementById('username').value.trim();
    const data = new URLSearchParams({ action: "check-username", username });
    try {
        const res = await fetch(WEB_APP_URL, { method: "POST", body: data });
        const result = await res.json();
        if (result.status === "error") {
            showError('usernameError', 'Username already taken');
        } else {
            showError('usernameSuccess', 'Username available ✓');
        }
    } catch (err) {
        console.error(err);
    }
}

// Send OTP
document.getElementById('sendOtpBtn').addEventListener('click', async () => {
    clearError('otpError');
    const email = document.getElementById('email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return alert("Valid email required");
    }
    emailForOtp = email;
    const data = new URLSearchParams({ action: "send-otp", email });
    try {
        const res = await fetch(WEB_APP_URL, { method: "POST", body: data });
        const result = await res.json();
        if (result.status === "success") {
            alert("OTP sent! Check inbox/spam.");
            document.getElementById('otpSection').style.display = 'block';
        } else {
            alert("Error: " + (result.message || "Try again"));
        }
    } catch (err) {
        alert("Network error");
    }
});

// Submit Form
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError('otpError');

    // All validations
    const mobile = document.getElementById('mobile').value;
    if (!/^\+91[0-9]{10}$/.test(mobile)) {
        showError('mobileError', 'Enter valid 10-digit mobile number');
        return;
    }

    const pincode = document.getElementById('pincode').value;
    if (!/^[0-9]{6}$/.test(pincode)) {
        showError('pincodeError', 'PIN Code must be 6 digits');
        return;
    }

    const password = document.getElementById('password').value;
    if (checkPasswordStrength(password) !== 'strong') {
        showError('passwordError', 'Password must be strong (10+ chars, upper, lower, number, special)');
        return;
    }

    const otp = document.getElementById('otp').value.trim();
    if (!otp || otp.length !== 6) {
        showError('otpError', 'Enter 6-digit OTP');
        return;
    }

    if (!emailForOtp) return alert("Send OTP first");

    // OTP Verify
    const verifyData = new URLSearchParams({ action: "verify-otp", email: emailForOtp, otp });
    const verifyRes = await fetch(WEB_APP_URL, { method: "POST", body: verifyData });
    const verifyResult = await verifyRes.json();
    if (verifyResult.status !== "success") {
        showError('otpError', 'Incorrect or expired OTP');
        return;
    }

    // reCAPTCHA
    const recaptcha = grecaptcha.getResponse();
    if (!recaptcha) return alert("Complete reCAPTCHA");

    // Collect data
    const userData = {
        firstName: document.getElementById('firstName').value.trim(),
        surname: document.getElementById('surname').value.trim(),
        gender: document.getElementById('gender').value,
        country: document.getElementById('country').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value.trim(),
        pincode,
        mobile,
        email: emailForOtp,
        username: document.getElementById('username').value.trim(),
        password
    };

    // Save user
    const saveData = new URLSearchParams({
        action: "save-user",
        userData: JSON.stringify(userData),
        'g-recaptcha-response': recaptcha
    });

    const saveRes = await fetch(WEB_APP_URL, { method: "POST", body: saveData });
    const saveResult = await saveRes.json();

    if (saveResult.status === "success") {
        document.getElementById('successBox').style.display = 'block';
        document.getElementById('signupForm').reset();
        grecaptcha.reset();
        emailForOtp = null;
        document.getElementById('otpSection').style.display = 'none';
        document.getElementById('mobile').value = '+91';
    } else {
        alert("Signup failed: " + (saveResult.message || "Unknown error"));
        grecaptcha.reset();
    }
});
