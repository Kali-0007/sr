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
                this.renderStats();    
                this.renderCards();    
                this.renderActivity(); 
                
                // --- YE WALI LINE ZAROOR ADD KAREIN ---
                this.loadNotices(); 
                // --------------------------------------
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
        let statusColor = '#ffa500'; // Default: Orange
        const st = (service.status || '').toLowerCase();
        if(st.includes('progress')) statusColor = 'var(--secondary)'; // Indigo/Blue
        if(st.includes('filed') || st.includes('complete')) statusColor = 'var(--primary)'; // Neon Green

        return `
            <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border); padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <span style="background: ${statusColor}15; color: ${statusColor}; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 20px; border: 1px solid ${statusColor}33; text-transform: uppercase;">
                            ${service.status}
                        </span>
                        <h3 style="color: var(--text-main); margin-top: 12px; font-size: 18px; font-weight: 600;">${service.serviceName}</h3>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--text-main);">${service.progress}%</div>
                        <div style="font-size: 10px; color: var(--text-grey); text-transform: uppercase; letter-spacing: 1px;">Done</div>
                    </div>
                </div>
                
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; margin: 25px 0; overflow: hidden;">
                    <div style="width: ${service.progress}%; height: 100%; background: linear-gradient(90deg, ${statusColor}, var(--accent)); transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 10px; color: var(--text-grey); text-transform: uppercase;">Next Due Date</div>
                        <div style="font-size: 13px; color: var(--text-main); font-weight: 500;">📅 ${service.deadline}</div>
                    </div>
                    <button class="service-btn" style="background: var(--secondary); color: white; border: none; padding: 8px 18px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: 0.3s;">
                        Details
                    </button>
                </div>
            </div>`;
    },
// Is function ko serviceHub object ke andar kahin bhi daal dein
loadNotices: async function() {
    const token = localStorage.getItem('userToken');
    const ticker = document.getElementById('notificationTicker');
    const tickerMsg = document.getElementById('tickerMessage');
    const container = document.querySelector('.container');

    if (!token || !ticker) return;

    try {
        const res = await fetch(`${this.API_URL}?action=get-notices&token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (data.status === 'success' && data.notices && data.notices.length > 0) {
            // 1. Saare messages ko screen par jod kar dikhayenge
            const allMsgs = data.notices.map(n => n.message).join('   |   ⭐   |   ');
            tickerMsg.innerText = allMsgs;

            // 2. Latest notice ka type check karenge (Sheet ke Dropdown se jo aayega)
            // Hum [0] isliye le rahe hain kyunki reverse() ki wajah se latest pehle hai
            const latestType = (data.notices[0].type || 'Info').toLowerCase();

            // 3. Rang badalne ka logic (Dynamic Colors)
            if (latestType === 'urgent') {
                ticker.style.background = '#ff4757'; // Bright Red
                ticker.style.borderBottom = '2px solid #b33939';
                tickerMsg.style.color = '#ffffff'; // White text for better contrast
            } else if (latestType === 'warning') {
                ticker.style.background = '#ffa502'; // Bright Orange
                ticker.style.borderBottom = '2px solid #e17055';
                tickerMsg.style.color = '#ffffff';
            } else if (latestType === 'success') {
                ticker.style.background = '#2ed573'; // Fresh Green
                ticker.style.borderBottom = '2px solid #26af5a';
                tickerMsg.style.color = '#ffffff';
            } else {
                // Default Blue (Info ke liye)
                ticker.style.background = '#1e90ff'; 
                ticker.style.borderBottom = '2px solid #0984e3';
                tickerMsg.style.color = '#ffffff';
            }

            ticker.style.display = 'block';
            if(container) container.style.marginTop = '115px';
        }
    } catch (e) {
        console.error("Notice Load Error:", e);
    }
},
    renderActivity: function() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        // Displaying last 4 service updates for a richer look
        let activities = this.allServices.map(s => {
            // Logic to pick the right color based on status
            let stColor = '#ffc107'; // Default: Pending (Yellow)
            const st = (s.status || '').toLowerCase();
            if(st.includes('progress')) stColor = 'var(--secondary)'; // In Progress (Indigo/Blue)
            if(st.includes('filed') || st.includes('complete') || st.includes('success')) stColor = 'var(--primary)'; // Success (Neon Green)

            return `
                <div style="display: flex; gap: 15px; margin-bottom: 18px; padding-bottom: 15px; border-bottom: 1px solid var(--border); align-items: center;">
                    <div style="background: ${stColor}15; color: ${stColor}; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 1px solid ${stColor}25;">
                        <i class="fas fa-file-invoice"></i>
                    </div>
                    
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: var(--text-main); font-size: 14px; font-weight: 600;">${s.serviceName}</div>
                            <span style="font-size: 10px; padding: 2px 8px; border-radius: 6px; background: ${stColor}10; color: ${stColor}; border: 1px solid ${stColor}30; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${s.status}
                            </span>
                        </div>
                        <div style="color: var(--text-grey); font-size: 11px; margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                            <i class="far fa-clock"></i> Updated: ${s.deadline}
                        </div>
                    </div>
                </div>
            `;
        }).slice(0, 4); // Humne 3 se badha kar 4 kar diya taaki box khali na lage

        activityList.innerHTML = activities.length > 0 ? activities.join('') : 
            `<div style="color: var(--text-grey); text-align: center; padding: 30px; font-size: 14px;">No active orders or activity yet.</div>`;
    }
};
