// signup.js

let generatedOtp = "";

document.getElementById("signupForm").addEventListener("submit", function(e){
    e.preventDefault();

    // Basic validation before OTP send
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;

    if(!email || !mobile){
        alert("Email and Mobile required");
        return;
    }

    // Generate 6-digit OTP
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Call backend to send OTP to email & mobile
    // Example placeholders:
    // sendOtpToEmail(email, generatedOtp);
    // sendOtpToMobile(mobile, generatedOtp);

    alert("OTP sent to your email and mobile (placeholder)");

    // Show OTP section
    document.getElementById("otp-section").style.display = "block";
});

// Verify OTP
document.getElementById("verifyOtpBtn").addEventListener("click", function(){
    const enteredOtp = document.getElementById("otpInput").value;
    if(enteredOtp === generatedOtp){
        alert("OTP verified successfully!");
        document.getElementById("new-credentials").style.display = "block";
    } else {
        alert("Incorrect OTP, try again.");
    }
});

// Create account
document.getElementById("createAccountBtn").addEventListener("click", function(){
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    if(!username || !password){
        alert("Enter username and password");
        return;
    }

    // Call backend to save new user credentials
    // Example placeholder: createAccountBackend(username, password);

    document.getElementById("successBox").style.display = "block";
    setTimeout(() => {
        document.getElementById("successBox").style.display = "none";
        window.location.href = "login.html"; // redirect to login page
    }, 4000);
});
