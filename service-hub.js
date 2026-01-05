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
                this.renderStats();    // 1. Top boxes bharega
                this.renderCards();    // 2. Middle cards dikhayega
                this.renderActivity(); // 3. Bottom activity feed chalayega
            }
        } catch (err) {
            console.error("Service Hub Error:", err);
        }
    },

    renderStats: function() {
        const statContainer = document.getElementById('statCardsContainer');
        if (!statContainer) return;

        const itr = this.allServices.find(s => s.serviceName.toLowerCase().includes('itr')) || {status: 'Not Opted', deadline: 'N/A'};
        const gst = this.allServices.find(s => s.serviceName.toLowerCase().includes('gst')) || {status: 'Not Opted', deadline: 'N/A'};
        
        statContainer.innerHTML = `
            <div class="stat-card"><h3>ITR Status</h3><div class="value">${itr.status}</div><div class="sub-text">Due: ${itr.deadline}</div></div>
            <div class="stat-card"><h3>GST Status</h3><div class="value">${gst.status}</div><div class="sub-text">Next: ${gst.deadline}</div></div>
            <div class="stat-card"><h3>Total Services</h3><div class="value">${this.allServices.length}</div><div class="sub-text">Active Now</div></div>
            <div class="stat-card"><h3>Storage</h3><div class="value">Cloud</div><div class="sub-text">Docs Secured</div></div>
        `;
    },

    renderCards: function() {
        const container = document.getElementById('dynamicServiceContent');
        if (!container) return;

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
                    <div><div style="font-size: 10px; color: #666; text-transform: uppercase;">Next Due Date</div><div style="font-size: 13px; color: #eee; font-weight: 500;">📅 ${service.deadline}</div></div>
                    <button class="service-btn" style="width:auto; padding: 6px 15px; font-size: 11px;">Details</button>
                </div>
            </div>`;
    },

    renderActivity: function() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        // Displaying last 3 service updates as activity
        let activities = this.allServices.map(s => `
            <div style="display: flex; gap: 15px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #222;">
                <div style="color: var(--primary); font-size: 14px;">●</div>
                <div>
                    <div style="color: #eee; font-size: 13px;"><b>${s.serviceName}</b> is currently <b>${s.status}</b></div>
                    <div style="color: #555; font-size: 11px;">Expected by: ${s.deadline}</div>
                </div>
            </div>
        `).slice(0, 3);

        activityList.innerHTML = activities.length > 0 ? activities.join('') : "No recent activity found.";
    }
};
