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
        const email = this.config.emailAddress;
        const subject = encodeURIComponent(`Priority Support Request: ${userName}`);
        const body = encodeURIComponent("Dear TaxEase Team,\n\nI need assistance with the following:\n\n[Describe your issue here]\n\nRegards,\n" + userName);
        
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        } else {
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
            window.open(gmailUrl, '_blank');
        }
    },

    // 3. Callback Logic
    requestCallback: function() {
        if (typeof ftr_openModal === "function") {
            ftr_openModal();
        } else {
            console.error("Footer modal function not found!");
            alert("Please use the 'Request Call Back' button in the footer.");
        }
    },

    // 🔥 4. TICKETING LOGIC (YAHAN ADD KIYA HAI)
   submitTicket: function() {
        const queryField = document.getElementById('userSupportQuery');
        const query = queryField.value.trim();
        const userName = document.getElementById('firstNameDisplay')?.textContent || "Unknown User";
        const userEmail = localStorage.getItem('userEmail') || "Guest"; 

        if (!query) {
            alert("Bhai, kuch toh likho! Khali ticket submit nahi hoga.");
            return;
        }

        // Button reference to show loading
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "Submitting...";
        btn.disabled = true;

        // 🔥 APNA SCRIPT URL YAHAN DALO (Deployment wala)
        const SCRIPT_URL = "APNA_G_SCRIPT_WEBAPP_URL_YAHAN_DALO";

        // Fetch API use kar rahe hain taaki "google is not defined" error na aaye
        fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Google Script bypass ke liye
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                "action": "submit-support-ticket",
                "name": userName,
                "email": userEmail,
                "query": query
            })
        })
        .then(() => {
            // no-cors mode mein response read nahi hota par data chala jata hai
            alert("Ticket Submitted! Hum jaldi aapko isi dashboard par jawab denge.");
            queryField.value = ""; 
            btn.innerText = originalText;
            btn.disabled = false;
        })
        .catch((err) => {
            console.error("Error:", err);
            alert("Network Error: Ticket submit nahi ho paya. WhatsApp try karein.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
    },

    // 5. Admin Remark Logic
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
