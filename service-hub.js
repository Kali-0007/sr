/**
 * TaxEasePro - Service Hub (Dynamic Homepage)
 */

const serviceHub = {
    allServices: [],

    getTemplate: function() {
        return `
            <div class="service-hub-header" style="margin-bottom: 30px;">
                <h2 style="font-size: 24px; color: #fff; margin-bottom: 10px;">Dashboard Overview 👋</h2>
                <p style="color: #888;">Track your active tax compliance and filing status in real-time.</p>
            </div>
            
            <div id="servicesGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                <div style="color: #666; padding: 20px;">Fetching your latest updates...</div>
            </div>
        `;
    },

    init: async function() {
        const container = document.getElementById('dynamicServiceContent'); 
        if (!container) return;
        
        container.innerHTML = this.getTemplate();

        // CHANGE 1: userToken ko badal kar 'token' kar diya
        const token = localStorage.getItem('token'); 

        try {
            
            const response = await fetch(`${SCRIPT_URL}?action=get-service-hub&token=${encodeURIComponent(token)}`);
            const data = await response.json();

            if (data.status === 'success' && data.services && data.services.length > 0) {
                this.allServices = data.services;
                this.renderCards();
            } else {
                document.getElementById('servicesGrid').innerHTML = `
                    <div style="grid-column: 1/-1; background: #1a1a1a; padding: 40px; border-radius: 12px; text-align: center; border: 1px dashed #333;">
                        <div style="font-size: 40px; margin-bottom: 15px;">📁</div>
                        <h3 style="color: #eee;">No Active Services</h3>
                        <p style="color: #666;">Please contact admin to activate your tax services.</p>
                    </div>`;
            }
        } catch (err) {
            console.error("Service Hub Error:", err);
        }
    },
    renderCards: function() {
        const grid = document.getElementById('servicesGrid');
        
        grid.innerHTML = this.allServices.map(service => {
            // Status based Colors
            let statusColor = '#ffa500'; // Orange (Pending)
            const st = service.status.toLowerCase();
            if(st.includes('progress')) statusColor = '#00d4ff'; // Blue
            if(st.includes('filed') || st.includes('complete')) statusColor = '#00ff88'; // Green
            if(st.includes('draft')) statusColor = '#bb86fc'; // Purple

            // Timeline Steps Logic
            const stepsHtml = service.labels.map((label, index) => {
                const totalSteps = service.labels.length;
                const stepThreshold = ((index + 1) / totalSteps) * 100;
                const isCompleted = service.progress >= stepThreshold;
                
                return `
                    <div style="flex: 1; position: relative; text-align: center;">
                        <div style="height: 4px; background: ${isCompleted ? statusColor : '#333'}; border-radius: 2px; margin-bottom: 8px;"></div>
                        <span style="font-size: 9px; color: ${isCompleted ? '#eee' : '#555'}; text-transform: uppercase; display: block;">${label}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="stat-card" style="background: #1a1a1a; border: 1px solid #333; padding: 25px; border-radius: 15px; transition: transform 0.3s; cursor: pointer;">
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

                    <div style="display: flex; gap: 8px; margin: 25px 0;">
                        ${stepsHtml}
                    </div>

                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #222; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 10px; color: #666; text-transform: uppercase;">Next Due Date</div>
                            <div style="font-size: 13px; color: #eee; font-weight: 500;">📅 ${service.deadline}</div>
                        </div>
                        <button onclick="switchTab('documents')" style="background: #333; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">
                            Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
};
