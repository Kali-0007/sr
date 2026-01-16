// monthlyStats.js - Separate logic for Monthly Earnings Card
console.log("MonthlyStats.js file load ho gayi hai!");
function setupMonthlyFilter(joiningDateStr, fullReferralList) {
    const filterSelect = document.getElementById('monthFilter');
    if (!filterSelect) return;

    const joiningDate = new Date(joiningDateStr);
    const today = new Date();
    
    filterSelect.innerHTML = ''; // Purane options saaf karo

    let current = new Date(today.getFullYear(), today.getMonth(), 1);
    const start = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);

    // Dropdown mein options bharo (Joining se lekar Aaj tak)
    while (current >= start) {
        const monthLabel = current.toLocaleString('default', { month: 'long', year: 'numeric' });
        const monthVal = `${current.getFullYear()}-${current.getMonth()}`;
        
        const option = document.createElement('option');
        option.value = monthVal;
        option.text = monthLabel;
        filterSelect.appendChild(option);

        current.setMonth(current.getMonth() - 1);
    }

    // Pehli baar load hone par current month ka data dikhao
    updateMonthlyDisplay(fullReferralList);
}

function updateMonthlyDisplay(referralList) {
    const filterSelect = document.getElementById('monthFilter');
    const display = document.getElementById('thisMonthEarnings');
    if (!filterSelect || !display || !filterSelect.value) return;

    const selectedValue = filterSelect.value; // Example: "2026-1"
    let monthlyGross = 0;

    referralList.forEach(order => {
        const d = new Date(order.date);
        // Date ko dropdown ke format "YYYY-M" mein convert kar rahe hain
        const orderMonthYear = `${d.getFullYear()}-${d.getMonth() + 1}`;
        
        if (orderMonthYear === selectedValue) {
            monthlyGross += parseFloat(order.gross || 0);
        }
    });

    const tds = monthlyGross * 0.05;
    const net = monthlyGross - tds;

    if (monthlyGross > 0) {
        display.innerHTML = `
            <div style="font-size: 0.8rem; opacity: 0.8;">Gross: ₹${monthlyGross.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            <div style="font-size: 0.8rem; color: #ff6b6b;">TDS (5%): -₹${tds.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #2ecc71; margin-top: 5px;">
                ₹${net.toLocaleString('en-IN', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.7rem; opacity: 0.6;">Net Payable</div>
        `;
    } else {
        display.innerHTML = `<div style="font-size: 1.5rem; font-weight: 700; color: #aaa; margin-top: 10px;">₹0.00</div>
                             <div style="font-size: 0.7rem; opacity: 0.6;">No earnings this month</div>`;
    }
}
