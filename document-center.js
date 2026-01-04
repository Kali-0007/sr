/**
 * TaxEasePro - Document Center (Modular Logic)
 */

// document-center.js ki sabse pehli line mein ye jodein
const API_URL = 'https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec';

const docCenter = {
    // ... baaki poora code waisa hi rahega
    // 1. HTML Structure jo dashboard mein jayega
    getTemplate: function() {
        return `
            <h2 class="section-title">Document Center</h2>
            
            <div style="display: grid; gap: 30px;">
                <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border);">
                    <h3 style="color: var(--secondary); margin-bottom:15px; display:flex; align-items:center; gap:10px;">
                        <span>📤</span> My Uploaded Documents
                    </h3>
                    <table class="doc-table">
                        <thead>
                            <tr><th>File Name</th><th>Date</th><th>Status</th></tr>
                        </thead>
                        <tbody id="userUploadsBody">
                            <tr><td colspan="3" style="text-align:center; padding:20px;">Scanning your folder...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border);">
                    <h3 style="color: var(--primary); margin-bottom:15px; display:flex; align-items:center; gap:10px;">
                        <span>📜</span> Documents Issued by Admin
                    </h3>
                    <table class="doc-table">
                        <thead>
                            <tr><th>Report Name</th><th>Date</th><th>Action</th></tr>
                        </thead>
                        <tbody id="adminIssuedBody">
                            <tr><td colspan="3" style="text-align:center; padding:20px;">Checking for new reports...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 2. Dashboard mein content load karna
    init: async function() {
        const container = document.getElementById('docHubContainer');
        if (!container) return;

        // HTML Inject karna
        container.innerHTML = this.getTemplate();
        
        // Data fetch karna
        this.loadFiles();
    },

    // 3. Backend (Apps Script) se data lana
    loadFiles: async function() {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
            // API_URL wahi hai jo aapne upload-handler.js mein di hai
            const response = await fetch(`${API_URL}?action=get-doc-hub&token=${encodeURIComponent(token)}`);
            const data = await response.json();

            if (data.status === 'success') {
                this.renderTables(data.userFiles, data.adminFiles);
            }
        } catch (err) {
            console.error("Doc Center Error:", err);
        }
    },

    renderTables: function(userFiles, adminFiles) {
        const uBody = document.getElementById('userUploadsBody');
        const aBody = document.getElementById('adminIssuedBody');

        // User Table Render
        uBody.innerHTML = userFiles.length ? userFiles.map(f => `
            <tr>
                <td>${f.name}</td>
                <td>${f.date}</td>
                <td><span class="status-badge ${f.status.toLowerCase()}">${f.status}</span></td>
            </tr>
        `).join('') : '<tr><td colspan="3" style="text-align:center;">No files uploaded yet.</td></tr>';

        // Admin Table Render
        aBody.innerHTML = adminFiles.length ? adminFiles.map(f => `
            <tr>
                <td>${f.name}</td>
                <td>${f.date}</td>
                <td><a href="${f.url}" target="_blank" class="logout-btn-header" style="padding:5px 12px; font-size:12px;">Download</a></td>
            </tr>
        `).join('') : '<tr><td colspan="3" style="text-align:center;">No reports issued yet.</td></tr>';
    }
};
