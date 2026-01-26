// Koi function nahi, koi event listener nahi, seedha injection
var footerContent = `
<footer style="width: 100%; padding: 60px 5%; background: var(--header-bg); border-top: 1px solid var(--glass-border); box-sizing: border-box; margin-top: 80px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; align-items: start; width: 100%;">
        <div style="text-align: left;">
            <div class="logo" style="font-size: 24px; margin-bottom: 15px;">TaxEasePro</div>
            <p style="color: var(--text-gray); font-size: 14px; line-height: 1.6; max-width: 300px;">
                India's trusted partner network for seamless tax and compliance management.
            </p>
        </div>
        <div style="text-align: center;">
            <h4 style="color: var(--text-main); font-size: 16px; margin-bottom: 20px;">LEGAL</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <a href="privacy-policy.html" style="color: var(--text-gray); text-decoration: none; font-size: 14px;">Privacy Policy</a>
                <a href="terms-conditions.html" style="color: var(--text-gray); text-decoration: none; font-size: 14px;">Terms & Conditions</a>
            </div>
        </div>
        <div style="text-align: right;">
            <h4 style="color: var(--text-main); font-size: 16px; margin-bottom: 20px;">SUPPORT</h4>
            <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-end;">
                <a href="mailto:support.taxeasepro@zohomail.in" style="color: var(--text-gray); text-decoration: none; font-size: 14px;">support.taxeasepro@zohomail.in</a>
                <a href="https://wa.me/919876543210" target="_blank" style="background: #25D366; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center;">WhatsApp Support</a>
            </div>
        </div>
    </div>
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; color: var(--text-gray); font-size: 12px;">
        <span>© 2026 TaxEasePro Compliance Solutions Private Limited.</span>
        <span>Build v2.4.0</span>
    </div>
</footer>`;

document.getElementById("footer-placeholder").innerHTML = footerContent;
