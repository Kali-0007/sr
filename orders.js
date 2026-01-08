// --- CONFIGURATION ---
// Yahan apna naya Deployment URL paste karein
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec"; 

async function fetchMyOrders() {
    const root = document.getElementById('orders-root');
    const token = localStorage.getItem('userToken');

    // 1. Tab switching (Taaki baaki cheezein chhup jayein aur Orders dikhe)
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    const ordersTab = document.getElementById('orders');
    if (ordersTab) ordersTab.style.display = 'block';

    // 2. Table ka Structure (UI)
    root.innerHTML = `
        <div class="orders-container" style="padding:20px; font-family: sans-serif;">
            <h2 style="color:#fff; margin-bottom:15px;">My Orders</h2>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; color:#fff; background:#1e293b; border-radius:8px; border: 1px solid #334155;">
                    <thead>
                        <tr style="background:#0f172a; text-align:left;">
                            <th style="padding:12px; border-bottom: 1px solid #334155;">Date</th>
                            <th style="padding:12px; border-bottom: 1px solid #334155;">Service</th>
                            <th style="padding:12px; border-bottom: 1px solid #334155;">Amount</th>
                            <th style="padding:12px; border-bottom: 1px solid #334155;">Status</th>
                            <th style="padding:12px; border-bottom: 1px solid #334155;">Order ID</th>
                            <th style="padding:12px; border-bottom: 1px solid #334155; text-align:center;">Invoice</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body">
                        <tr><td colspan="6" style="padding:40px; text-align:center; color:#94a3b8;">Loading your orders...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        // 3. POST Request to Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Ye tab use karte hain jab redirect issue ho, par standard fetch pehle try karein
            body: JSON.stringify({
                action: "get-my-orders",
                token: token
            })
        });

        // Note: Apps Script POST request ke saath kabhi kabhi CORS error deta hai.
        // Agar 404 aa raha hai toh check karein ki URL 'exec' par khatam ho raha hai ya nahi.
        
        const data = await response.json();
        const tbody = document.getElementById('orders-body');

        if (data.status === "success" && data.orders.length > 0) {
            tbody.innerHTML = ''; 
            data.orders.forEach(order => {
                let color = (order.status === "Completed") ? "#4ade80" : "#facc15";
                tbody.innerHTML += `
                    <tr style="border-bottom:1px solid #334155; transition: 0.3s;" onmouseover="this.style.background='#2d3748'" onmouseout="this.style.background='transparent'">
                        <td style="padding:12px;">${order.date}</td>
                        <td style="padding:12px; font-weight:bold;">${order.service}</td>
                        <td style="padding:12px;">₹${order.amount}</td>
                        <td style="padding:12px;"><span style="color:${color}; border:1px solid ${color}; padding:2px 6px; border-radius:4px; font-size:12px;">${order.status}</span></td>
                        <td style="padding:12px; font-size:11px; font-family:monospace; color:#94a3b8;">${order.orderId}</td>
                        <td style="padding:12px; text-align:center;">
                            ${order.invoiceUrl ? `<a href="${order.invoiceUrl}" target="_blank" style="text-decoration:none;">📥</a>` : "<span style='font-size:10px; color:#64748b;'>N/A</span>"}
                        </td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="padding:40px; text-align:center; color:#94a3b8;">No orders found for your account.</td></tr>';
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        document.getElementById('orders-body').innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center; color:#f87171;">Connection Error! Please check SCRIPT_URL or internet.</td></tr>';
    }
}
