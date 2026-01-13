// partner_profile.js

async function showProfile() {
    // 1. Dashboard ke main area ko target karein
    const mainArea = document.getElementById('mainContent'); 
    
    // 2. Turant loading state dikhayein
    mainArea.innerHTML = `
        <div class="glass-card" style="padding: 30px; text-align: center;">
            <h2 style="color: var(--accent);">Loading Your Profile...</h2>
            <div class="spinner"></div> </div>
    `;

    const token = localStorage.getItem('userToken');

    try {
        // 3. Backend se data mangwayein
        const response = await fetch(`${API}?action=get-partner-profile&token=${token}`);
        const data = await response.json();

        if (data.status === "success") {
            const p = data.profile;

            // 4. Main area mein Form ka HTML daalein
            mainArea.innerHTML = `
                <div class="glass-card animate-fade-in" style="padding: 30px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="color: var(--accent); margin: 0;">Partner Profile</h2>
                        <button onclick="location.reload()" class="btn-dash" style="font-size: 12px;">Back to Dashboard</button>
                    </div>
                    
                    <form id="dynamicProfileForm" class="data-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="font-size: 11px; color: var(--gold);">FULL NAME</label>
                            <input type="text" id="edit-name" value="${p.Name || ''}" class="p-input">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--gold);">MOBILE</label>
                            <input type="text" id="edit-mobile" value="${p.Mobile || ''}" class="p-input">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--gold);">PROFESSION</label>
                            <select id="edit-profession" class="p-input">
                                <option value="${p.Profession || ''}">${p.Profession || 'Select'}</option>
                                <option value="CA">Chartered Accountant</option>
                                <option value="CS">Company Secretary</option>
                                <option value="Tax Consultant">Tax Consultant</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--gold);">PAN NUMBER</label>
                            <input type="text" id="edit-pan" value="${p.PAN_Number || ''}" class="p-input" maxlength="10">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size: 11px; color: var(--gold);">ADDRESS</label>
                            <textarea id="edit-address" class="p-input" rows="2">${p.Address || ''}</textarea>
                        </div>
                        <div style="grid-column: span 2; text-align: center; margin-top: 20px;">
                            <button type="submit" class="btn-premium">Save Profile Changes</button>
                        </div>
                    </form>
                </div>
            `;

            // 5. Submit event attach karein
            attachUpdateLogic();
        }
    } catch (err) {
        mainArea.innerHTML = `<div class="error-msg">Failed to load profile. Please check your connection.</div>`;
    }
}

function attachUpdateLogic() {
    document.getElementById('dynamicProfileForm').onsubmit = async (e) => {
        e.preventDefault();
        const saveBtn = e.target.querySelector('button[type="submit"]');
        saveBtn.innerText = "Saving...";

        const payload = {
            action: "update-partner-profile",
            token: localStorage.getItem('userToken'),
            Name: document.getElementById('edit-name').value,
            Mobile: document.getElementById('edit-mobile').value,
            Profession: document.getElementById('edit-profession').value,
            PAN_Number: document.getElementById('edit-pan').value,
            Address: document.getElementById('edit-address').value
        };

        try {
            const res = await fetch(API, { method: 'POST', body: JSON.stringify(payload) });
            const result = await res.json();
            if (result.status === "success") {
                alert("Profile Updated Successfully!");
                showProfile(); // Refresh profile content
            }
        } catch (err) {
            alert("Update failed!");
        } finally {
            saveBtn.innerText = "Save Profile Changes";
        }
    };
}
