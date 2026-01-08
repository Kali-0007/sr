function syncHeaderWithAuth() {
    const userData = localStorage.getItem('user_data') || localStorage.getItem('userToken');
    const loginBtns = document.querySelectorAll('.btn-login');
    const signupBtns = document.querySelectorAll('.btn-signup');

    if (userData) {
        console.log("Syncing Header: User Found");
        loginBtns.forEach(btn => btn.style.setProperty('display', 'none', 'important'));
        signupBtns.forEach(btn => btn.style.setProperty('display', 'none', 'important'));

        // Desktop aur Mobile dono containers ko target karo
        const containers = [
            document.getElementById('desktopNav'),
            document.getElementById('mobileMenu')
        ];

        containers.forEach(container => {
            if (container && !container.querySelector('.btn-dashboard')) {
                const dashBtn = document.createElement('a');
                dashBtn.href = 'dashboard.html';
                dashBtn.className = 'btn-dashboard';
                dashBtn.innerHTML = 'Dashboard <i class="fas fa-user-circle"></i>';
                dashBtn.style.cssText = "background:var(--primary, #007bff); color:white !important; padding:8px 20px; border-radius:25px; text-decoration:none; font-weight:600; margin:5px; display:inline-block;";
                container.appendChild(dashBtn);
            }
        });
    }
}

// Ye line sabse zaroori hai - ye har page par apne aap chalegi
window.addEventListener('load', syncHeaderWithAuth);
