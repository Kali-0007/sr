/**
 * TaxEasePro Support Hub - Logic extracted from Footer & Dashboard
 */

const supportHub = {
    config: {
        whatsappNumber: "919876543210", // Extracted from footer
        emailAddress: "taxeasepro@zohomail.in", // Extracted from footer
        formspreeId: "xqezdlrb" // Your Callback Form ID
    },

    // 1. WhatsApp Logic
    openWhatsApp: function() {
        const userName = document.getElementById('firstNameDisplay')?.textContent || "User";
        const msg = encodeURIComponent(`Hi TaxEasePro, I am ${userName}. I need expert consultation regarding my dashboard services.`);
        window.open(`https://wa.me/${this.config.whatsappNumber}?text=${msg}`, '_blank');
    },

    // 2. Email Logic
    openEmail: function() {
        const userName = document.getElementById('firstNameDisplay')?.textContent || "User";
        const subject = encodeURIComponent(`Priority Support Request: ${userName}`);
        const body = encodeURIComponent("Dear TaxEase Team,\n\nI need assistance with the following:\n\n[Describe your issue here]\n\nRegards,\n" + userName);
        window.location.href = `mailto:${this.config.emailAddress}?subject=${subject}&body=${body}`;
    },

    // 3. Callback Logic (Triggering your existing footer modal)
    requestCallback: function() {
        // Footer.js mein function ka naam 'ftr_openModal' hai
        if (typeof ftr_openModal === "function") {
            ftr_openModal();
        } else {
            console.error("Footer modal function not found!");
            alert("Please use the 'Request Call Back' button in the footer.");
        }
    },

    // 4. Admin Remark Logic (From Sheet Column X)
    showResponse: function(msg) {
        const card = document.getElementById('adminResponseCard');
        const text = document.getElementById('supportResponseText');
        if (msg && msg.trim() !== "" && msg !== "—") {
            if(card) card.style.display = 'block';
            if(text) text.textContent = msg;
        } else {
            if(card) card.style.display = 'none';
        }
    }
};
