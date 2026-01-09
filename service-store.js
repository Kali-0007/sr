const serviceStore = {
    allServices: [],

    init: async function() {
        const grid = document.getElementById('services-grid');
        if (!grid) return;
        
        grid.innerHTML = '<p style="color:white; padding:20px;">Loading real-time services...</p>';
        
        try {
            const res = await fetch(`${WEB_APP_URL}?action=get-available-services`);
            const data = await res.json();
            
            // FIX: Check kar rahe hain ki data sahi mein ek list (Array) hai ya nahi
            if (data && Array.isArray(data)) {
                this.allServices = data;
                this.renderCards('all');
            } else {
                console.error("Data format galat hai:", data);
                grid.innerHTML = '<p style="color:orange;">Sheet se sahi data nahi mila. Check Sheet Name.</p>';
            }
        } catch (err) {
            grid.innerHTML = '<p style="color:red;">Error loading services. Console check karein.</p>';
            console.error(err);
        }
    },

  renderCards: function(activeCategory = 'all') {
        const grid = document.getElementById('services-grid');
        if (!Array.isArray(this.allServices)) return;

        grid.style.display = "block"; 
        grid.style.width = "100%";

        const categories = ['all', ...new Set(this.allServices.map(s => s.category))];

        // 1. TABS: Minimal & Rounded
        const tabsHtml = `
            <div style="display: flex; gap: 10px; margin-bottom: 35px; overflow-x: auto; padding: 10px 0; scrollbar-width: none;">
                ${categories.map(cat => `
                    <button onclick="serviceStore.renderCards('${cat}')" 
                        style="padding: 8px 20px; border-radius: 30px; border: 1px solid #333; cursor: pointer; white-space: nowrap; font-weight: 500; transition: all 0.2s; font-size: 13px;
                        ${activeCategory === cat 
                            ? 'background: #00ff88; color: #000; border-color: #00ff88;' 
                            : 'background: transparent; color: #aaa;'
                        }">
                        ${cat === 'all' ? 'All Services' : cat.toUpperCase()}
                    </button>
                `).join('')}
            </div>
        `;

        const filtered = activeCategory === 'all' 
            ? this.allServices 
            : this.allServices.filter(s => s.category === activeCategory);

        // 2. CARDS: Professional & Centered
        const cardsHtml = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; width: 100%;">
                ${filtered.map(s => `
                    <div class="service-card" style="background: #161b22; border: 1px solid #30363d; padding: 30px 20px; border-radius: 12px; transition: 0.3s; text-align: center; display: flex; flex-direction: column; align-items: center;">
                        
                        <div style="width: 60px; height: 60px; background: #0d1117; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 20px; border: 1px solid #30363d;">
                            ${s.icon || '💼'}
                        </div>

                        <h3 style="color: #f0f6fc; font-size: 18px; margin-bottom: 8px; font-weight: 600; min-height: 44px; display: flex; align-items: center;">${s.name}</h3>
                        
                        <p style="font-size: 13px; color: #8b949e; line-height: 1.5; margin-bottom: 20px; min-height: 40px; max-width: 200px;">${s.desc}</p>
                        
                        <div style="margin-bottom: 25px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                            <span style="color: #00ff88; font-size: 24px; font-weight: 700;">₹${s.oPrice}</span>
                            <span style="text-decoration: line-through; color: #484f58; font-size: 14px;">M.R.P: ₹${s.mPrice}</span>
                        </div>

                        <button class="service-btn" style="width: 100%; padding: 12px; border-radius: 8px; font-weight: 600; background: #00ff88; color: #0b0e14; border: none; cursor: pointer; transition: 0.2s; font-size: 14px;" 
                                onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'"
                                onclick="serviceStore.showDetails('${s.name.replace(/'/g, "\\'")}')">
                            Get Started
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        grid.innerHTML = tabsHtml + cardsHtml;
    },
 showDetails: function(serviceName) {
    const s = this.allServices.find(x => x.name === serviceName);
    if(!s) return;

    const docs = s.docs ? s.docs.split(',') : [];
    const docList = docs.map(d => `
        <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #c9d1d9; margin-bottom: 8px;">
            <span style="color: #00ff88;">✓</span> ${d.trim()}
        </div>
    `).join('');

    const modalHtml = `
        <div id="serviceModal" style="display:flex; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); align-items:center; justify-content:center; padding: 20px;">
            <div style="background:#0d1117; max-width: 950px; width:100%; border-radius:16px; border: 1px solid #30363d; overflow:hidden; display: flex; flex-direction: column; max-height: 90vh;">
                
                <div style="padding: 20px 30px; border-bottom: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; background: #161b22;">
                    <div>
                        <h2 style="color:#fff; margin:0; font-size: 20px;">${s.name}</h2>
                        <div style="color:#8b949e; font-size: 12px; margin-top: 4px;">⏱ Time: <span style="color: #00ff88;">${s.time || 'Standard'}</span></div>
                    </div>
                    <span onclick="document.getElementById('serviceModal').remove()" style="cursor:pointer; font-size:28px; color:#8b949e;">&times;</span>
                </div>

                <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 0; overflow-y: auto; flex: 1; background: #0d1117;">
                    
                    <div style="padding: 25px; border-right: 1px solid #30363d;">
                        <p style="color:#8b949e; font-size:14px; line-height:1.6; margin-bottom: 20px; white-space: pre-line;">${s.desc}</p>
                        
                        <div style="background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                            <h4 style="color:#00ff88; margin:0 0 10px 0; font-size: 14px;">✅ Eligibility & Details</h4>
                            <div style="color:#c9d1d9; font-size: 13px; line-height: 1.6; white-space: pre-line;">${s.detailed_info || 'Refer to documentation.'}</div>
                        </div>

                        <div style="background: rgba(255,69,58,0.05); border: 1px solid rgba(255,69,58,0.1); border-radius: 8px; padding: 15px;">
                            <h4 style="color:#ff453a; margin:0 0 10px 0; font-size: 14px;">⚠️ Not Eligible If</h4>
                            <div style="color:#c9d1d9; font-size: 13px; line-height: 1.6; white-space: pre-line;">${s.not_eligible || 'N/A'}</div>
                        </div>
                    </div>

                    <div style="padding: 25px; background: #161b22;">
                        <h4 style="color:#fff; margin:0 0 15px 0; font-size: 14px;">📋 Required Documents</h4>
                        <div style="margin-bottom: 25px;">${docList || 'Contact support.'}</div>

                        <h4 style="color:#fff; margin:0 0 10px 0; font-size: 14px;">⭐ Service Benefits</h4>
                        <div style="color:#8b949e; font-size: 13px; line-height: 1.5; white-space: pre-line;">${s.service_benefits || 'Expert assistance.'}</div>
                        
                        ${s.faq ? `
                        <div style="margin-top: 25px; border-top: 1px solid #30363d; padding-top: 15px;">
                            <h4 style="color:#fff; margin:0 0 10px 0; font-size: 14px;">❓ FAQ</h4>
                            <div style="color:#8b949e; font-size: 12px; line-height: 1.5; white-space: pre-line; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px;">${s.faq}</div>
                        </div>
                        ` : ''}
                    <div style="padding: 20px 30px; background: #161b22; border-top: 1px solid #30363d;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <div>
            <div style="font-size: 11px; color: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Professional Fee</div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 32px; font-weight: 800; color: #fff;">₹${s.oPrice}</span>
                <span style="text-decoration: line-through; color: #ff453a; font-size: 18px; font-weight: 500;">₹${s.mPrice}</span>
            </div>
        </div>
        
        <button style="background:#00ff88; color:#0b0e14; padding: 15px 50px; border-radius: 8px; font-weight: 800; border:none; cursor:pointer; font-size: 16px; transition: 0.3s; box-shadow: 0 4px 15px rgba(0, 255, 136, 0.2);"
                onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'" 
                onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"
                onclick="serviceStore.placeOrder('${s.name.replace(/'/g, "\\'")}', '${s.oPrice}')">
            BUY NOW
        </button>
    </div>
    
    <div style="font-size: 11px; color: #8b949e; text-align: center; border-top: 1px solid #21262d; padding-top: 12px;">
        🛡️ <b>Secure Transaction:</b> Our expert will contact you within 2 hours of successful payment.
    </div>
</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
},
    placeOrder: async function(serviceName, price) {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "Processing...";
        btn.disabled = true;

        try {
            const userEmail = localStorage.getItem('userEmail') || "Guest/Unknown";

            // FIX: Body ke andar bhi action: 'place-order' bhej rahe hain
            const res = await fetch(`${WEB_APP_URL}?action=place-order`, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'place-order', // <--- YE ZAROORI HAI
                    email: userEmail,
                    service: serviceName,
                    amount: price
                })
            });

            const result = await res.json();

            if (result.status === "success") {
                alert("🚀 Order Placed Successfully!");
                document.getElementById('serviceModal').remove();
            } else {
                alert("Error: " + result.message);
            }

        } catch (err) {
            console.error("Order error:", err);
            // Agar CORS error aati hai par data sheet mein chala jata hai
            alert("Order Request Sent! Please check the Orders sheet.");
            if(document.getElementById('serviceModal')) document.getElementById('serviceModal').remove();
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if(typeof WEB_APP_URL !== 'undefined') serviceStore.init();
});
