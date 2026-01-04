/**
 * TaxEasePro - Document Center (Fixed Logic)
 */

const API_URL = 'https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec';

const docCenter = {
    // 1. HTML Structure
    getTemplate: function() {
        return `
            <h2 class="section-title">Document Center</h2>
            
            <div style="display: grid; gap: 30px;">
                <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border); padding: 20px; border-radius: 12px;">
                    <h3 style="color: var(--secondary); margin-bottom:15px; display:flex; align-items:center; gap:10px;">
                        <span>📤</span> My Uploaded Documents
                    </h3>
                    <table class="doc-table" style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align:left; border-bottom: 1px solid var(--border);">
                                <th style="padding:10px;">File Name</th>
                                <th style="padding:10px;">Date</th>
                                <th style="padding:10px;">Status</th>
                            </tr>
                        </thead>
                        <tbody id="userUploadsBody">
                            <tr><td colspan="3" style="text-align:center; padding:20px;">Scanning your folder...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border); padding: 20px; border-radius: 12px;">
                    <h3 style="color: var(--primary); margin-bottom:15px; display:flex; align-items:center; gap:10px;">
                        <span>📜</span> Documents Issued by Admin
                    </h3>
                    <table class="doc-table" style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align:left; border-bottom: 1px solid var(--border);">
                                <th style="padding:10px;">Report Name</th>
                                <th style="padding:10px;">Date</th>
                                <th style="padding:10px;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="adminIssuedBody">
                            <tr><td colspan="3" style="text-align:center; padding:20px;">Checking for reports...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 2. Initialization
    init: async function() {
        // Hum direct 'returns' tab ke andar content daal rahe hain
        const container = document.getElementById('returns');
        if (!container) return;

        container.innerHTML = this.getTemplate();
        await this.loadFiles();
    },

    // 3. Backend Fetch
    loadFiles: async function() {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}?action=get-doc-hub&token=${encodeURIComponent(token)}`);
            const data = await response.json();

            if (data.status === 'success') {
                this.renderTables(data.userFiles || [], data.adminFiles || []);
            }
        } catch (err) {
            console.error("Doc Center Error:", err);
            document.getElementById('userUploadsBody').innerHTML = '<tr><td colspan="3">Error loading files.</td></tr>';
        }
    },

    renderTables: function(userFiles, adminFiles) {
        const uBody = document.getElementById('userUploadsBody');
        const aBody = document.getElementById('adminIssuedBody');

        uBody.innerHTML = userFiles.length ? userFiles.map(f => `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding:10px;">${f.name}</td>
                <td style="padding:10px;">${f.date}</td>
                <td style="padding:10px;"><span class="status-badge ${f.status ? f.status.toLowerCase() : 'pending'}">${f.status || 'Pending'}</span></td>
            </tr>
        `).join('') : '<tr><td colspan="3" style="text-align:center; padding:10px;">No files uploaded yet.</td></tr>';

        aBody.innerHTML = adminFiles.length ? adminFiles.map(f => `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding:10px;">${f.name}</td>
                <td style="padding:10px;">${f.date}</td>
                <td style="padding:10px;"><a href="${f.url}" target="_blank" class="logout-btn-header" style="padding:5px 12px; font-size:12px; text-decoration:none; display:inline-block;">Download</a></td>
            </tr>
        `).join('') : '<tr><td colspan="3" style="text-align:center; padding:10px;">No reports issued yet.</td></tr>';
    }
};
