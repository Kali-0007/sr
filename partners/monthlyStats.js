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

    // Filter value se Year aur Month nikalna
    const [year, month] = filterSelect.value.split('-').map(Number);
    let monthlyGross = 0;

    referralList.forEach(order => {
        const orderDate = new Date(order.date);
        // JS mein getMonth() 0-11 hota hai, isliye +1 karke match karenge
        if ((orderDate.getMonth() + 1) === month && orderDate.getFullYear() === year) {
            // Ab hum 'gross' use kar rahe hain
            monthlyGross += parseFloat(order.gross || 0);
        }
    });

    // TDS aur Net calculate karein
    const tds = monthlyGross * 0.05;
    const net = monthlyGross - tds;

    // Display update (Gross, TDS aur Net ke saath professional look)
    display.innerHTML = `
        <div style="font-size: 0.8rem; opacity: 0.8;">Gross: ₹${monthlyGross.toLocaleString('en-IN')}</div>
        <div style="font-size: 0.8rem; color: #ff6b6b;">TDS (5%): -₹${tds.toLocaleString('en-IN')}</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #2ecc71; margin-top: 5px;">
            ₹${net.toLocaleString('en-IN')}
        </div>
        <div style="font-size: 0.7rem; opacity: 0.6;">Net Payable</div>
    `;
}
