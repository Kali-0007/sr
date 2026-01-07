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

        // 1. Unique Categories nikalna (Sheet ke Column A se)
        const categories = ['all', ...new Set(this.allServices.map(s => s.category))];

        // 2. TABS KA HTML (Upar wale buttons)
        const tabsHtml = `
            <div class="tabs-wrapper" style="margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                <div style="display: flex; gap: 10px; overflow-x: auto; white-space: nowrap; scrollbar-width: none;">
                    ${categories.map(cat => `
                        <button onclick="serviceStore.renderCards('${cat}')" 
                            style="padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; transition: 0.3s;
                            ${activeCategory === cat 
                                ? 'background: var(--primary); color: #000;' 
                                : 'background: #222; color: #888; border: 1px solid #333;'
                            }">
                            ${cat === 'all' ? 'All Services' : cat.toUpperCase()}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // 3. Filtered services (Jo select kiya hai wahi dikhega)
        const filtered = activeCategory === 'all' 
            ? this.allServices 
            : this.allServices.filter(s => s.category === activeCategory);

        // 4. CARDS KA HTML
        const cardsHtml = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                ${filtered.map(s => `
                    <div class="service-card" style="background: #1a1a1a; border: 1px solid #333; padding: 20px; border-radius: 12px; transition: 0.3s;">
                        <div style="font-size: 35px; margin-bottom: 15px;">${s.icon || '💼'}</div>
                        <h3 style="color: white; font-size: 17px; margin-bottom: 10px;">${s.name}</h3>
                        <div style="margin-bottom: 12px;">
                            <span style="color: var(--primary); font-size: 20px; font-weight: bold;">₹${s.oPrice}</span>
                            <span style="text-decoration: line-through; color: #555; font-size: 13px; margin-left: 8px;">₹${s.mPrice}</span>
                        </div>
                        <p style="font-size: 13px; color: #888; line-height: 1.5; margin-bottom: 15px; min-height: 40px;">${s.desc}</p>
                        <button class="service-btn" style="width: 100%;" onclick="serviceStore.showDetails('${s.name.replace(/'/g, "\\'")}')">Get Started</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Dono ko grid ke andar daal do
        grid.innerHTML = tabsHtml + cardsHtml;
    },

    showDetails: function(serviceName) {
        const s = this.allServices.find(x => x.name === serviceName);
        if(!s) return;

        const docList = s.docs ? s.docs.split(',').map(d => `<li>✅ ${d.trim()}</li>`).join('') : '<li>Contact for documents</li>';

        const modalHtml = `
            <div id="serviceModal" class="modal" style="display:block; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background: rgba(0,0,0,0.9); overflow:auto;">
                <div class="modal-content" style="background:#1a1a1a; max-width: 500px; margin: 50px auto; padding:25px; border-radius:15px; border-top: 4px solid var(--primary); position:relative;">
                    <span onclick="document.getElementById('serviceModal').remove()" style="position:absolute; right:20px; top:10px; cursor:pointer; font-size:28px; color:white;">&times;</span>
                    <h2 style="color:var(--primary); margin-top:10px;">${s.name}</h2>
                    <p style="color:#ccc; font-size:14px; margin-bottom:20px;">${s.desc}</p>
                    <div style="background:#222; padding:15px; border-radius:10px; margin-bottom:20px;">
                        <h4 style="margin:0 0 10px 0; color:var(--secondary);">Required Documents:</h4>
                        <ul style="list-style:none; padding:0; font-size:13px; color:#ddd; line-height:1.8;">
                            ${docList}
                        </ul>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #444; padding-top:15px;">
                        <div>
                            <div style="font-size:12px; color:grey;">Total Payable:</div>
                            <div style="font-size:24px; font-weight:bold; color:white;">₹${s.oPrice}</div>
                        </div>
                        <button class="service-btn" style="width:auto; padding:12px 30px;" onclick="serviceStore.placeOrder('${s.name.replace(/'/g, "\\'")}', '${s.oPrice}')">Buy Now</button>
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
