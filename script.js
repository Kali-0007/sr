document.addEventListener('DOMContentLoaded', () => {
    console.log("TaxGSTPro website and script loaded successfully.");
    
    // --- Expandable Cards Logic ---
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // प्रत्येक कार्ड पर क्लिक इवेंट लिस्नर जोड़ें
        card.addEventListener('click', function() {
            
            // क्लिक किए गए कार्ड को छोड़ कर बाकी सभी खुले कार्ड्स को बंद करें
            cards.forEach(otherCard => {
                if (otherCard !== this && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                }
            });

            // क्लिक किए गए कार्ड पर 'active' क्लास को टॉगल करें (जो इसे खोलेगा/बंद करेगा)
            this.classList.toggle('active');
        });
    });

    // --- Placeholder Button Alert Logic (Kept for reference) ---
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Note: The 'Get Started' button in HTML is an anchor tag, so e.preventDefault() is often needed if it links to a dummy '#'.
            // For the sake of the alert, we will not prevent default, assuming it links to signup.html.
            // e.preventDefault(); 
            // alert("This is a placeholder for the actual functionality.");
        });
    });
});
