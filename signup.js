// signup.js

document.addEventListener("DOMContentLoaded", () => {

  const signupForm = document.getElementById("signupForm");
  const otpSection = document.getElementById("otpSection");
  const usernameSection = document.getElementById("usernameSection");
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const otpInput = document.getElementById("otpInput");
  const generatedOtpBox = document.getElementById("generatedOtp"); // optional: to show OTP in console
  let generatedOtp = "";

  // Function to generate OTP
  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  }

  // Send OTP button click
  sendOtpBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Validate email or mobile number filled
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    if (!email && !mobile) {
      alert("Please enter Email or Mobile number for OTP verification");
      return;
    }

    generatedOtp = generateOtp();
    console.log("Generated OTP (for testing):", generatedOtp); // replace this with email/SMS sending in real project
    alert("OTP sent successfully! Check console (or your email/SMS in real app).");

    // Show OTP input section
    otpSection.style.display = "block";
  });

  // Verify OTP button click
  verifyOtpBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const enteredOtp = otpInput.value.trim();
    if (enteredOtp === generatedOtp) {
      alert("OTP Verified Successfully!");
      otpSection.style.display = "none";
      usernameSection.style.display = "block"; // show username/password creation
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  });

  // Final signup submit
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect all values
    const data = {
      firstName: document.getElementById("firstName").value.trim(),
      surname: document.getElementById("surname").value.trim(),
      gender: document.getElementById("gender").value,
      address1: document.getElementById("address1").value.trim(),
      address2: document.getElementById("address2").value.trim(),
      state: document.getElementById("state").value,
      city: document.getElementById("city").value.trim(),
      pin: document.getElementById("pin").value.trim(),
      mobile: document.getElementById("mobile").value.trim(),
      email: document.getElementById("email").value.trim(),
      username: document.getElementById("username").value.trim(),
      password: document.getElementById("password").value.trim()
    };

    console.log("Signup Data:", data);
    alert("Signup Successful! You can now login with your username and password.");

    signupForm.reset();
    otpSection.style.display = "none";
    usernameSection.style.display = "none";
  });

});
