/**
 * payouts.js - Professional Financial Tracker
 * Filter by Financial Year (FY)
 */

const PAYOUT_API_URL = "https://script.google.com/macros/s/AKfycbz1Hf6dnhvcVbzTty_tAL_ymo0I3Jcc5FlWYmqWtnQlKX3jxNVyXWcHFloKYvNOyAGe/exec";

async function loadPartnerFinancials() {
    const partnerId = localStorage.getItem('partnerId'); 
    const tdsElement = document.getElementById('total-tds');
    const fyDropdown = document.getElementById('fy-select'); // Dropdown select element

    if (!partnerId) {
        console.warn("Partner ID nahi mili.");
        return;
    }

    // Dropdown se selected FY uthao (e.g., "2025-26")
    const selectedFY = fyDropdown ? fyDropdown.value : getCurrentFY();

    try {
        console.log(`Fetching data for Partner: ${partnerId}, FY: ${selectedFY}...`);
        
        // --- YAHA CHANGE HAI: API ko ab FY bhi bhej rahe hain ---
        const response = await fetch(`${PAYOUT_API_URL}?partnerId=${partnerId}&fy=${selectedFY}`);
        
        if (!response.ok) throw new Error('Network response error');
        
        const data = await response.json();
        console.log("Financial Data Received:", data);

        // 1. TDS Amount Update
        if (tdsElement) {
            const totalTDS = data.totalTDS || 0;
            tdsElement.innerText = formatToINR(totalTDS);
        }

        // 2. Wallet Balance Update
        const walletElement = document.getElementById('wallet-balance');
        if (walletElement && data.totalNet !== undefined) {
            walletElement.innerText = formatToINR(data.totalNet);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        if (tdsElement) tdsElement.innerText = "₹0";
    }
}

// --- HELPER FUNCTIONS ---

// 1. Current Financial Year nikalne ka logic
function getCurrentFY() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return (month >= 4) ? `${year}-${(year + 1).toString().slice(-2)}` : `${year - 1}-${year.toString().slice(-2)}`;
}

// 2. Currency Formatting
function formatToINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// --- EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pehli baar data load karo
    loadPartnerFinancials();

    // 2. Agar dropdown change ho, toh dobara data fetch karo
    const fyDropdown = document.getElementById('fy-select');
    if (fyDropdown) {
        fyDropdown.addEventListener('change', loadPartnerFinancials);
    }
});
