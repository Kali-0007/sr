function syncHeaderWithAuth() {
    // Check karo ki user login hai ya nahi (Aapka variable 'user_data' ya 'userToken' jo bhi hai)
    const userData = localStorage.getItem('user_data') || localStorage.getItem('userToken');
    
    // 1. Saare Login aur Signup buttons dhoondo (Desktop + Mobile)
    const loginBtns = document.querySelectorAll('.btn-login');
    const signupBtns = document.querySelectorAll('.btn-signup');

    if (userData) {
        console.log("Header Sync: User Logged In - Updating UI...");

        // 2. Login/Signup ko gayab karo
        loginBtns.forEach(btn => btn.style.display = 'none');
        signupBtns.forEach(btn => btn.style.display = 'none');

        // 3. Dashboard button lagao (Desktop aur Mobile dono jagah)
        const containers = [
            document.getElementById('desktopNav'),
            document.getElementById('mobileMenu')
        ];

        containers.forEach(container => {
            // Check karo ki Dashboard button pehle se toh nahi laga
            if (container && !container.querySelector('.btn-dashboard')) {
                const dashBtn = document.createElement('a');
                dashBtn.href = 'dashboard.html';
                dashBtn.className = 'btn-dashboard';
                dashBtn.innerHTML = 'Dashboard <i class="fas fa-user-circle"></i>';
                
                // Button ki styling
                dashBtn.style.cssText = `
                    background: var(--primary, #007bff);
                    color: white !important;
                    padding: 8px 20px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    margin: 5px;
                    display: inline-block;
                `;
                
                container.appendChild(dashBtn);
            }
        });
    } else {
        console.log("Header Sync: No User Logged In");
    }
}
