/**
 * TaxEasePro Support Hub - Theme & Fixed Version
 */
const supportHub = {
    config: {
        whatsappNumber: "919876543210",
        emailAddress: "taxeasepro@zohomail.in",
        formspreeId: "xqezdlrb"
    },

    openWhatsApp: function() {
        const userName = document.getElementById('firstNameDisplay')?.textContent || "User";
        const msg = encodeURIComponent(`Hi TaxEasePro, I am ${userName}. I need expert consultation regarding my dashboard services.`);
        window.open(`https://wa.me/${this.config.whatsappNumber}?text=${msg}`, '_blank');
    },

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

    requestCallback: function() {
        if (typeof ftr_openModal === "function") {
            ftr_openModal();
        } else {
            console.error("Footer modal function not found!");
            alert("Please use the 'Request Call Back' button in the footer.");
        }
    },

    submitTicket: function(e) {
        const queryField = document.getElementById('userSupportQuery');
        if(!queryField) return;
        
        const query = queryField.value.trim();
        const userName = document.getElementById('firstNameDisplay')?.textContent || "Unknown User";
        const userEmail = localStorage.getItem('userEmail') || "Guest"; 

        if (!query) {
            alert("Please enter your query before submitting.");
            return;
        }

        const btn = e ? e.target : document.querySelector('button[onclick*="submitTicket"]');
        let originalText = "Submit";
        if(btn) {
            originalText = btn.innerText;
            btn.innerText = "Submitting...";
            btn.disabled = true;
        }

        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtClA1mmRpEO154x20nahYGhDAN83ODXPE1jhzJs65aqkCnMEldsmwFoTyTF44Rp3j/exec";

        fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                "action": "submit-support-ticket",
                "name": userName,
                "email": userEmail,
                "query": query
            })
        })
        .then(() => {
            alert("Ticket Submitted Successfully. Our experts will review your query shortly.");
            queryField.value = ""; 
            if(btn) {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        })
        .catch((err) => {
            console.error("Error:", err);
            alert("Network error. Please try again.");
            if(btn) {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    },

    // UI FIX: Response card ko theme-ready banaya
   showResponse: function(userQuery, adminReply) {
    const card = document.getElementById('adminResponseCard');
    const queryDisplay = document.getElementById('userQueryDisplay');
    const replyDisplay = document.getElementById('supportResponseText'); 
    
    if (card && adminReply && adminReply.trim() !== "" && adminReply !== "—") {
        card.style.display = 'block';
        card.style.background = "var(--panel-bg)";
        card.style.border = "1px solid var(--border)";
        card.style.borderRadius = "12px";
        card.style.padding = "20px";
        card.style.boxShadow = "0 4px 15px var(--card-shadow)";

       if(queryDisplay) {
            queryDisplay.innerText = userQuery || "Recent Support Ticket"; 
            // Isko thoda Dark rakha hai taaki differentiate ho sake
            queryDisplay.style.setProperty('color', 'var(--text-grey)', 'important');
            queryDisplay.style.fontSize = "12px";
        }
        
        if(replyDisplay) {
            replyDisplay.innerText = adminReply;
            // FIX: Yahan direct var use karo, aur CSS check karo ki Day me ye #000000 ho
            replyDisplay.style.setProperty('color', 'var(--text-main)', 'important');
            replyDisplay.style.fontWeight = "700"; // Isko 600 se 700 (Extra Bold) kar diya
            replyDisplay.style.lineHeight = "1.6";
            replyDisplay.style.fontSize = "14px";
        }
        console.log("Support Hub: Admin response fixed with bold black text.");
    } else {
        if(card) card.style.display = 'none';
    }
}
};
