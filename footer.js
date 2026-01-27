document.write(`
<style>
  footer {
    background: #0a0a0a;
    color: #e0e0e0;
    padding: 100px 20px 40px;
    font-family: 'Inter', sans-serif;
    border-top: 1px solid #222;
    margin-top: 100px;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    /* Is line ko badal kar 6 columns kar lijiye */
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1.5fr; 
    gap: 30px;
  }

  .footer-col h4 {
    color: #00d4ff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
    letter-spacing: 0.5px;
  }

  .footer-col p {
    color: #aaaaaa;
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 24px;
    font-family: 'Georgia', serif;
  }

  .footer-col a {
    color: #bbbbbb;
    text-decoration: none;
    font-size: 15px;
    display: block;
    margin-bottom: 14px;
    transition: all 0.3s ease;
  }

  .footer-col a:hover {
    color: #00d4ff;
    padding-left: 8px;
  }

  .social-icons {
    margin-top: 20px;
  }

  .social-icons a {
    display: inline-block;
    margin-right: 20px;
    font-size: 24px;
    transition: transform 0.3s ease;
  }

  .social-icons a:hover {
    color: #00d4ff;
    transform: translateY(-4px);
  }

  .whatsapp-link {
    color: #25D366 !important;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .callback-footer-btn {
    background: transparent;
    border: 2px solid #00d4ff;
    color: #00d4ff;
    padding: 14px 24px;
    width: 100%;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
  }

  .callback-footer-btn:hover {
    background: #00d4ff;
    color: #000;
  }

  .copyright {
    text-align: center;
    margin-top: 80px;
    padding-top: 40px;
    border-top: 1px solid #222;
    color: #666;
    font-size: 14px;
  }

  /* Modal */
  .modal-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.92);
    backdrop-filter: blur(8px);
    z-index: 10000;
    justify-content: center;
    align-items: center;
  }

  .callback-box {
    background: #111;
    padding: 40px;
    border-radius: 16px;
    width: 90%;
    max-width: 420px;
    border: 1px solid #00d4ff;
    position: relative;
    box-shadow: 0 10px 40px rgba(0, 212, 255, 0.1);
  }

  .callback-box h3 {
    color: #00d4ff;
    margin: 0 0 24px 0;
    font-size: 24px;
  }

  .callback-box input,
  .callback-box textarea {
    width: 100%;
    padding: 14px 16px;
    margin-bottom: 16px;
    background: #1a1a1a;
    border: 1px solid #333;
    color: white;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    border-left: 4px solid #00d4ff;
  }

  .callback-btn {
    background: #00d4ff;
    color: #000;
    border: none;
    padding: 16px;
    width: 100%;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
  }

  .callback-btn:hover {
    background: #00e0ff;
    transform: translateY(-2px);
  }

  .close-modal {
    position: absolute;
    right: 20px;
    top: 16px;
    font-size: 28px;
    color: #aaa;
    cursor: pointer;
  }

  .close-modal:hover {
    color: #fff;
  }

  @media (max-width: 900px) {
    .footer-container {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 40px;
    }
  }

  @media (max-width: 600px) {
    .footer-container {
      grid-template-columns: 1fr;
    }
    footer { padding: 80px 20px 40px; }
  }
</style>

<footer>
  <div class="footer-container">
    <div class="footer-col">
      <h4 style="font-size: 28px; margin-bottom: 16px;">TaxEasePro</h4>
      <p>Expert tax solutions for individuals and businesses. Simplify compliance, maximize savings.</p>
      <div class="social-icons">
        <a href="YOUR_LINKEDIN_URL" target="_blank"><i class="fab fa-linkedin"></i></a>
        <a href="YOUR_INSTAGRAM_URL" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    </div>

    <div class="footer-col">
      <h4>Income Tax</h4>
      <a href="/sr/services.html">ITR Filing</a>
      <a href="/sr/services.html">Business ITR</a>
      <a href="/sr/services.html">Notice Reply</a>
      <a href="/sr/calculator.html#calculator">Tax Calculator</a>
    </div>

    <div class="footer-col">
      <h4>GST Services</h4>
      <a href="/sr/services.html">GST Registration</a>
      <a href="/sr/services.html">Monthly Returns</a>
      <a href="/sr/services.html">GST Revocation</a>
    </div>

    <div class="footer-col">
      <h4>Registration</h4>
      <a href="/sr/services.html">MSME Registration</a>
      <a href="/sr/services.html">Private Limited Company</a>
      <a href="/sr/services.html">Digital Signature</a>
    </div>
<div class="footer-col">
      <h4>Resources</h4>
      <a href="/sr/faqs.html">FAQ</a>
      <a href="/sr/blogs.html">Blogs</a>
     <a href="/sr/partners/">Partner Program</a>
      <a href="/sr/privacy-policy.html">Privacy Policy</a>
      <a href="/sr/terms-of-service.html">Terms of Service</a>
      <a href="/sr/refund-policy.html">Refund Policy</a>
      <a href="/sr/billing-module/billing.html">Billing</a>
    </div>
    <div class="footer-col">
      <h4>Get in Touch</h4>
      <a href="https://wa.me/919876543210?text=Hi%20TaxEasePro,%20I%20need%20expert%20consultation." target="_blank" class="whatsapp-link">
        <i class="fab fa-whatsapp"></i> Chat on WhatsApp
      </a>
      <a href="mailto:taxeasepro@zohomail.in"><i class="fas fa-envelope"></i> taxeasepro@zohomail.in</a>
      <button onclick="ftr_openModal()" class="callback-footer-btn">
        Request Call Back
      </button>
    </div>
  </div>

  <div class="copyright">
    © 2025 TaxEasePro. All rights reserved.
  </div>
</footer>

<div id="ftr_callbackModal" class="modal-overlay">
  <div class="callback-box">
    <span class="close-modal" onclick="ftr_closeModal()">&times;</span>
    <h3>Request a Call Back</h3>
    <form action="https://formspree.io/f/xqezdlrb" method="POST" id="ftr_leadForm">
      <input type="text" name="name" placeholder="Full Name" required>
      <input type="tel" name="phone" placeholder="Mobile Number" required>
      <textarea name="reason" placeholder="How can we help? (e.g. ITR, GST, Notice)" rows="4" required></textarea>
      <button type="submit" class="callback-btn">Submit Request</button>
    </form>
  </div>
</div>

<script>
  function ftr_openModal() {
    document.getElementById('ftr_callbackModal').style.display = 'flex';
  }

  function ftr_closeModal() {
    document.getElementById('ftr_callbackModal').style.display = 'none';
  }

  const ftr_form = document.getElementById('ftr_leadForm');
if (ftr_form) { // Yahan 'form' ki jagah 'ftr_form' kijiye
  ftr_form.onsubmit = async (e) => { // Yahan bhi 'ftr_form'
    e.preventDefault();
    try {
      const response = await fetch(ftr_form.action, { // Yahan bhi 'ftr_form'
        method: 'POST',
        body: new FormData(ftr_form), // Yahan bhi 'ftr_form'
        headers: { 'Accept': 'application/json' }
      });

        if (response.ok) {
          alert("Thank you! Our expert will call you shortly.");
          ftr_form.reset();
          ftr_closeModal();
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (err) {
        alert("Network error. Please check your connection.");
      }
    };
  }
</script>
`);
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("JWT parse error:", e);
        return {};  // empty object return karo taaki crash na ho
    }
}

