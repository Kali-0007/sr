const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const signupBtn = document.getElementById("signupBtn");
const otpRow = document.getElementById("otpRow");
const usernameRow = document.getElementById("usernameRow");
const signupBtnRow = document.getElementById("signupBtnRow");
const successBox = document.getElementById("successBox");

let generatedOtp = "";

// Function to send OTP via your Google Apps Script
sendOtpBtn.addEventListener("click", function () {
  const email = document.getElementById("email").value;
  if (!email) { alert("Please enter email"); return; }

  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  fetch(`https://script.google.com/macros/s/AKfycbyqGYwq7qxwdaT0XhVg72swDHa6S2ogCFd3gDRcgd0liGg3TNmakFdbDRWjoDOq0JoU/exec?email=${email}&otp=${generatedOtp}`)
  .then(response => response.text())
  .then(data => {
    alert("OTP sent to your email!");
    otpRow.style.display = "flex";
  })
  .catch(err => alert("Error sending OTP"));
});

// Verify OTP
verifyOtpBtn.addEventListener("click", function () {
  const enteredOtp = document.getElementById("otp").value;
  if (enteredOtp === generatedOtp) {
    alert("OTP verified successfully!");
    usernameRow.style.display = "flex";
    signupBtnRow.style.display = "flex";
    otpRow.style.display = "none";
  } else {
    alert("Incorrect OTP. Try again.");
  }
});

// Final signup
signupBtn.addEventListener("click", function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username || !password) { alert("Fill username & password"); return; }

  successBox.style.display = "block";
  successBox.innerText = "Signup successful! You can now login.";
  usernameRow.style.display = "none";
  signupBtnRow.style.display = "none";

  // Optional: Save data to backend or localStorage
  // localStorage.setItem(username, JSON.stringify({password: password}));
});
