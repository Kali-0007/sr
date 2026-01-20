const serviceHub = {
    allServices: [],
    API_URL: "https://script.google.com/macros/s/AKfycbwtClA1mmRpEO154x20nahYGhDAN83ODXPE1jhzJs65aqkCnMEldsmwFoTyTF44Rp3j/exec",

    init: async function() {
        // Greeting Logic
        const hours = new Date().getHours();
        let greet = (hours < 12) ? "Good Morning," : (hours < 16) ? "Good Afternoon," : "Good Evening,";
        const greetEl = document.getElementById('greetingText');
        if (greetEl) greetEl.innerText = greet;

        const container = document.getElementById('dynamicServiceContent'); 
        if (!container) return;
        
        const token = localStorage.getItem('userToken'); 
        if (!token) return;

        try {
            // Backend ko wahi purana request jayega (No change in Backend)
            const response = await fetch(`${this.API_URL}?action=get-service-hub&token=${encodeURIComponent(token)}`);
            const data = await response.json();

            if (data.status === 'success' && data.services) {
                this.allServices = data.services;
                this.renderStats();    
                this.renderTable(); // renderCards ki jagah renderTable bulayenge
                this.renderActivity(); 
                if (typeof this.loadNotices === 'function') this.loadNotices(); 
            }
        } catch (err) {
            console.error("Service Hub Error:", err);
        }
    },

    renderStats: function() {
        const statContainer = document.getElementById('statCardsContainer');
        if (!statContainer) return;

        const displayServices = this.allServices.slice(0, 3);
        let statsHtml = '';

        displayServices.forEach(s => {
            statsHtml += `
                <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border); padding:20px; border-radius:12px;">
                    <h3 style="font-size:11px; color: var(--accent); text-transform:uppercase; margin:0; letter-spacing:1px;">${s.serviceName}</h3>
                    <div class="value" style="font-size:20px; color: var(--text-main); font-weight:800; margin:8px 0;">${s.status}</div>
                    <div class="sub-text" style="font-size:12px; color: var(--text-grey);">📅 ${s.deadline}</div>
                </div>
            `;
        });

        statsHtml += `
            <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border); padding:20px; border-radius:12px;">
                <h3 style="font-size:11px; color: var(--accent); text-transform:uppercase; margin:0; letter-spacing:1px;">Total Active</h3>
                <div class="value" style="font-size:24px; color: var(--text-main); font-weight:800; margin:8px 0;">${this.allServices.length}</div>
                <div class="sub-text" style="font-size:12px; color: var(--text-grey);">Services Tracked</div>
            </div>
        `;
        statContainer.innerHTML = statsHtml;
    },

   renderTable: function() {
        const container = document.getElementById('dynamicServiceContent');
        if (!container) return;
        const sortedServices = [...this.allServices].reverse();

        container.innerHTML = `
            <div class="service-hub-header" style="margin-bottom: 20px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-size: 20px; color: var(--text-main);">Service Trackers (${this.allServices.length})</h2>
                <span style="font-size: 11px; color: var(--accent); background: rgba(56,189,248,0.1); padding: 4px 10px; border-radius: 20px;">Latest Updates First</span>
            </div>
            <div style="background: var(--panel-bg); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 4px 15px var(--card-shadow); overflow: hidden;">
                <div style="max-height: 480px; overflow-y: auto; overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 600px; text-align: left;">
                        <thead style="position: sticky; top: 0; z-index: 100; background: var(--panel-bg);">
                            <tr style="border-bottom: 1px solid var(--border);">
                                <th style="padding: 15px; color: var(--text-grey); font-size: 11px; text-transform: uppercase;">Service Name</th>
                                <th style="padding: 15px; color: var(--text-grey); font-size: 11px; text-transform: uppercase;">Status</th>
                                <th style="padding: 15px; color: var(--text-grey); font-size: 11px; text-transform: uppercase;">Progress</th>
                                <th style="padding: 15px; color: var(--text-grey); font-size: 11px; text-transform: uppercase;">Next Due</th>
                                <th style="padding: 15px; color: var(--text-grey); font-size: 11px; text-transform: uppercase; text-align: center;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedServices.map(service => this.generateRowHtml(service)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    generateRowHtml: function(service) {
        let statusColor = '#ffa500'; 
        const st = (service.status || '').toLowerCase();
        if(st.includes('progress')) statusColor = '#38bdf8'; 
        if(st.includes('filed') || st.includes('complete')) statusColor = '#00ff88';

        return `
            <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                <td style="padding: 15px; color: var(--text-main); font-weight: 500;">${service.serviceName}</td>
                <td style="padding: 15px;">
                    <span style="display: flex; align-items: center; gap: 8px; color: ${statusColor}; font-size: 12px; font-weight: bold;">
                        <span style="width: 6px; height: 6px; background: ${statusColor}; border-radius: 50%;"></span>
                        ${service.status}
                    </span>
                </td>
                <td style="padding: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 80px; height: 5px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                            <div style="width: ${service.progress}%; height: 100%; background: ${statusColor}; transition: width 0.5s;"></div>
                        </div>
                        <span style="font-size: 11px; color: var(--text-grey);">${service.progress}%</span>
                    </div>
                </td>
                <td style="padding: 15px; color: var(--text-main); font-size: 13px;">📅 ${service.deadline}</td>
                <td style="padding: 15px; text-align: center;">
                    <button onclick="serviceHub.showDetails('${encodeURIComponent(JSON.stringify(service))}')" class="service-btn" style="background: var(--secondary); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 11px; cursor: pointer;">
    Details
</button>
                </td>
            </tr>
        `;
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
    },
    // Isme line count aapke original code jaisa hi rahega
showDetails: function(serviceStr) {
    const service = JSON.parse(decodeURIComponent(serviceStr));
    
    // Progress ke hisaab se steps ko "Done" dikhane ka logic
    const stepsHtml = service.labels.map((step, index) => {
        const stepWeight = 100 / service.labels.length;
        const isDone = service.progress >= (index + 1) * stepWeight || service.progress === 100;
        const isCurrent = !isDone && (service.progress >= index * stepWeight);

        return `
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; position: relative;">
                ${index < service.labels.length - 1 ? `<div style="position: absolute; left: 12px; top: 24px; width: 2px; height: 20px; background: ${service.progress > (index+1)*stepWeight ? '#00ff88' : 'var(--border)'};"></div>` : ''}
                
                <div style="width: 26px; height: 26px; border-radius: 50%; background: ${isDone ? '#00ff88' : isCurrent ? '#38bdf8' : 'var(--bg-main)'}; border: 2px solid ${isDone ? '#00ff88' : 'var(--border)'}; display: flex; align-items: center; justify-content: center; font-size: 11px; color: ${isDone ? '#000' : 'var(--text-main)'}; z-index: 2; font-weight: bold;">
                    ${isDone ? '✓' : index + 1}
                </div>
                
                <div style="flex: 1;">
                    <div style="color: ${isDone || isCurrent ? 'var(--text-main)' : 'var(--text-grey)'}; font-size: 14px; font-weight: 600; margin-top: 3px;">${step}</div>
                    <div style="color: ${isCurrent ? '#38bdf8' : 'var(--text-grey)'}; font-size: 11px; margin-top: 2px;">
                        ${isDone ? 'Completed' : isCurrent ? 'In Progress...' : 'Waiting to start'}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const modalHtml = `
        <div id="detailsModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:10000; backdrop-filter:blur(8px); animation: fadeIn 0.2s ease;">
            <div style="background:var(--panel-bg); width:90%; max-width:400px; border-radius:20px; border:1px solid var(--border); overflow:hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                <div style="padding:20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background: rgba(255,255,255,0.02);">
                    <div>
                        <h3 style="color:var(--text-main); margin:0; font-size:16px; font-weight:700;">${service.serviceName}</h3>
                        <p style="margin:0; font-size:11px; color:#38bdf8;">Track your application status</p>
                    </div>
                    <button onclick="document.getElementById('detailsModal').remove()" style="background:var(--bg-main); border:none; color:var(--text-grey); width:30px; height:30px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:18px;">&times;</button>
                </div>
                <div style="padding:30px 25px;">
                    ${stepsHtml}
                </div>
                <div style="padding:15px 25px; background:rgba(56, 189, 248, 0.05); border-top:1px solid var(--border); display:flex; justify-content:center;">
                    <span style="color:#38bdf8; font-size:12px; font-weight:500;">
                        <i class="far fa-calendar-alt"></i> Estimated Completion: ${service.deadline}
                    </span>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
},

showSecurityVault: function() {
    const vaultHtml = `
        <div id="securityModal" style="display:flex; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); align-items:center; justify-content:center; padding: 20px;">
           <div style="background: var(--panel-bg); max-width: 480px; width:100%; border-radius:16px; border: 1px solid var(--border); overflow:hidden; animation: slideUp 0.3s ease;">
                
                <div style="padding: 30px 25px; text-align: center; background: linear-gradient(to bottom, var(--panel-bg), var(--bg-main));">
                    <div style="font-size: 50px; margin-bottom: 15px;">🛡️</div>
                    <h2 style="color:var(--text-main); margin:0; font-size: 22px; font-weight: 700;">Data Privacy Commitment</h2>
                    <p style="color:var(--text-grey); font-size:14px; margin-top:8px;">How TaxEasePro secures your sensitive information</p>
                </div>

                <div style="padding: 10px 30px 30px 30px;">
                    <ul style="list-style: none; padding: 0; margin: 0; color: var(--text-main); font-size: 14px; line-height: 1.8;">
                        <li style="margin-bottom: 12px; display: flex; gap: 12px;">
                            <span style="color: #38bdf8;">◈</span>
                            <span><b>Bank-Grade Encryption:</b> Documents are protected via 256-bit SSL encryption during transit and storage.</span>
                        </li>
                        <li style="margin-bottom: 12px; display: flex; gap: 12px;">
                            <span style="color: #38bdf8;">◈</span>
                            <span><b>Confidential Processing:</b> Only your assigned tax expert can access the files for filing purposes.</span>
                        </li>
                        <li style="margin-bottom: 12px; display: flex; gap: 12px;">
                            <span style="color: #38bdf8;">◈</span>
                            <span><b>Strict Compliance:</b> We adhere to data protection norms ensuring your PAN and Aadhaar details are never shared.</span>
                        </li>
                    </ul>

                    <button onclick="document.getElementById('securityModal').remove()" style="width: 100%; margin-top: 20px; padding: 12px; background: #00ff88; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 700;">
                        I UNDERSTAND
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', vaultHtml);
},
