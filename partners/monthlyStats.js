// monthlyStats.js - Complete Logic for Monthly Earnings Card
console.log("MonthlyStats.js file load ho gayi hai!");

/**
 * 1. Dropdown Setup: Partner ki joining se aaj tak ke mahine bharta hai
 */
function setupMonthlyFilter(joiningDateStr, fullReferralList) {
    const filterSelect = document.getElementById('monthFilter');
    if (!filterSelect) return;

    // Dates parse karo
    const joiningDate = new Date(joiningDateStr);
    const today = new Date();
    
    filterSelect.innerHTML = ''; // Purane options hatao

    // Aaj se shuru karke peeche joining date tak jao
    let current = new Date(today.getFullYear(), today.getMonth(), 1);
    const start = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);

    while (current >= start) {
        const monthLabel = current.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        // Month Value Format: YYYY-M (e.g., 2026-1)
        const monthVal = `${current.getFullYear()}-${current.getMonth() + 1}`; 
        
        const option = document.createElement('option');
        option.value = monthVal;
        option.text = monthLabel;
        filterSelect.appendChild(option);

        // Ek mahina peeche jao
        current.setMonth(current.getMonth() - 1);
    }

    // Dropdown change hone par recalculate kare
    filterSelect.onchange = () => updateMonthlyDisplay(fullReferralList);

    // Pehli baar load hone par current month ka data dikhao
    updateMonthlyDisplay(fullReferralList);
}

/**
 * 2. Display Logic: Selected mahine ka calculation aur UI update
 */
function updateMonthlyDisplay(referralList) {
    const filterSelect = document.getElementById('monthFilter');
    const display = document.getElementById('thisMonthEarnings');
    
    if (!filterSelect || !display || !filterSelect.value) return;

    const selectedValue = filterSelect.value; 
    let monthlyGross = 0;

    // Saare referrals mein se selected mahine ke orders dhundo
    referralList.forEach(order => {
        const d = new Date(order.date);
        const orderMonthYear = `${d.getFullYear()}-${d.getMonth() + 1}`;
        
        if (orderMonthYear === selectedValue) {
            monthlyGross += parseFloat(order.gross || 0);
        }
    });

    // Tax aur Net Hisaab
    const tds = monthlyGross * 0.05;
    const net = monthlyGross - tds;

    // UI Rendering
    if (monthlyGross > 0) {
    display.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--calc-gross);">
            Gross: ₹${monthlyGross.toLocaleString('en-IN', {minimumFractionDigits: 2})}
        </div>
        <div style="font-size: 0.8rem; color: var(--calc-tds); margin: 4px 0;">
            TDS (5%): -₹${tds.toLocaleString('en-IN', {minimumFractionDigits: 2})}
        </div>
        <div style="font-size: 1.6rem; font-weight: 700; color: var(--calc-net);">
            ₹${net.toLocaleString('en-IN', {minimumFractionDigits: 2})}
        </div>
        <div style="font-size: 0.7rem; color: var(--text-gray); text-transform: uppercase; letter-spacing: 1px;">
            Net Payable
        </div>
    `;
} else {
    display.innerHTML = `
        <div style="font-size: 1.6rem; font-weight: 700; color: var(--text-gray); margin-top: 10px;">₹0.00</div>
        <div style="font-size: 0.7rem; color: var(--text-gray);">No earnings this month</div>
    `;
}
}
