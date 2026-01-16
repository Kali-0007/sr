// monthlyStats.js - Separate logic for Monthly Earnings Card

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
    if (!filterSelect || !display) return;

    const [selectedYear, selectedMonth] = filterSelect.value.split('-').map(Number);
    let monthlyTotal = 0;

    referralList.forEach(order => {
        const orderDate = new Date(order.date); 
        if (orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear) {
            monthlyTotal += parseFloat(order.commission);
        }
    });

    // Value update with animation
    display.innerText = `₹${monthlyTotal.toLocaleString('en-IN')}`;
}
