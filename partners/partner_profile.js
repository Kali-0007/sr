const API = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";
let isEditMode = false;

async function showProfile() {
    const mainArea = document.getElementById('mainContent');
    const token = localStorage.getItem('userToken');

    mainArea.innerHTML = `<div class="glass-card" style="text-align:center; padding:100px 0;"><div class="spinner"></div><p>Fetching Your Profile Data...</p></div>`;

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
    const isApproved = (p.profileStatus === "Active" || p.profileStatus === "Approved");

    mainArea.innerHTML = `
        <div class="animate-fade-in" style="max-width: 950px; margin: 0 auto; padding-bottom: 50px;">
            <h1 style="font-size: 26px; color: var(--primary-teal); margin-bottom: 20px; text-align:center;">Partner Control Center</h1>

            <div class="glass-card" style="padding: 40px;">
                <form id="profileForm">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <img src="${photoUrl}" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid var(--primary-teal); padding: 5px; background: rgba(255,255,255,0.05);">
                        <h2 style="margin-top:15px; letter-spacing:1px;">${p.fullName}</h2>
                        <span style="color:var(--secondary-gold); font-size:12px; font-weight:700; text-transform:uppercase;">${p.profileStatus || 'Verification Pending'}</span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px;">
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">FULL NAME</label>
                            <input type="text" id="upd-name" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.fullName}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">MOBILE NUMBER</label>
                            <input type="text" id="upd-mobile" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.mobile}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">PROFESSION</label>
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
                        <div id="membership-box" style="display: ${(p.profession === 'CA' || p.profession === 'CS') ? 'block' : 'none'};">
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">MEMBERSHIP NUMBER</label>
                            <input type="text" id="upd-membership" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.membershipNumber || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">PAN NUMBER</label>
                            <input type="text" id="upd-pan" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.panNumber}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">BANK NAME</label>
                            <input type="text" id="upd-bank" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.bankName}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">ACCOUNT NUMBER</label>
                            <input type="text" id="upd-acc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.accountNumber}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">IFSC CODE</label>
                            <input type="text" id="upd-ifsc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.ifscCode}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div style="grid-column: span 2;">
                            <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">OFFICE ADDRESS</label>
                            <textarea id="upd-address" class="btn btn-outline" style="width:100%; text-align:left; min-height: 80px; padding-top:12px;" ${!isEditMode ? 'readonly' : ''}>${p.address}</textarea>
                        </div>

                        <div style="grid-column: span 2;">
                            <label style="font-size: 11px; color: var(--secondary-gold); letter-spacing: 1px;">REFERRAL CODE (ACTIVATED AFTER APPROVAL)</label>
                            <input type="text" class="btn btn-outline" style="width:100%; text-align:left; border: 1px dashed var(--secondary-gold); color:var(--secondary-gold); font-weight:bold;" 
                                value="${isApproved ? (p.referralCode || 'GENERATING...') : 'Unlock Pending: Our team is verifying your profile'}" readonly>
                        </div>
                    </div>

                    ${isEditMode ? `
                    <div style="margin-top:25px; padding:20px; border: 1px dashed rgba(255,255,255,0.1); border-radius:12px; background:rgba(255,255,255,0.02);">
                        <p style="font-size:13px; margin-bottom:10px; color:var(--primary-teal);">Required Documents:</p>
                        <div style="display:flex; gap:20px;">
                           <div>
                               <label style="font-size:11px; display:block;">PAN CARD (PDF/JPG)</label>
                               <input type="file" id="upd-pandoc" style="font-size:11px; margin-top:5px;">
                           </div>
                           <div>
                               <label style="font-size:11px; display:block;">PROFILE PHOTO</label>
                               <input type="file" id="upd-photo" style="font-size:11px; margin-top:5px;">
                           </div>
                        </div>
                    </div>
                    ` : ''}

                    <div style="margin-top: 50px; display: flex; gap: 15px; justify-content: center;">
                        ${!isEditMode ? 
                            `<button type="button" onclick="toggleEdit(true)" class="btn btn-teal" style="padding: 15px 60px;">EDIT PROFILE</button>
                             <button type="button" onclick="location.reload()" class="btn btn-outline" style="padding: 15px 40px;">CLOSE</button>` : 
                            `<button type="submit" class="btn btn-teal" style="padding: 15px 60px;">SAVE CHANGES</button>
                             <button type="button" onclick="toggleEdit(false)" class="btn btn-outline" style="padding: 15px 40px; color:var(--danger-red);">CANCEL</button>`
                        }
                    </div>
                </form>
            </div>
        </div>
    `;

    if(isEditMode) attachSubmit();
}

function toggleEdit(mode) {
    isEditMode = mode;
    showProfile(); 
}

function checkProfession(val) {
    const box = document.getElementById('membership-box');
    box.style.display = (val === 'CA' || val === 'CS') ? 'block' : 'none';
}

function attachSubmit() {
    document.getElementById('profileForm').onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "UPDATING...";
        btn.disabled = true;

        const payload = {
            action: "update-partner-profile",
            token: localStorage.getItem('userToken'),
            fullName: document.getElementById('upd-name').value,
            mobile: document.getElementById('upd-mobile').value,
            profession: document.getElementById('upd-profession').value,
            panNumber: document.getElementById('upd-pan').value,
            membershipNumber: document.getElementById('upd-membership')?.value || "",
            bankName: document.getElementById('upd-bank').value,
            accountNumber: document.getElementById('upd-acc').value,
            ifscCode: document.getElementById('upd-ifsc').value,
            address: document.getElementById('upd-address').value
        };

        try {
            const res = await fetch(API, { method: 'POST', body: JSON.stringify(payload) });
            const result = await res.json();
            if(result.status === "success") {
                alert("Profile Updated Successfully!");
                isEditMode = false;
                showProfile();
            } else {
                alert("Error: " + result.message);
            }
        } catch (e) { 
            alert("Connection error! Please check your internet."); 
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };
}
