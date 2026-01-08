// Is file ka kaam hai header ke buttons ko login ke hisaab se badalna
function syncHeaderWithAuth() {
    const userToken = localStorage.getItem('userToken');
    
    // Desktop Buttons
    const dLogin = document.getElementById('headerLoginBtn');
    const dSignup = document.getElementById('headerSignupBtn');
    const dDash = document.getElementById('headerDashboardBtn');

    // Mobile Buttons
    const mLogin = document.getElementById('mobileLoginBtn');
    const mSignup = document.getElementById('mobileSignupBtn');
    const mDash = document.getElementById('mobileDashboardBtn');

    if (userToken) {
        // Agar user login hai, toh Dashboard dikhao
        if(dLogin) dLogin.style.display = 'none';
        if(dSignup) dSignup.style.display = 'none';
        if(dDash) dDash.style.display = 'inline-block';

        if(mLogin) mLogin.style.display = 'none';
        if(mSignup) mSignup.style.display = 'none';
        if(mDash) mDash.style.display = 'block';
        console.log("Header Sync: User Logged In");
    } else {
        // Agar login nahi hai, toh Login/Signup dikhao (security ke liye)
        if(dLogin) dLogin.style.display = 'inline-block';
        if(dSignup) dSignup.style.display = 'inline-block';
        if(dDash) dDash.style.display = 'none';
    }
}

// Ye function hum har page ke fetch() ke baad call karenge
