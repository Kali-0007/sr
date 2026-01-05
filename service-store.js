const serviceStore = {
    allServices: [],
    apiUrl: WEB_APP_URL, // Aapke dashboard script se lega

    init: async function() {
        const grid = document.getElementById('servicesGrid');
        grid.innerHTML = '<p style="color: var(--primary);">Fetching services from server...</p>';

        try {
            const res = await fetch(`${this.apiUrl}?action=get-available-services`);
            const data = await res.json();

            if (data.status === "success") {
                this.allServices = data.services;
                this.renderCategories();
                this.renderCards("All");
            } else {
                grid.innerHTML = '<p style="color: #ff4757;">Failed to load services.</p>';
            }
        } catch (err) {
            grid.innerHTML = '<p style="color: #ff4757;">Connection Error!</p>';
        }
    },

    renderCategories: function() {
        const container = document.getElementById('categoryTabs');
        const categories = ["All", ...new Set(this.allServices.map(s => s.category))];
        
        container.innerHTML = categories.map(cat => `
            <button onclick="serviceStore.renderCards('${cat}')" class="service-btn" 
                style="width: auto; padding: 5px 15px; font-size: 12px; background: #333; color: #fff;">
                ${cat}
            </button>
        `).join('');
    },

    renderCards: function(category) {
        const grid = document.getElementById('servicesGrid');
        const filtered = category === "All" ? this.allServices : this.allServices.filter(s => s.category === category);

        grid.innerHTML = filtered.map(s => {
            // Discount Calculation
            const mPrice = parseFloat(s.mPrice);
            const oPrice = parseFloat(s.oPrice);
            const discount = Math.round(((mPrice - oPrice) / mPrice) * 100);

            return `
                <div class="service-card" style="position: relative;">
                    <div style="position: absolute; top: 10px; right: 10px; background: var(--primary); color: #000; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                        ${discount}% OFF
                    </div>
                    <div style="font-size: 40px; margin-bottom: 15px;">${s.icon || '📄'}</div>
                    <div class="service-title">${s.name}</div>
                    <p style="font-size: 12px; color: var(--text-grey); margin-bottom: 15px;">${s.desc}</p>
                    <div class="service-price">
                        <span style="font-size: 14px; text-decoration: line-through; color: #666; margin-right: 8px;">₹${s.mPrice}</span>
                        ₹${s.oPrice}
                    </div>
                    <div style="font-size: 11px; color: var(--secondary); margin-bottom: 15px;">⏱ Delivery: ${s.time}</div>
                    <button class="service-btn" style="background: var(--secondary);" onclick="serviceStore.showDetails('${s.name}')">Get Started</button>
                </div>
            `;
        }).join('');
    }
    // Ye function details dikhayega
    showDetails: function(serviceName) {
        const s = this.allServices.find(x => x.name === serviceName);
        if(!s) return;

        // Documents ko list mein badalna
        const docList = s.docs ? s.docs.split(',').map(d => `<li>✅ ${d.trim()}</li>`).join('') : '<li>No docs needed</li>';

        const modalHtml = `
            <div id="serviceModal" class="modal" style="display:block;">
                <div class="modal-content" style="max-width: 500px; border-top: 4px solid var(--primary);">
                    <span onclick="document.getElementById('serviceModal').remove()" style="float:right; cursor:pointer; font-size:24px;">&times;</span>
                    <h2 style="color:var(--primary);">${s.name}</h2>
                    <p style="font-size:14px; color:#ccc;">${s.desc}</p>
                    
                    <div style="background:#222; padding:15px; border-radius:10px; margin:15px 0;">
                        <h4 style="margin:0 0 10px 0; color:var(--secondary);">Required Documents:</h4>
                        <ul style="list-style:none; padding:0; font-size:13px; color:#ddd;">
                            ${docList}
                        </ul>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-size:20px; font-weight:bold;">₹${s.oPrice}</div>
                        <button class="service-btn" style="width:auto; padding:8px 20px;">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};
