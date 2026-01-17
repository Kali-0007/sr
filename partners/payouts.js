// Payouts & Tax Management System
const PAYOUT_API_URL = "https://script.google.com/macros/s/AKfycbz1Hf6dnhvcVbzTty_tAL_ymo0I3Jcc5FlWYmqWtnQlKX3jxNVyXWcHFloKYvNOyAGe/exec"; // <--- Apna URL yahan paste karein

async function loadPartnerFinancials() {
    // LocalStorage se Partner ID uthana (Jo login ke waqt save ki thi)
    const partnerId = localStorage.getItem('partnerId'); 
    
    if (!partnerId) {
        console.error("Partner ID nahi mili. Please login again.");
        return;
    }

    try {
        // API se data mangwana
        const response = await fetch(`${PAYOUT_API_URL}?partnerId=${partnerId}`);
        const data = await response.json();

        // 1. TDS Display Update
        if(document.getElementById('total-tds')) {
            document.getElementById('total-tds').innerText = formatCurrency(data.totalTDS);
        }

        // 2. Net Wallet Balance Update (Agar aapne card banaya hai)
        if(document.getElementById('wallet-balance')) {
            document.getElementById('wallet-balance').innerText = formatCurrency(data.totalNet);
        }

        // 3. Payout History Table (Optional: Agar table banayi hai toh)
        if(data.history && data.history.length > 0) {
            renderPayoutTable(data.history);
        }

    } catch (error) {
        console.error("Financial data load karne mein error:", error);
    }
}

// Rupaye ka format set karne ke liye helper function
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0 // Paise hide karne ke liye
    }).format(amount);
}

// Dashboard load hote hi function ko trigger karein
document.addEventListener('DOMContentLoaded', loadPartnerFinancials);
