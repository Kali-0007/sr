const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";

let emailForOtp = null;

// Page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if element exists before styling
    const otpSec = document.getElementById('otpSection');
    if(otpSec) otpSec.style.display = 'none';

    const mobile = document.getElementById('mobile');
    if (mobile && (mobile.value === '' || mobile.value === '+91')) {
        mobile.value = '+91';
    }
    setupRealTimeValidations();
});

function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    else console.warn("Error element missing:", id); // Console mein batayega agar ID bhool gaye ho
}

function setupRealTimeValidations() {
    // Mobile Prefix Logic
    const mobile = document.getElementById('mobile');
    if(mobile) {
        mobile.addEventListener('input', (e) => {
            let value = e.target.value;
            value = value.replace(/[^\d+]/g, '');
            if (value.startsWith('+91')) {
                const digits = value.slice(3).replace(/\D/g, '').slice(0, 10);
                e.target.value = '+91' + digits;
            } else {
                const digits = value.replace(/\D/g, '').slice(0, 10);
                e.target.value = '+91' + digits;
            }
        });

        mobile.addEventListener('keydown', (e) => {
            if (mobile.selectionStart < 3) {
                if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                }
            }
        });
    }

    // Password strength
    const password = document.getElementById('password');
    const strengthEl = document.getElementById('passwordStrength');
    if(password && strengthEl) {
        password.addEventListener('input', () => {
            const strength = checkPasswordStrength(password.value);
            strengthEl.textContent = `Password Strength: ${strength.toUpperCase()}`;
            strengthEl.className = `strength-${strength}`;
        });
    }

    // Username availability check
    const username = document.getElementById('username');
    let timeout;
    if(username) {
        username.addEventListener('input', () => {
            clearTimeout(timeout);
            // clearError('usernameError'); // Humne HTML mein simple error handling rakhi hai
            if (username.value.trim().length < 3) return;
            timeout = setTimeout(checkUsernameAvailability, 800);
        });
    }
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
    const usernameEl = document.getElementById('username');
    if(!usernameEl) return;
    const username = usernameEl.value.trim();
    const data = new URLSearchParams({ action: "check-username", username });
    try {
        const res = await fetch(WEB_APP_URL, { method: "POST", body: data });
        const result = await res.json();
        if (result.status === "error") {
            usernameEl.style.borderColor = "#ff6b6b";
        } else {
            usernameEl.style.borderColor = "#00ff9d";
        }
    } catch (err) { console.error(err); }
}

// Send OTP
const sendOtpBtn = document.getElementById('sendOtpBtn');
if(sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return alert("Valid email required");
        }
        sendOtpBtn.innerText = "Sending...";
        sendOtpBtn.disabled = true;
        
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
        } catch (err) { alert("Network error"); }
        finally {
            sendOtpBtn.innerText = "Send OTP";
            sendOtpBtn.disabled = false;
        }
    });
}

// Submit Form
const signupForm = document.getElementById('signupForm');
if(signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mobile = document.getElementById('mobile').value;
        if (!/^\+91[0-9]{10}$/.test(mobile)) {
            return alert('Enter valid 10-digit mobile number');
        }

        const password = document.getElementById('password').value;
        if (checkPasswordStrength(password) !== 'strong') {
            return alert('Password must be strong');
        }

        const otp = document.getElementById('otp').value.trim();
        if (!otp || otp.length !== 6) {
            return alert('Enter 6-digit OTP');
        }

        if (!emailForOtp) return alert("Send OTP first");

        const verifyData = new URLSearchParams({ action: "verify-otp", email: emailForOtp, otp });
        const verifyRes = await fetch(WEB_APP_URL, { method: "POST", body: verifyData });
        const verifyResult = await verifyRes.json();
        
        if (verifyResult.status !== "success") {
            return alert('Incorrect or expired OTP');
        }

        const recaptcha = grecaptcha.getResponse();
        if (!recaptcha) return alert("Please complete reCAPTCHA");

        const userData = {
            firstName: document.getElementById('firstName').value.trim(),
            surname: document.getElementById('surname').value.trim(),
            gender: document.getElementById('gender').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value.trim(),
            mobile,
            email: emailForOtp,
            username: document.getElementById('username').value.trim(),
            password
        };

        const saveData = new URLSearchParams({
            action: "save-user",
            userData: JSON.stringify(userData),
            'g-recaptcha-response': recaptcha
        });

        try {
            const saveRes = await fetch(WEB_APP_URL, { method: "POST", body: saveData });
            const saveResult = await saveRes.json();

            if (saveResult.status === "success") {
                alert("Signup Successful!");
                signupForm.reset();
                grecaptcha.reset();
                emailForOtp = null;
                document.getElementById('otpSection').style.display = 'none';
                document.getElementById('mobile').value = '+91';
                window.location.href = "login.html"; // Redirect to login
            } else {
                alert("Signup failed: " + saveResult.message);
                grecaptcha.reset();
            }
        } catch(err) { alert("Error saving data"); }
    });
}
