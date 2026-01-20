/**
 * payouts.js - Professional Financial Tracker
 * Filter by Financial Year (FY)
 */

const PAYOUT_API_URL = "https://script.google.com/macros/library/d/1LhxtUyjMm1tTKmCCbAQkFRXii4HnGkCG_-Qp60hMNnFSWeMpQKfjPeB7/122";

async function loadPartnerFinancials() {
    // 1. Sabse pehle ID dhoondo (ID nahi toh Email backup)
    let partnerId = localStorage.getItem('partnerId') || localStorage.getItem('userEmail'); 
    
    const tdsElement = document.getElementById('total-tds');
    const walletElement = document.getElementById('wallet-balance');
    const fyDropdown = document.getElementById('fy-select');

    // 2. Agar ID nahi mili, toh 1 second wait karke firse try karo (Auto-Retry)
    if (!partnerId) {
        console.warn("Partner ID abhi nahi mili, 1 second mein dobara koshish karenge...");
        setTimeout(loadPartnerFinancials, 1000); 
        return;
    }

    // 3. Dropdown se selected FY uthao
    const selectedFY = fyDropdown ? fyDropdown.value : getCurrentFY();

    try {
        console.log(`Fetching data for Partner: ${partnerId}, FY: ${selectedFY}...`);
        
        // Loader dikhane ke liye (Optional but professional)
        if (tdsElement && tdsElement.innerText === "₹0.00") {
            tdsElement.innerText = "Loading...";
        }

        const response = await fetch(`${PAYOUT_API_URL}?partnerId=${encodeURIComponent(partnerId)}&fy=${encodeURIComponent(selectedFY)}`);
        
        if (!response.ok) throw new Error('Network response error');
        const data = await response.json();
        console.log("Financial Data Received:", data);


        // 4. TDS Amount Update (₹ formatting ke saath)
        if (tdsElement) {
            const totalTDS = data.totalTDS || 0;
            tdsElement.innerText = formatToINR(totalTDS);
        }

        // 5. Wallet/Net Balance Update
        if (walletElement) {
            const totalNet = data.totalNet || 0;
            walletElement.innerText = formatToINR(totalNet);
        }

        // 6. Agar koi Payout History Table hai (Future use ke liye)
        if (typeof updatePayoutTable === "function" && data.history) {
            updatePayoutTable(data.history);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        if (tdsElement) tdsElement.innerText = "₹0";
        if (walletElement) walletElement.innerText = "₹0";
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
