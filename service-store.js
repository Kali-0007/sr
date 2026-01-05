const serviceStore = {
    allServices: [],

    // 1. Initial Load
    init: async function() {
        const grid = document.getElementById('services-grid');
        grid.innerHTML = '<p style="color:white; padding:20px;">Loading real-time services...</p>';
        
        try {
            const res = await fetch(`${WEB_APP_URL}?action=get-available-services`);
            const data = await res.json();
            this.allServices = data;
            this.renderCards('all');
        } catch (err) {
            grid.innerHTML = '<p style="color:red;">Error loading services. Check Connection.</p>';
            console.error(err);
        }
    },

    // 2. Rendering Cards (Yahan sequence ka dhyan rakha hai)
    renderCards: function(category) {
        const grid = document.getElementById('services-grid');
        const filtered = category === 'all' 
            ? this.allServices 
            : this.allServices.filter(s => s.category === category);

        if (filtered.length === 0) {
            grid.innerHTML = '<p style="color:grey; padding:20px;">No services found in this category.</p>';
            return;
        }

        grid.innerHTML = filtered.map(s => `
            <div class="service-card">
                <div style="font-size: 40px; margin-bottom: 15px;">${s.icon || '💼'}</div>
                <div class="service-title">${s.name}</div>
                <div class="service-price">
                    <span style="text-decoration: line-through; color: #666; font-size: 14px;">₹${s.mPrice}</span>
                    <span>₹${s.oPrice}</span>
                </div>
                <p style="font-size: 13px; color: #aaa; margin: 10px 0;">${s.desc}</p>
                <div style="font-size: 12px; color: var(--secondary); margin-bottom: 15px;">⏱ ${s.time}</div>
                <button class="service-btn" onclick="serviceStore.showDetails('${s.name}')">Get Started</button>
            </div>
        `).join('');
    },

    // 3. Popup Show Details (Comma ka dhyan rakha hai yahan)
    showDetails: function(serviceName) {
        const s = this.allServices.find(x => x.name === serviceName);
        if(!s) return;

        const docList = s.docs ? s.docs.split(',').map(d => `<li>✅ ${d.trim()}</li>`).join('') : '<li>Contact for documents</li>';

        const modalHtml = `
            <div id="serviceModal" class="modal" style="display:block; background: rgba(0,0,0,0.8);">
                <div class="modal-content" style="max-width: 500px; margin: 50px auto; border-top: 4px solid var(--primary);">
                    <span onclick="document.getElementById('serviceModal').remove()" style="float:right; cursor:pointer; font-size:28px; color:white;">&times;</span>
                    <h2 style="color:var(--primary);">${s.name}</h2>
                    <p style="color:#ccc; font-size:14px;">${s.desc}</p>
                    
                    <div style="background:#222; padding:15px; border-radius:10px; margin:20px 0;">
                        <h4 style="margin:0 0 10px 0; color:var(--secondary);">Required Documents:</h4>
                        <ul style="list-style:none; padding:0; font-size:13px; color:#ddd; line-height:1.8;">
                            ${docList}
                        </ul>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #444; padding-top:15px;">
                        <div>
                            <div style="font-size:12px; color:grey;">Final Price:</div>
                            <div style="font-size:22px; font-weight:bold; color:white;">₹${s.oPrice}</div>
                        </div>
                        <button class="service-btn" style="width:auto; padding:10px 25px;" onclick="serviceStore.placeOrder('${s.name}', '${s.oPrice}')">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    // 4. Order Placing
    placeOrder: async function(serviceName, price) {
        alert("Ordering: " + serviceName + " for ₹" + price + "\n(Backend integration coming next!)");
        document.getElementById('serviceModal').remove();
    }
};
