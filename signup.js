let startTime = Date.now(); // Page khulte hi timer shuru
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";
// --- NEW: Helper to get security fingerprint ---
async function getSecurityData() {
    let ip = "Unknown";
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch (e) { console.error("IP fetch failed"); }

 
    let timeInSeconds = Math.round((Date.now() - startTime) / 1000);

    return {
        ip: ip,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenRes: window.screen.width + "x" + window.screen.height,
        timeTaken: timeInSeconds + " seconds" 
    };
}
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
// --- UPDATED: Submit Form with 18 Columns Security ---
if(signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageDiv = document.getElementById('message');
        // --- Firstly: Checkbox ticking made required ---
        const consentCheckbox = document.getElementById('privacyConsent');
        if (!consentCheckbox || !consentCheckbox.checked) {
            alert('Please accept the Privacy Policy to register.');
            return; 
        }
        // Basic Validations
        const mobile = document.getElementById('mobile').value;
        if (!/^\+91[0-9]{10}$/.test(mobile)) return alert('Enter valid 10-digit mobile number');

        const password = document.getElementById('password').value;
        if (checkPasswordStrength(password) !== 'strong') return alert('Password must be strong');

        const otp = document.getElementById('otp').value.trim();
        if (!otp || otp.length !== 6) return alert('Enter 6-digit OTP');

        if (!emailForOtp) return alert("Send OTP first");

        // UI Feedback
        messageDiv.innerHTML = '<span style="color: #667eea;">Verifying security and creating account...</span>';

        try {
            // Step 1: OTP Verification
            const verifyData = new URLSearchParams({ action: "verify-otp", email: emailForOtp, otp });
            const verifyRes = await fetch(WEB_APP_URL, { method: "POST", body: verifyData });
            const verifyResult = await verifyRes.json();
            
            if (verifyResult.status !== "success") {
                messageDiv.innerHTML = '<span style="color: #ff6b6b;">Incorrect or expired OTP</span>';
                return;
            }

            // Step 2: Get Security Fingerprint (IP, Browser, etc.)
            const security = await getSecurityData();

            // Step 3: reCAPTCHA
            const recaptcha = grecaptcha.getResponse();
            if (!recaptcha) {
                messageDiv.innerHTML = '<span style="color: #ff6b6b;">Please complete reCAPTCHA</span>';
                return;
            }

            // Step 4: Prepare Data
           
const userData = {
    firstName: document.getElementById('firstName').value.trim(),
    surname: document.getElementById('surname').value.trim(),
    gender: document.getElementById('gender').value,
    state: document.getElementById('state').value,
    city: document.getElementById('city').value.trim(),
    pincode: document.getElementById('pincode').value.trim(), // <--- YE ZARURI HAI
    mobile,
    email: emailForOtp,
    username: document.getElementById('username').value.trim(),
    password
};

            const saveData = new URLSearchParams({
                action: "save-user",
                userData: JSON.stringify(userData),
                securityData: JSON.stringify(security), // Bhej rahe hain IP, UserAgent, Timezone, ScreenRes
                'g-recaptcha-response': recaptcha
            });

            // Step 5: Final Save to Sheets
            const saveRes = await fetch(WEB_APP_URL, { method: "POST", body: saveData });
            const saveResult = await saveRes.json();

            if (saveResult.status === "success") {
                messageDiv.innerHTML = '<span style="color: #00ff9d;">Signup Successful! Redirecting...</span>';
                setTimeout(() => { window.location.href = "login.html"; }, 2000);
            } else {
                messageDiv.innerHTML = '<span style="color: #ff6b6b;">' + saveResult.message + '</span>';
                grecaptcha.reset();
            }
        } catch(err) { 
            messageDiv.innerHTML = '<span style="color: #ff6b6b;">Connection error. Try again.</span>';
        }
    });
}
