/**
 * payouts.js
 * Partner Financials (TDS & Wallet) Fetching System
 */

const PAYOUT_API_URL = "https://script.google.com/macros/s/AKfycbz1Hf6dnhvcVbzTty_tAL_ymo0I3Jcc5FlWYmqWtnQlKX3jxNVyXWcHFloKYvNOyAGe/exec";

async function loadPartnerFinancials() {
    // 1. LocalStorage se logged-in Partner ki ID uthana
    const partnerId = localStorage.getItem('partnerId'); 
    const tdsElement = document.getElementById('total-tds');
    const tdsHeading = document.getElementById('tds-heading');

    if (!partnerId) {
        console.warn("Partner ID nahi mili. Dashboard data fetch nahi ho sakta.");
        return;
    }

    // 2. Dynamic Financial Year (FY) nikalna (e.g. FY 2025-26)
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JS months 0-11 hote hain
    const currentYear = now.getFullYear();
    let fyDisplay = "";

    if (currentMonth >= 4) {
        // April ya uske baad: Current Year - Next Year
        fyDisplay = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    } else {
        // Jan-March: Previous Year - Current Year
        fyDisplay = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    }

    // Heading update karna (TDS Deducted FY 2025-26)
    if (tdsHeading) {
        tdsHeading.innerText = `TDS Deducted (FY ${fyDisplay})`;
    }

    try {
        console.log(`Fetching financials for Partner: ${partnerId}...`);
        
        // 3. API Call
        const response = await fetch(`${PAYOUT_API_URL}?partnerId=${partnerId}`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        console.log("Financial Data Received:", data);

        // 4. TDS Amount Update (Indian Currency Format)
        if (tdsElement) {
            const totalTDS = data.totalTDS || 0;
            tdsElement.innerText = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(totalTDS);
        }

        // 5. Agar Wallet Balance card hai (Optional)
        const walletElement = document.getElementById('wallet-balance');
        if (walletElement && data.totalNet !== undefined) {
            walletElement.innerText = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(data.totalNet);
        }

    } catch (error) {
        console.error("TDS Fetch Error:", error);
        if (tdsElement) tdsElement.innerText = "₹0";
    }
}

// Page load hote hi data fetch karein
document.addEventListener('DOMContentLoaded', loadPartnerFinancials);
