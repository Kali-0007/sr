const API = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";
let isEditMode = false;

async function showProfile() {
    const mainArea = document.getElementById('mainContent');
    const token = localStorage.getItem('userToken');

    mainArea.innerHTML = `<div class="glass-card" style="text-align:center; padding:100px 0;"><div class="spinner"></div><p>Loading Secure Profile...</p></div>`;

    try {
        const response = await fetch(`${API}?action=check-partner-profile-status&token=${token}`);
        const data = await response.json();

        if (data.status === "success") {
            renderProfileUI(data.profile);
        }
    } catch (e) { alert("Session error!"); }
}

function renderProfileUI(p) {
    const mainArea = document.getElementById('mainContent');
    const photoUrl = p.photoLink || 'https://via.placeholder.com/150';
    
    // Check if approved for Referral Code
    const isApproved = (p.profileStatus === "Approved" || p.profileStatus === "Active"); 

    mainArea.innerHTML = `
        <div class="animate-fade-in" style="max-width: 900px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h1 style="font-size: 24px; color: var(--primary-teal);">Partner Identity</h1>
                <div>
                    ${!isEditMode ? `<button onclick="toggleEdit(true)" class="btn btn-teal">✎ Edit Profile</button>` : ''}
                    <button onclick="location.reload()" class="btn btn-outline">← Back</button>
                </div>
            </div>

            <div class="glass-card" style="padding: 40px; position: relative;">
                <form id="profileForm">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="${photoUrl}" style="width: 110px; height: 110px; border-radius: 50%; border: 3px solid var(--primary-teal); padding: 5px;">
                        <h2 style="margin-top:10px;">${p.fullName}</h2>
                        <p style="color:var(--secondary-gold); font-size:13px;">Status: ${p.profileStatus || 'Pending Approval'}</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray);">FULL NAME</label>
                            <input type="text" id="upd-name" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.fullName}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray);">MOBILE</label>
                            <input type="text" id="upd-mobile" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.mobile}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray);">PROFESSION</label>
                            ${!isEditMode ? 
                                `<input type="text" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.profession}" readonly>` :
                                `<select id="upd-profession" class="btn btn-outline" style="width:100%; text-align:left; appearance:auto;" onchange="checkProfession(this.value)">
                                    <option value="Tax Consultant" ${p.profession === 'Tax Consultant' ? 'selected' : ''}>Tax Consultant</option>
                                    <option value="CA" ${p.profession === 'CA' ? 'selected' : ''}>Chartered Accountant (CA)</option>
                                    <option value="CS" ${p.profession === 'CS' ? 'selected' : ''}>Company Secretary (CS)</option>
                                    <option value="Advocate" ${p.profession === 'Advocate' ? 'selected' : ''}>Advocate</option>
                                </select>`
                            }
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray);">PAN NUMBER</label>
                            <input type="text" id="upd-pan" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.panNumber}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div id="membership-box" style="display: ${(p.profession === 'CA' || p.profession === 'CS') ? 'block' : 'none'};">
                            <label style="font-size: 11px; color: var(--text-gray);">MEMBERSHIP NUMBER</label>
                            <input type="text" id="upd-membership" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.membershipNumber}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray);">ACCOUNT NUMBER</label>
                            <input type="text" id="upd-acc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.accountNumber}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray);">IFSC CODE</label>
                            <input type="text" id="upd-ifsc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.ifscCode}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div style="grid-column: span ${isApproved ? '1' : '2'};">
                            <label style="font-size: 11px; color: var(--secondary-gold);">REFERRAL CODE</label>
                            <input type="text" class="btn btn-outline" style="width:100%; text-align:left; border: 1px dashed var(--secondary-gold); color:var(--secondary-gold);" 
                                value="${isApproved ? (p.referralCode || 'NOT_GEN_YET') : 'Unlocked After Admin Approval'}" readonly>
                        </div>
                    </div>

                    ${isEditMode ? `
                    <div style="margin-top:20px; border: 1px dashed rgba(255,255,255,0.2); padding:15px; border-radius:10px;">
                        <label style="font-size: 12px;">Upload PAN Card (JPG/PDF):</label>
                        <input type="file" id="pan-file" style="margin-top:10px; display:block;">
                    </div>
                    ` : ''}

                    ${isEditMode ? `
                    <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                        <button type="submit" class="btn btn-teal" style="padding: 12px 40px;">Save Changes</button>
                        <button type="button" onclick="toggleEdit(false)" class="btn btn-outline" style="color:var(--danger-red);">Cancel</button>
                    </div>
                    ` : ''}
                </form>
            </div>
        </div>
    `;

    if(isEditMode) attachSubmit(p);
}

function toggleEdit(mode) {
    isEditMode = mode;
    showProfile(); // Re-render
}

function checkProfession(val) {
    const box = document.getElementById('membership-box');
    box.style.display = (val === 'CA' || val === 'CS') ? 'block' : 'none';
}

function attachSubmit(oldData) {
    document.getElementById('profileForm').onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerText = "Processing...";

        const payload = {
            action: "update-partner-profile",
            token: localStorage.getItem('userToken'),
            fullName: document.getElementById('upd-name').value,
            mobile: document.getElementById('upd-mobile').value,
            profession: document.getElementById('upd-profession').value,
            panNumber: document.getElementById('upd-pan').value,
            membershipNumber: document.getElementById('upd-membership')?.value || "",
            accountNumber: document.getElementById('upd-acc').value,
            ifscCode: document.getElementById('upd-ifsc').value
        };

        try {
            const res = await fetch(API, { method: 'POST', body: JSON.stringify(payload) });
            const result = await res.json();
            if(result.status === "success") {
                alert("Profile Updated!");
                isEditMode = false;
                showProfile();
            }
        } catch (e) { alert("Error updating!"); }
    };
}
