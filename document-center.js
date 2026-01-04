/**
 * TaxEasePro - Document Center (Conflict-Free Version)
 */

// Variable ka naam badal diya taaki 'already declared' error na aaye
const DOC_HUB_API = 'https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec';

const docCenter = {
    getTemplate: function() {
        return `
            <h2 class="section-title">Document Center</h2>
            <div style="display: grid; gap: 20px;">
                <div class="stat-card" style="background: #1a1a1a; border: 1px solid #333; padding: 20px; border-radius: 10px;">
                    <h3 style="color: #00d4ff; margin-bottom:15px;">📤 My Uploaded Documents</h3>
                    <table style="width:100%; border-collapse: collapse; color: #eee;">
                        <thead>
                            <tr style="text-align:left; border-bottom: 2px solid #333;">
                                <th style="padding:10px;">File Name</th>
                                <th style="padding:10px;">Date</th>
                                <th style="padding:10px;">Status</th>
                            </tr>
                        </thead>
                        <tbody id="userUploadsBody">
                            <tr><td colspan="3" style="text-align:center; padding:20px;">Scanning files...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="stat-card" style="background: #1a1a1a; border: 1px solid #333; padding: 20px; border-radius: 10px;">
                    <h3 style="color: #00ff88; margin-bottom:15px;">📜 Documents Issued by Admin</h3>
                    <table style="width:100%; border-collapse: collapse; color: #eee;">
                        <thead>
                            <tr style="text-align:left; border-bottom: 2px solid #333;">
                                <th style="padding:10px;">Report Name</th>
                                <th style="padding:10px;">Date</th>
                                <th style="padding:10px;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="adminIssuedBody">
                            <tr><td colspan="3" style="text-align:center; padding:20px;">Checking reports...</td></tr>
                        </tbody>
                    </table>
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
            // Yahan bhi naya variable 'DOC_HUB_API' use kiya hai
            const response = await fetch(`${DOC_HUB_API}?action=get-doc-hub&token=${encodeURIComponent(token)}`);
            const data = await response.json();

            if (data.status === 'success') {
                this.renderTables(data.userFiles || [], data.adminFiles || []);
            }
        } catch (err) {
            console.error("Doc Center Error:", err);
        }
    },

   renderTables: function(userFiles, adminFiles) {
        const uBody = document.getElementById('userUploadsBody');
        const aBody = document.getElementById('adminIssuedBody');

        uBody.innerHTML = userFiles.length ? userFiles.map(f => {
            // Status ko clean karna (Spelling aur Space ka tension khatam)
            const statusText = (f.status || 'Pending').trim();
            const statusKey = statusText.toLowerCase();
            
            let statusColor = '#ffa500'; // Default: Orange (Pending)
            
            if(statusKey === 'verified' || statusKey === 'success') {
                statusColor = '#00ff88'; // Green
            } else if(statusKey === 'rejected' || statusKey === 'failed') {
                statusColor = '#ff4444'; // Red
            } else if(statusKey === 'in progress') {
                statusColor = '#00d4ff'; // Blue
            }

            return `
                <tr style="border-bottom: 1px solid #222;">
                    <td style="padding:10px;">${f.name}</td>
                    <td style="padding:10px;">${f.date}</td>
                    <td style="padding:10px;">
                        <span style="color:${statusColor}; font-weight:bold; border:1px solid ${statusColor}; padding:2px 10px; border-radius:15px; font-size:11px; text-transform: uppercase;">
                            ${statusText}
                        </span>
                    </td>
                </tr>
            `;
        }).join('') : '<tr><td colspan="3" style="text-align:center; padding:10px;">No uploads found.</td></tr>';

        // Admin Table (Download list)
        aBody.innerHTML = adminFiles.length ? adminFiles.map(f => `
            <tr style="border-bottom: 1px solid #222;">
                <td style="padding:10px;">${f.name}</td>
                <td style="padding:10px;">${f.date}</td>
                <td style="padding:10px;"><a href="${f.url}" target="_blank" style="color:#00ff88; text-decoration:none; font-weight:bold; border: 1px solid #00ff88; padding: 2px 8px; border-radius: 4px; font-size: 11px;">DOWNLOAD</a></td>
            </tr>
        `).join('') : '<tr><td colspan="3" style="text-align:center; padding:10px;">No reports yet.</td></tr>';
    }
