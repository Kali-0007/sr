// --- MY ORDERS COMPLETE LOGIC ---

// Sidebar link ke liye trigger function
async function showOrdersTab() {
    // 1. Tab switching (agar aapka switchTab function alag hai toh use rehne dein)
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById('orders').style.display = 'block';

    // 2. UI Structure & Data Loading
    const root = document.getElementById('orders-root');
    const token = localStorage.getItem('userToken');

    // UI Layout Inject Karna
    root.innerHTML = `
        <div class="orders-section" style="padding: 20px; font-family: 'Segoe UI', sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h2 style="color: #f8fafc; margin: 0;">My Orders</h2>
                    <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Aapki saari service history aur invoices yahan hain.</p>
                </div>
            </div>

            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="background: #0f172a; color: #38bdf8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Date</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Order ID</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Service</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Amount</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155;">Status</th>
                            <th style="padding: 15px; border-bottom: 1px solid #334155; text-align: center;">Invoice</th>
                        </tr>
                    </thead>
                    <tbody id="orders-data-list">
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 50px; color: #94a3b8;">
                                <div class="loading-spinner"></div> Fetching your orders...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        // Backend se data lena
        const response = await fetch(`${SCRIPT_URL}?action=get-my-orders&token=${token}`);
        const result = await response.json();
        const tbody = document.getElementById('orders-data-list');

        if (result.status === "success" && result.orders.length > 0) {
            tbody.innerHTML = ''; // Loading text hatao
            
            result.orders.forEach(order => {
                // Status Badge Logic
                let badgeStyle = "padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; border: 1px solid; ";
                if(order.status === "Success") {
                    badgeStyle += "background: rgba(34, 197, 94, 0.1); color: #4ade80; border-color: #22c55e;";
                } else if(order.status === "Pending") {
                    badgeStyle += "background: rgba(234, 179, 8, 0.1); color: #facc15; border-color: #eab308;";
                } else {
                    badgeStyle += "background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: #ef4444;";
                }

                tbody.innerHTML += `
                    <tr style="border-bottom: 1px solid #334155; transition: background 0.2s;" onmouseover="this.style.background='#273549'" onmouseout="this.style.background='transparent'">
                        <td style="padding: 15px; color: #cbd5e1;">${order.date}</td>
                        <td style="padding: 15px; font-family: monospace; color: #38bdf8; font-weight: 600;">${order.orderId}</td>
                        <td style="padding: 15px; color: #f1f5f9; font-weight: 500;">${order.service}</td>
                        <td style="padding: 15px; color: #f1f5f9;">₹${order.amount}</td>
                        <td style="padding: 15px;"><span style="${badgeStyle}">${order.status}</span></td>
                        <td style="padding: 15px; text-align: center;">
                            ${order.invoiceUrl ? 
                                `<a href="${order.invoiceUrl}" target="_blank" style="color: #38bdf8; font-size: 20px; text-decoration: none;" title="Download PDF">📥</a>` : 
                                `<span style="color: #64748b; font-size: 12px; font-style: italic;">Processing</span>`
                            }
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 60px; color: #94a3b8;">Aapka koi order itihaas (history) nahi mila.</td></tr>';
        }
    } catch (error) {
        document.getElementById('orders-data-list').innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #f87171;">Connection error! Please try again.</td></tr>';
    }
}
