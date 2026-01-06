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
            alert("Please enter your query before submitting.");
            return;
        }

        // Button reference to show loading
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "Submitting...";
        btn.disabled = true;

        // 🔥 APNA SCRIPT URL YAHAN DALO (Deployment wala)
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";

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
            alert("Ticket Submitted Successfully. Our experts will review your query and provide a response on your dashboard shortly.");
            queryField.value = ""; 
            btn.innerText = originalText;
            btn.disabled = false;
        })
        .catch((err) => {
            console.error("Error:", err);
            alert("Unable to submit ticket due to a network error. Please try again or contact us via WhatsApp for immediate assistance.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
    },

    // 5. Admin Remark Logic
    showResponse: function(userQuery, adminReply) {
        const card = document.getElementById('adminResponseCard');
        const queryDisplay = document.getElementById('userQueryDisplay');
        
        // Yahan galti thi: HTML mein ID 'supportResponseText' hai
        const replyDisplay = document.getElementById('supportResponseText'); 
        
        if (card && adminReply && adminReply.trim() !== "" && adminReply !== "—") {
            if(queryDisplay) queryDisplay.innerText = userQuery || "Recent Support Ticket"; 
            if(replyDisplay) replyDisplay.innerText = adminReply;
            card.style.display = 'block';
            console.log("Support Card Displayed!"); // Testing ke liye
        } else {
            if(card) card.style.display = 'none';
        }
    },
};
