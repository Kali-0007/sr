function syncHeaderWithAuth() {
    const userData = localStorage.getItem('user_data') || localStorage.getItem('userToken');
    
    // IDs ke zariye buttons ko pakdo
    const dLogin = document.getElementById('headerLoginBtn');
    const dSignup = document.getElementById('headerSignupBtn');
    const dDash = document.getElementById('headerDashboardBtn');
    
    // Mobile menu wale buttons (Classes se)
    const mLogin = document.querySelector('#mobileMenu .btn-login');
    const mSignup = document.querySelector('#mobileMenu .btn-signup');

    if (userData) {
        console.log("User Logged In - Updating Header...");

        // Desktop buttons handle karo
        if(dLogin) dLogin.style.display = 'none';
        if(dSignup) dSignup.style.display = 'none';
        if(dDash) dDash.style.display = 'inline-block';

        // Mobile buttons handle karo
        if(mLogin) mLogin.style.display = 'none';
        if(mSignup) mSignup.style.display = 'none';
        
        // Mobile mein Dashboard button add karo agar nahi hai
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.querySelector('.btn-dashboard')) {
            const dashLink = document.createElement('a');
            dashLink.href = 'dashboard.html';
            dashLink.className = 'btn-dashboard';
            dashLink.innerHTML = 'Dashboard';
            dashLink.style.cssText = "color: var(--primary); font-weight: bold; display: block; padding: 10px 0;";
            mobileMenu.appendChild(dashLink);
        }
    }
}

// Page load hote hi chalayein
window.addEventListener('load', syncHeaderWithAuth);
