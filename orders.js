async function fetchMyOrders() {
    // UI set karne wala logic (wohi jo pehle discuss kiya tha)
    const root = document.getElementById('orders-root');
    const token = localStorage.getItem('userToken');

    // Tab switch logic
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById('orders').style.display = 'block';

    root.innerHTML = `... (wohi table wala HTML jo aapne pehle save kiya tha) ...`;

    try {
        // Ab hum POST request bhej rahe hain
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: "get-my-orders",
                token: token
            })
        });
        
        const data = await response.json();
        const tbody = document.getElementById('orders-body');

        if (data.status === "success" && data.orders.length > 0) {
            tbody.innerHTML = ''; 
            data.orders.forEach(order => {
                let color = (order.status === "Completed") ? "#4ade80" : "#facc15";
                tbody.innerHTML += `
                    <tr style="border-bottom:1px solid #334155;">
                        <td style="padding:12px;">${order.date}</td>
                        <td style="padding:12px;">${order.service}</td>
                        <td style="padding:12px;">₹${order.amount}</td>
                        <td style="padding:12px; color:${color}; font-weight:bold;">${order.status}</td>
                        <td style="padding:12px; font-size:12px;">${order.orderId}</td>
                        <td style="padding:12px; text-align:center;">
                            ${order.invoiceUrl ? `<a href="${order.invoiceUrl}" target="_blank">📥</a>` : "N/A"}
                        </td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center;">No orders found.</td></tr>';
        }
    } catch (err) {
        document.getElementById('orders-body').innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center; color:red;">Connection Error!</td></tr>';
    }
}
