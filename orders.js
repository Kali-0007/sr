async function fetchMyOrders() {
    const root = document.getElementById('orders-root');
    const token = localStorage.getItem('userToken'); // Aapka auth token

    // 1. Table ka Header (Aapke columns ke hisaab se)
    root.innerHTML = `
        <div class="orders-container" style="padding:20px;">
            <h2 style="color:#fff; margin-bottom:15px;">My Orders</h2>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; color:#fff; background:#1e293b; border-radius:8px;">
                    <thead>
                        <tr style="background:#0f172a; text-align:left;">
                            <th style="padding:12px;">Date</th>
                            <th style="padding:12px;">Service</th>
                            <th style="padding:12px;">Amount</th>
                            <th style="padding:12px;">Status</th>
                            <th style="padding:12px;">Order ID</th>
                            <th style="padding:12px;">Invoice</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body">
                        <tr><td colspan="6" style="padding:20px; text-align:center;">Loading your orders...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        // 2. SCRIPT_URL par request bhejna (Backend se data mangwana)
        const response = await fetch(`${SCRIPT_URL}?action=get-my-orders&token=${token}`);
        const data = await response.json();
        const tbody = document.getElementById('orders-body');

        if (data.status === "success" && data.orders.length > 0) {
            tbody.innerHTML = ''; // Loading hatado
            
            data.orders.forEach(order => {
                // Status ke liye basic coloring
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
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center;">No orders found.</td></tr>';
        }
    } catch (err) {
        document.getElementById('orders-body').innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center; color:red;">Connection Error!</td></tr>';
    }
}
