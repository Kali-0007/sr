// 1. URL setup
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec"; 

async function fetchMyOrders() {
    const root = document.getElementById('orders-root');
    const token = localStorage.getItem('userToken');

    // UI Tab Switch
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    const ordersTab = document.getElementById('orders');
    if (ordersTab) ordersTab.style.display = 'block';

    // Base Table HTML
    root.innerHTML = `
        <div class="orders-container" style="padding:20px;">
            <h2 style="color:#fff; margin-bottom:15px;">My Orders</h2>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; color:#fff; background:#1e293b; border-radius:8px; border:1px solid #334155;">
                    <thead>
                        <tr style="background:#0f172a; text-align:left;">
                            <th style="padding:12px;">Date</th>
                            <th style="padding:12px;">Service</th>
                            <th style="padding:12px;">Amount</th>
                            <th style="padding:12px;">Status</th>
                            <th style="padding:12px;">Order ID</th>
                            <th style="padding:12px; text-align:center;">Invoice</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body">
                        <tr><td colspan="6" style="padding:40px; text-align:center; color:#94a3b8;">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        // FETCH CALL (NO-CORS HATA DIYA HAI)
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: "get-my-orders",
                token: token
            })
        });

        // Response check
        const data = await response.json();
        console.log("Data Received:", data); // Check in console

        const tbody = document.getElementById('orders-body');

        if (data.status === "success" && data.orders.length > 0) {
            tbody.innerHTML = ''; 
            data.orders.forEach(order => {
                let color = (order.status === "Completed") ? "#4ade80" : "#facc15";
                tbody.innerHTML += `
                    <tr style="border-bottom:1px solid #334155;">
                        <td style="padding:12px;">${order.date}</td>
                        <td style="padding:12px; font-weight:bold;">${order.service}</td>
                        <td style="padding:12px;">₹${order.amount}</td>
                        <td style="padding:12px;"><span style="color:${color}; border:1px solid ${color}; padding:2px 6px; border-radius:4px; font-size:12px;">${order.status}</span></td>
                        <td style="padding:12px; font-size:11px; color:#94a3b8;">${order.orderId}</td>
                        <td style="padding:12px; text-align:center;">
                            ${order.invoiceUrl ? `<a href="${order.invoiceUrl}" target="_blank">📥</a>` : "N/A"}
                        </td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="padding:40px; text-align:center;">No orders found.</td></tr>';
        }
    } catch (err) {
        console.error("Critical Error:", err);
        document.getElementById('orders-body').innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center; color:#f87171;">Data load nahi ho paya. URL check karein.</td></tr>';
    }
}
