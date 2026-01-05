// 1. Sabse pehle apni URL yahan paste karo
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec"; 

const serviceStore = {
    allServices: [],

    // 2. Initial Load
    init: async function() {
        const grid = document.getElementById('services-grid');
        if (!grid) {
            console.error("Error: HTML mein 'services-grid' ID nahi mili!");
            return;
        }
        
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

    // 3. Rendering Cards
    renderCards: function(category) {
        const grid = document.getElementById('services-grid');
        const filtered = category === 'all' 
            ? this.allServices 
            : this.allServices.filter(s => s.category === category);

        if (filtered.length === 0) {
            grid.innerHTML = '<p style="color:grey; padding:20px;">No services found.</p>';
            return;
        }

        grid.innerHTML = filtered.map(s => `
            <div class="service-card">
                <div style="font-size: 40px; margin-bottom: 15px;">${s.icon || '💼'}</div>
                <div class="service-title" style="font-weight:bold; color:white;">${s.name}</div>
                <div class="service-price" style="margin: 10px 0;">
                    <span style="text-decoration: line-through; color: #666; font-size: 14px;">₹${s.mPrice}</span>
                    <span style="color: var(--primary); font-size: 18px; font-weight: bold; margin-left: 10px;">₹${s.oPrice}</span>
                </div>
                <p style="font-size: 13px; color: #aaa; margin: 10px 0;">${s.desc}</p>
                <div style="font-size: 12px; color: var(--secondary); margin-bottom: 15px;">⏱ ${s.time}</div>
                <button class="service-btn" onclick="serviceStore.showDetails('${s.name}')">Get Started</button>
            </div>
        `).join('');
    },

    // 4. Popup Details
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
                        <button class="service-btn" style="width:auto; padding:12px 30px;" onclick="serviceStore.placeOrder('${s.name}', '${s.oPrice}')">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    // 5. Order Logic
    placeOrder: async function(serviceName, price) {
        alert("Success! Order placed for " + serviceName + ".\nPrice: ₹" + price);
        document.getElementById('serviceModal').remove();
    }
};

// 6. AUTO-START: Page khulte hi call karega
document.addEventListener('DOMContentLoaded', () => {
    serviceStore.init();
});
