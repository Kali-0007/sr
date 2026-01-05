const serviceHub = {
    allServices: [],
    API_URL: "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec",

    init: async function() {
        const container = document.getElementById('dynamicServiceContent'); 
        if (!container) return;
        
        const token = localStorage.getItem('userToken'); 
        if (!token) return;

        try {
            const response = await fetch(`${this.API_URL}?action=get-service-hub&token=${encodeURIComponent(token)}`);
            const data = await response.json();

            if (data.status === 'success' && data.services) {
                this.allServices = data.services;
                this.renderStats(); // Naya function
                this.renderCards();
            }
        } catch (err) {
            console.error("Service Hub Error:", err);
        }
    },

    renderStats: function() {
        const statContainer = document.getElementById('statCardsContainer');
        if (!statContainer) return;

        // Logic to find specific statuses
        const itr = this.allServices.find(s => s.serviceName.toLowerCase().includes('itr')) || {status: 'Not Opted', deadline: 'N/A'};
        const gst = this.allServices.find(s => s.serviceName.toLowerCase().includes('gst')) || {status: 'Not Opted', deadline: 'N/A'};
        
        statContainer.innerHTML = `
            <div class="stat-card">
                <h3>ITR Status (AY 26-27)</h3>
                <div class="value">${itr.status}</div>
                <div class="sub-text">Due: ${itr.deadline}</div>
            </div>
            <div class="stat-card" style="border-right-color: var(--secondary);">
                <h3>GST Monthly</h3>
                <div class="value">${gst.status}</div>
                <div class="sub-text">Next: ${gst.deadline}</div>
            </div>
            <div class="stat-card">
                <h3>Active Services</h3>
                <div class="value">${this.allServices.length}</div>
                <div class="sub-text">Managed by TaxEase</div>
            </div>
            <div class="stat-card">
                <h3>Documents</h3>
                <div class="value" id="docCountStat">...</div>
                <div class="sub-text">Safe in Cloud</div>
            </div>
        `;
    },

    renderCards: function() {
        const grid = document.getElementById('servicesGrid');
        // Card rendering logic remains the same as your working code
        const container = document.getElementById('dynamicServiceContent');
        container.innerHTML = `
            <div class="service-hub-header" style="margin-bottom: 20px; margin-top: 20px;">
                <h2 style="font-size: 20px; color: #fff;">Service Trackers</h2>
            </div>
            <div id="servicesGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                ${this.allServices.map(service => this.generateCardHtml(service)).join('')}
            </div>
        `;
    },

    generateCardHtml: function(service) {
        let statusColor = '#ffa500'; 
        const st = (service.status || '').toLowerCase();
        if(st.includes('progress')) statusColor = '#00d4ff'; 
        if(st.includes('filed') || st.includes('complete')) statusColor = '#00ff88'; 
        
        return `
            <div class="stat-card" style="background: #1a1a1a; border: 1px solid #333; padding: 25px; border-radius: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <span style="background: ${statusColor}22; color: ${statusColor}; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 20px; border: 1px solid ${statusColor}44;">
                            ${service.status}
                        </span>
                        <h3 style="color: #fff; margin-top: 12px; font-size: 18px;">${service.serviceName}</h3>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 22px; font-weight: bold; color: #fff;">${service.progress}%</div>
                        <div style="font-size: 10px; color: #555; text-transform: uppercase;">Done</div>
                    </div>
                </div>
                <div style="width: 100%; height: 6px; background: #333; border-radius: 10px; margin: 25px 0; overflow: hidden; position: relative;">
                    <div style="width: ${service.progress}%; height: 100%; background: ${statusColor}; transition: width 0.5s ease;"></div>
                </div>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #222; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 10px; color: #666; text-transform: uppercase;">Next Due Date</div>
                        <div style="font-size: 13px; color: #eee; font-weight: 500;">📅 ${service.deadline}</div>
                    </div>
                    <button class="service-btn" style="width:auto; padding: 6px 15px; font-size: 11px;">Details</button>
                </div>
            </div>`;
    }
};
