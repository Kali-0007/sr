const DOC_HUB_API = 'https://script.google.com/macros/s/AKfycbwtClA1mmRpEO154x20nahYGhDAN83ODXPE1jhzJs65aqkCnMEldsmwFoTyTF44Rp3j/exec';

const docCenter = {
    getTemplate: function() {
        return `
            <div class="doc-hub-header" style="margin-bottom: 20px;">
                <h2 class="section-title" style="color: var(--text-main);">Document Center</h2>
                <div class="search-container" style="margin-top: 15px; position: relative;">
                    <input type="text" id="docSearchInput" placeholder="🔍 Search documents by name or date (e.g. 2024)..." 
                        style="width: 100%; padding: 12px 15px; background: var(--bg-main); border: 1px solid var(--border); border-radius: 8px; color: var(--text-main); outline: none;">
                </div>
            </div>

            <div class="doc-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                
                <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border); padding: 20px; border-radius: 12px; display: flex; flex-direction: column;">
                    <h3 style="color: var(--accent); margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                        <span>📤 My Uploads</span>
                        <span style="font-size:10px; background: var(--bg-main); padding:2px 8px; border-radius:10px; color: var(--text-grey);">Newest First</span>
                    </h3>
                    <div style="max-height: 450px; overflow-y: auto; scrollbar-width: thin; padding-right: 5px;">
                        <table style="width:100%; border-collapse: collapse; color: var(--text-main);">
                            <thead style="position: sticky; top: 0; background: var(--panel-bg); z-index: 10;">
                                <tr style="text-align:left; border-bottom: 2px solid var(--border);">
                                    <th style="padding:12px; font-size:13px; color: var(--text-grey);">File Name</th>
                                    <th style="padding:12px; font-size:13px; color: var(--text-grey);">Date</th>
                                    <th style="padding:12px; font-size:13px; color: var(--text-grey);">Status</th>
                                </tr>
                            </thead>
                            <tbody id="userUploadsBody">
                                <tr><td colspan="3" style="text-align:center; padding:20px; color: var(--text-grey);">Scanning files...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="stat-card" style="background: var(--panel-bg); border: 1px solid var(--border); padding: 20px; border-radius: 12px; display: flex; flex-direction: column;">
                    <h3 style="color: var(--primary); margin-bottom:15px;">📜 Issued Reports</h3>
                    <div style="max-height: 450px; overflow-y: auto; scrollbar-width: thin; padding-right: 5px;">
                        <table style="width:100%; border-collapse: collapse; color: var(--text-main);">
                            <thead style="position: sticky; top: 0; background: var(--panel-bg); z-index: 10;">
                                <tr style="text-align:left; border-bottom: 2px solid var(--border);">
                                    <th style="padding:12px; font-size:13px; color: var(--text-grey);">Report Name</th>
                                    <th style="padding:12px; font-size:13px; color: var(--text-grey);">Date</th>
                                    <th style="padding:12px; font-size:13px; color: var(--text-grey);">Action</th>
                                </tr>
                            </thead>
                            <tbody id="adminIssuedBody">
                                <tr><td colspan="3" style="text-align:center; padding:20px; color: var(--text-grey);">Checking reports...</td></tr>
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
                this.allUserFiles = data.userFiles || [];
                this.allAdminFiles = data.adminFiles || [];
                this.renderTables(this.allUserFiles, this.allAdminFiles);
                this.setupSearch();
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

        const displayUser = [...userFiles].reverse();
        const displayAdmin = [...adminFiles].reverse();

        uBody.innerHTML = displayUser.length ? displayUser.map(f => {
            const statusText = (f.status || 'Pending').trim();
            const statusKey = statusText.toLowerCase();
            let statusColor = '#ffa500'; // Pending (Theme independent)
            if(statusKey === 'verified' || statusKey === 'success') statusColor = '#00ff88';
            if(statusKey === 'rejected' || statusKey === 'failed') statusColor = '#ff4444';
            if(statusKey === 'in progress') statusColor = '#00d4ff';

            return `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding:12px; font-size:13px; color: var(--text-main);">${f.name}</td>
                    <td style="padding:12px; font-size:13px; color: var(--text-grey);">${f.date}</td>
                    <td style="padding:12px;">
                        <span style="color:${statusColor}; font-weight:bold; border:1px solid ${statusColor}; padding:2px 10px; border-radius:15px; font-size:10px; text-transform: uppercase;">
                            ${statusText}
                        </span>
                    </td>
                </tr>`;
        }).join('') : `<tr><td colspan="3" style="text-align:center; padding:20px; color: var(--text-grey);">No matching files.</td></tr>`;

        aBody.innerHTML = displayAdmin.length ? displayAdmin.map(f => `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding:12px; font-size:13px; color: var(--text-main);">${f.name}</td>
                <td style="padding:12px; font-size:13px; color: var(--text-grey);">${f.date}</td>
                <td style="padding:12px;"><a href="${f.url}" target="_blank" style="color: var(--primary); text-decoration:none; font-weight:bold; border: 1px solid var(--primary); padding: 4px 10px; border-radius: 6px; font-size: 10px;">DOWNLOAD</a></td>
            </tr>`).join('') : `<tr><td colspan="3" style="text-align:center; padding:20px; color: var(--text-grey);">No matching reports.</td></tr>`;
    }
}
