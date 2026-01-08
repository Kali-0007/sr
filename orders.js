async function showOrdersTab() {
    // 1. UI Switch
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById('orders').style.display = 'block';

    const root = document.getElementById('orders-root');
    const token = localStorage.getItem('userToken');

    // 2. Initial Layout with Loader
    root.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="color: #f8fafc; margin-bottom: 20px; font-family: sans-serif;">My Orders</h2>
            <div style="overflow-x: auto; background: #1e293b; border-radius: 10px; border: 1px solid #334155;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; color: #f1f5f9; min-width: 700px;">
                    <thead>
                        <tr style="background: #0f172a; color: #38bdf8; text-transform: uppercase; font-size: 12px;">
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Date</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Service Name</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Amount</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Status</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Payment ID</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155; text-align: center;">Invoice</th>
                        </tr>
                    </thead>
                    <tbody id="order-rows">
                        <tr><td colspan="6" style="text-align: center; padding: 40px;">Fetching orders...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        const response = await fetch(`${SCRIPT_URL}?action=get-my-orders&token=${token}`);
        const result = await response.json();
        const tbody = document.getElementById('order-rows');

        if (result.status === "success" && result.orders.length > 0) {
            tbody.innerHTML = ''; 
            result.orders.forEach(order => {
                // Status mapping to colors based on your screenshot labels
                let statusColor = "#facc15"; // Default Pending (Yellow)
                if(order.status === "Completed") statusColor = "#4ade80"; // Green
                if(order.status === "In Progress") statusColor = "#38bdf8"; // Blue

                tbody.innerHTML += `
                    <tr style="border-bottom: 1px solid #334155;">
                        <td style="padding: 15px;">${order.date}</td>
                        <td style="padding: 15px; font-weight: bold;">${order.service}</td>
                        <td style="padding: 15px;">₹${order.amount}</td>
                        <td style="padding: 15px;">
                            <span style="color: ${statusColor}; border: 1px solid ${statusColor}; padding: 3px 8px; border-radius: 4px; font-size: 12px;">
                                ${order.status}
                            </span>
                        </td>
                        <td style="padding: 15px; color: #94a3b8; font-size: 13px;">${order.orderId}</td>
                        <td style="padding: 15px; text-align: center;">
                            ${order.invoiceUrl ? 
                                `<a href="${order.invoiceUrl}" target="_blank" style="text-decoration: none; font-size: 20px;">📥</a>` : 
                                `<span style="color: #64748b; font-size: 11px;">N/A</span>`
                            }
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">No orders found for your account.</td></tr>';
        }
    } catch (e) {
        document.getElementById('order-rows').innerHTML = '<tr><td colspan="6" style="text-align: center; color: #f87171;">Connection error.</td></tr>';
    }
}
