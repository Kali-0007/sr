/**
 * TaxEasePro - Document Center (Conflict-Free Version)
 */

// Variable ka naam badal diya taaki 'already declared' error na aaye
const DOC_HUB_API = 'https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec';

const docCenter = {
    getTemplate: function() {
        return `
            <div class="doc-hub-header" style="margin-bottom: 20px;">
                <h2 class="section-title">Document Center</h2>
                <div class="search-container" style="margin-top: 15px; position: relative;">
                    <input type="text" id="docSearchInput" placeholder="🔍 Search documents by name or date (e.g. 2024)..." 
                        style="width: 100%; padding: 12px 15px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; outline: none;">
                </div>
            </div>

            <div class="doc-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                
                <div class="stat-card" style="background: #1a1a1a; border: 1px solid #333; padding: 20px; border-radius: 12px; display: flex; flex-direction: column;">
                    <h3 style="color: #00d4ff; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                        <span>📤 My Uploads</span>
                        <span style="font-size:10px; background:#333; padding:2px 8px; border-radius:10px; color:#aaa;">Newest First</span>
                    </h3>
                    <div style="max-height: 450px; overflow-y: auto; scrollbar-width: thin; padding-right: 5px;">
                        <table style="width:100%; border-collapse: collapse; color: #eee;">
                            <thead style="position: sticky; top: 0; background: #1a1a1a; z-index: 10;">
                                <tr style="text-align:left; border-bottom: 2px solid #333;">
                                    <th style="padding:12px; font-size:13px;">File Name</th>
                                    <th style="padding:12px; font-size:13px;">Date</th>
                                    <th style="padding:12px; font-size:13px;">Status</th>
                                </tr>
                            </thead>
                            <tbody id="userUploadsBody">
                                <tr><td colspan="3" style="text-align:center; padding:20px; color:#666;">Scanning files...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="stat-card" style="background: #1a1a1a; border: 1px solid #333; padding: 20px; border-radius: 12px; display: flex; flex-direction: column;">
                    <h3 style="color: #00ff88; margin-bottom:15px;">📜 Issued Reports</h3>
                    <div style="max-height: 450px; overflow-y: auto; scrollbar-width: thin; padding-right: 5px;">
                        <table style="width:100%; border-collapse: collapse; color: #eee;">
                            <thead style="position: sticky; top: 0; background: #1a1a1a; z-index: 10;">
                                <tr style="text-align:left; border-bottom: 2px solid #333;">
                                    <th style="padding:12px; font-size:13px;">Report Name</th>
                                    <th style="padding:12px; font-size:13px;">Date</th>
                                    <th style="padding:12px; font-size:13px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="adminIssuedBody">
                                <tr><td colspan="3" style="text-align:center; padding:20px; color:#666;">Checking reports...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        `;
    },

    init: async function() {
        const container = document.getElementById('returns');
        if (!container) return;
        container.innerHTML = this.getTemplate();
        await this.loadFiles();
    },

    loadFiles: async function() {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
            const response = await fetch(`${DOC_HUB_API}?action=get-doc-hub&token=${encodeURIComponent(token)}`);
            const data = await response.json();

            if (data.status === 'success') {
                // Search ke liye data save kar rahe hain
                this.allUserFiles = data.userFiles || [];
                this.allAdminFiles = data.adminFiles || [];
                
                this.renderTables(this.allUserFiles, this.allAdminFiles);
                this.setupSearch(); // Search activate karne ke liye
            }
        } catch (err) {
            console.error("Doc Center Error:", err);
        }
    },

    setupSearch: function() {
        const searchInput = document.getElementById('docSearchInput');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            const filteredUser = this.allUserFiles.filter(f => 
                f.name.toLowerCase().includes(term) || f.date.toLowerCase().includes(term)
            );
            
            const filteredAdmin = this.allAdminFiles.filter(f => 
                f.name.toLowerCase().includes(term) || f.date.toLowerCase().includes(term)
            );

            this.renderTables(filteredUser, filteredAdmin);
        });
    },

    renderTables: function(userFiles, adminFiles) {
        const uBody = document.getElementById('userUploadsBody');
        const aBody = document.getElementById('adminIssuedBody');

        // Newest on top
        const displayUser = [...userFiles].reverse();
        const displayAdmin = [...adminFiles].reverse();

        uBody.innerHTML = displayUser.length ? displayUser.map(f => {
            const statusText = (f.status || 'Pending').trim();
            const statusKey = statusText.toLowerCase();
            let statusColor = '#ffa500';
            if(statusKey === 'verified' || statusKey === 'success') statusColor = '#00ff88';
            if(statusKey === 'rejected' || statusKey === 'failed') statusColor = '#ff4444';
            if(statusKey === 'in progress') statusColor = '#00d4ff';

            return `
                <tr style="border-bottom: 1px solid #222;">
                    <td style="padding:12px; font-size:13px;">${f.name}</td>
                    <td style="padding:12px; font-size:13px; color:#888;">${f.date}</td>
                    <td style="padding:12px;">
                        <span style="color:${statusColor}; font-weight:bold; border:1px solid ${statusColor}; padding:2px 10px; border-radius:15px; font-size:10px; text-transform: uppercase;">
                            ${statusText}
                        </span>
                    </td>
                </tr>`;
        }).join('') : '<tr><td colspan="3" style="text-align:center; padding:20px; color:#666;">No matching files.</td></tr>';

        aBody.innerHTML = displayAdmin.length ? displayAdmin.map(f => `
            <tr style="border-bottom: 1px solid #222;">
                <td style="padding:12px; font-size:13px;">${f.name}</td>
                <td style="padding:12px; font-size:13px; color:#888;">${f.date}</td>
                <td style="padding:12px;"><a href="${f.url}" target="_blank" style="color:#00ff88; text-decoration:none; font-weight:bold; border: 1px solid #00ff88; padding: 2px 8px; border-radius: 4px; font-size: 10px;">DOWNLOAD</a></td>
            </tr>`).join('') : '<tr><td colspan="3" style="text-align:center; padding:20px; color:#666;">No matching reports.</td></tr>';
    }
}
