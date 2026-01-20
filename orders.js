// 1. URL setup
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtClA1mmRpEO154x20nahYGhDAN83ODXPE1jhzJs65aqkCnMEldsmwFoTyTF44Rp3j/exec"; 

async function fetchMyOrders() {
    const root = document.getElementById('orders-root');
    const token = localStorage.getItem('userToken');

    // UI Tab Switch
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    const ordersTab = document.getElementById('orders');
    if (ordersTab) ordersTab.style.display = 'block';

    // Base Table HTML (Hardcoded colors replaced with Variables)
    root.innerHTML = `
        <div class="orders-container" style="padding:20px;">
            <h2 style="color: var(--text-main); margin-bottom:15px;">My Orders</h2>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; color: var(--text-main); background: var(--panel-bg); border-radius:8px; border:1px solid var(--border); overflow: hidden;">
                    <thead>
                        <tr style="background: var(--bg-main); text-align:left;">
                            <th style="padding:12px; color: var(--text-grey); font-size: 13px;">Date</th>
                            <th style="padding:12px; color: var(--text-grey); font-size: 13px;">Service</th>
                            <th style="padding:12px; color: var(--text-grey); font-size: 13px;">Amount</th>
                            <th style="padding:12px; color: var(--text-grey); font-size: 13px;">Status</th>
                            <th style="padding:12px; color: var(--text-grey); font-size: 13px;">Order ID</th>
                            <th style="padding:12px; text-align:center; color: var(--text-grey); font-size: 13px;">Invoice</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body">
                        <tr><td colspan="6" style="padding:40px; text-align:center; color: var(--text-grey);">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
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
                // Status colors (Modern light/dark friendly)
                let statusColor = (order.status === "Completed") ? "#00ff88" : "#facc15";
                
                tbody.innerHTML += `
                    <tr style="border-bottom:1px solid var(--border); transition: 0.2s;" onmouseover="this.style.background='rgba(56, 189, 248, 0.03)'" onmouseout="this.style.background='transparent'">
                        <td style="padding:12px; font-size: 13px;">${order.date}</td>
                        <td style="padding:12px; font-weight:bold; font-size: 13px;">${order.service}</td>
                        <td style="padding:12px; font-size: 13px;">₹${order.amount}</td>
                        <td style="padding:12px;">
                            <span style="color:${statusColor}; border:1px solid ${statusColor}; padding:2px 8px; border-radius:12px; font-size:10px; font-weight: 700; text-transform: uppercase;">
                                ${order.status}
                            </span>
                        </td>
                        <td style="padding:12px; font-size:11px; color: var(--text-grey);">${order.orderId}</td>
                        <td style="padding:12px; text-align:center; font-size: 18px;">
                            ${order.invoiceUrl ? `<a href="${order.invoiceUrl}" target="_blank" style="text-decoration:none;">📥</a>` : "<span style='font-size:12px; color:var(--text-grey)'>N/A</span>"}
                        </td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="6" style="padding:40px; text-align:center; color: var(--text-grey);">No orders found.</td></tr>`;
        }
    } catch (err) {
        console.error("Critical Error:", err);
        document.getElementById('orders-body').innerHTML = `<tr><td colspan="6" style="padding:20px; text-align:center; color:#f87171;">Data load nahi ho paya. URL check karein.</td></tr>`;
    }
}