// ------------------- Google Callback - Yeh pura function replace kar do -------------------
window.handleCredentialResponse = async function(response) {
    console.log("Google One Tap callback called!", response);

    if (!response || !response.credential) {
        console.error("No credential received");
        return;
    }

    const responsePayload = parseJwt(response.credential);

    const statusDiv = document.getElementById('loginStatus');
    if (statusDiv) statusDiv.innerHTML = "Authenticating...";

    try {
        // ── Yeh temporary dummy function bana do ────────────────────────────────
        const getSecurityData = async () => {
            return {
                // Basic security info jo backend ko bhej sakte ho (optional)
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                timestamp: new Date().toISOString(),
                // Agar chahiye to IP le sakte ho (third-party API se, lekin abhi skip)
                // ip: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip)
            };
        };
        // ────────────────────────────────────────────────────────────────────────

        const security = await getSecurityData();  // Ab yeh chalega

        const API_URL = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";

        const backendRes = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "google-login",
                userData: { ...responsePayload, ...security }
            })
        });

        const res = await backendRes.json();
        console.log("Backend response:", res);  // Yeh check karo kya aa raha hai

        if (res.status === "success" && res.token) {
            localStorage.setItem('userToken', res.token);
            localStorage.setItem('username', res.username);

            console.log("Success! Header sync kar rahe hain...");

            if (window.syncHeaderWithAuth) {
                window.syncHeaderWithAuth();
            }

            // Contact page pe rehna hai → reload mat karo
            // Sirf login/signup page pe redirect
            const path = window.location.pathname.toLowerCase();
            if (path.includes("login") || path.includes("signup")) {
                window.location.href = "dashboard.html";
            }

            if (statusDiv) statusDiv.innerHTML = "Logged in successfully!";
        } else {
            alert(res.message || "Login failed");
        }
    } catch (error) {
        console.error("Login process error:", error);
        alert("Kuch galat ho gaya – please try again");
    }
};
