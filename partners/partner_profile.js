const API = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";
let isEditMode = false;

async function showProfile() {
    const mainArea = document.getElementById('mainContent');
    const token = localStorage.getItem('userToken');

    mainArea.innerHTML = `<div class="glass-card" style="text-align:center; padding:100px 0;"><div class="spinner"></div><p>Syncing Professional Profile...</p></div>`;

    try {
        const response = await fetch(`${API}?action=check-partner-profile-status&token=${token}`);
        const data = await response.json();

        if (data.status === "success") {
            renderProfileUI(data.profile);
        } else {
            alert("Error: " + data.message);
        }
    } catch (e) {
        alert("Connection failed!");
    }
}

function renderProfileUI(p) {
    const mainArea = document.getElementById('mainContent');
    const photoUrl = p.photoLink || 'https://via.placeholder.com/150';
    // Purani isApproved wali line ki jagah ye paste karein:
const s = (p.profileStatus || "PENDING").toUpperCase();
let badgeColor = "#ffcc00"; // Default Yellow (Pending)

if (s === "ACTIVE" || s === "APPROVED") {
    badgeColor = "#00ccbb"; // Teal Green
} else if (s === "REJECTED" || s === "BLACKLISTED") {
    badgeColor = "#ff4d4d"; // Red
} else if (s === "UNDER REVIEW") {
    badgeColor = "#00acee"; // Blue
} else if (s === "ON HOLD") {
    badgeColor = "#ff9900"; // Orange
}

// Security: Blacklisted user ko dashboard se bahar phenk do
if (s === "BLACKLISTED") {
    mainArea.innerHTML = `
        <div class="animate-fade-in" style="max-width: 600px; margin: 100px auto; text-align: center;">
            <div class="glass-card" style="padding: 50px; border-top: 5px solid #ff4d4d;">
                <h1 style="font-size: 60px; margin-bottom: 20px;">🚫</h1>
                <h2 style="color: #fff; margin-bottom: 15px;">ACCOUNT TERMINATED</h2>
                <p style="color: var(--text-gray); line-height: 1.6;">Aapka account policy violations ya fraud ki wajah se permanent block kar diya gaya hai.</p>
                <button onclick="localStorage.clear(); location.reload();" class="btn btn-teal" style="margin-top: 30px; background: #ff4d4d; border:none; padding:10px 30px; border-radius:20px; color:white; cursor:pointer;">LOGOUT</button>
            </div>
        </div>`;
    return; 
}
// DOB ko input ke layak banane ke liye formatting
const dobForInput = p.dob ? new Date(p.dob).toISOString().split('T')[0] : "";
const isApproved = (s === "ACTIVE" || s === "APPROVED");
// Iske baad aapka mainArea.innerHTML wala code shuru hoga...
    mainArea.innerHTML = `
        <div class="animate-fade-in" style="max-width: 950px; margin: 0 auto; padding-bottom: 50px;">
            <div class="glass-card" style="padding: 40px; border-top: 5px solid var(--primary-teal);">
                <form id="profileForm">
                    
                    <div style="text-align: center; margin-bottom: 40px;">
    <div style="position: relative; display: inline-block;">
        <img src="${photoUrl}" id="profile-img-preview" 
             style="width: 140px; 
                    height: 140px; 
                    border-radius: 50%; 
                    border: 4px solid var(--primary-teal); 
                    object-fit: cover;         /* Photo ko box ke hisaab se crop karega */
                    object-position: center;    /* Hamesha face center mein rakhega */
                    aspect-ratio: 1 / 1;       /* Circle ko maintain rakhega */
                    display: block;            /* Layout gaps khatam karega */
                    padding: 5px; 
                    background: rgba(255,255,255,0.05);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
        
        ${isEditMode ? `
            <label for="upd-photo" style="position: absolute; bottom: 8px; right: 8px; background: var(--primary-teal); color: white; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s;">
                <span style="font-size: 18px;">✎</span>
            </label>
            <input type="file" id="upd-photo" style="display:none" accept="image/*" onchange="previewImage(this)">
        ` : ''}
    </div>
    <h2 style="margin-top:15px; font-size: 22px; color: #fff;">${p.fullName || 'Partner Name'}</h2>
    </div>
                        
                        <div style="margin-top: 5px;">
                            <span style="background: ${badgeColor}33; color: ${badgeColor}; padding: 4px 15px; border-radius: 20px; font-size: 11px; font-weight: bold; border: 1px solid ${badgeColor}; text-transform: uppercase;">
    ● ${s || 'PENDING'}
</span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px;">
                        
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">FULL NAME</label>
                            <input type="text" id="upd-name" class="btn btn-outline" style="width:100%; text-align:left; background: ${!isEditMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)'};" value="${p.fullName || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                       <div>
    <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">DATE OF BIRTH</label>
    <input type="date" id="upd-dob" class="btn btn-outline" style="width:100%; text-align:left;" value="${dobForInput}" ${!isEditMode ? 'readonly' : ''}>
</div>
<div>
    <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">EMAIL ADDRESS</label>
    <input type="text" class="btn btn-outline" 
           style="width:100%; text-align:left; background: rgba(255,255,255,0.02); color: var(--text-dim);" 
           value="${p.email || localStorage.getItem('userEmail') || ''}" readonly>
    <small style="font-size: 9px; color: #666;">* Email cannot be changed</small>
</div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">MOBILE NUMBER</label>
                            <input type="text" id="upd-mobile" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.mobile || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
    <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">PROFESSION</label>
    ${!isEditMode ? 
        `<input type="text" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.profession || ''}" readonly>` :
        `<select id="upd-profession" class="btn btn-outline" 
            style="width:100%; text-align:left; appearance:auto; background-color: #1a1a1a !important; color: #ffffff !important;" 
            onchange="handleProfessionLogic(this.value)">
            <option value="Tax Consultant" ${p.profession === 'Tax Consultant' ? 'selected' : ''}>Tax Consultant</option>
            <option value="CA" ${p.profession === 'CA' ? 'selected' : ''}>Chartered Accountant (CA)</option>
            <option value="CS" ${p.profession === 'CS' ? 'selected' : ''}>Company Secretary (CS)</option>
            <option value="Advocate" ${p.profession === 'Advocate' ? 'selected' : ''}>Advocate</option>
            <option value="Accountant" ${p.profession === 'Accountant' ? 'selected' : ''}>Accountant</option>
            <option value="Other" ${p.profession === 'Other' ? 'selected' : ''}>Other (Please Specify)</option>
        </select>`
    }
</div>

<div id="other-profession-box" style="display: ${p.profession === 'Other' ? 'block' : 'none'}; grid-column: span 1;">
    <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">PLEASE SPECIFY PROFESSION</label>
    <input type="text" id="upd-other-spec" class="btn btn-outline" 
        style="width:100%; text-align:left;" 
        value="${p.otherProfession || ''}" ${!isEditMode ? 'readonly' : ''} placeholder="Mention your profession">
</div>

                        <div id="membership-box" style="display: ${(p.profession === 'CA' || p.profession === 'CS') ? 'block' : 'none'};">
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">MEMBERSHIP NUMBER</label>
                            <input type="text" id="upd-membership" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.membershipNumber || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div style="grid-column: ${(p.profession === 'CA' || p.profession === 'CS') ? 'span 1' : 'span 1'};">
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">PAN CARD NUMBER</label>
                            <input type="text" id="upd-pan" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.panNumber || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">BANK NAME</label>
                            <input type="text" id="upd-bank" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.bankName || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">ACCOUNT NUMBER</label>
                            <input type="text" id="upd-acc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.accountNumber || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div>
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">IFSC CODE</label>
                            <input type="text" id="upd-ifsc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.ifscCode || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>
                       

<div style="grid-column: span 2; margin-top: 10px;">
    <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">UPLOAD PAN CARD (JPG/PDF) *</label>
    <div style="display: flex; align-items: center; gap: 15px; margin-top: 5px;">
        ${isEditMode ? 
            `<input type="file" id="upd-pan-file" accept=".jpg,.jpeg,.png,.pdf" style="color: white; font-size: 12px;">` : 
            `<div class="btn btn-outline" style="width:100%; text-align:left; background: rgba(0,204,187,0.05); color: var(--primary-teal); border-style: dashed;">
                ${p.panDocLink ? `✅ <a href="${p.panDocLink}" target="_blank" style="color:var(--primary-teal); text-decoration:none;">View Uploaded PAN</a>` : '❌ PAN Card Missing'}
             </div>`
        }
    </div>
</div>
                        <div>
    <label style="font-size: 11px; color: var(--secondary-gold); font-weight: 600;">REFERRAL CODE</label>
    <input type="text" class="btn btn-outline" 
           style="width:100%; text-align:left; border: 1px dashed var(--secondary-gold); color: var(--secondary-gold); font-weight: bold;" 
           value="${(s === 'ACTIVE' || s === 'APPROVED') ? (p.referralCode || 'NOT ASSIGNED') : 'Unlock After Admin Approval'}" 
           readonly>
</div>

                        <div style="grid-column: span 2;">
                            <label style="font-size: 11px; color: var(--text-gray); font-weight: 600;">OFFICE / RESIDENTIAL ADDRESS</label>
                            <textarea id="upd-address" class="btn btn-outline" style="width:100%; text-align:left; min-height: 80px; padding-top: 12px; line-height: 1.5;" ${!isEditMode ? 'readonly' : ''}>${p.address || ''}</textarea>
                        </div>
                    </div>

                    <div style="margin-top: 50px; display: flex; gap: 20px; justify-content: center;">
                        ${!isEditMode ? `
                            <button type="button" onclick="toggleEdit(true)" class="btn btn-teal" style="padding: 16px 70px; font-weight: bold; border-radius: 50px;">✎ EDIT PROFILE</button>
                            <button type="button" onclick="location.reload()" class="btn btn-outline" style="padding: 16px 40px; border-radius: 50px;">CLOSE</button>
                        ` : `
                            <button type="submit" class="btn btn-teal" style="padding: 16px 70px; font-weight: bold; border-radius: 50px; box-shadow: 0 5px 15px rgba(0,204,187,0.4);">SAVE CHANGES</button>
                            <button type="button" onclick="toggleEdit(false)" class="btn btn-outline" style="padding: 16px 40px; color: #ff4d4d; border-radius: 50px;">CANCEL</button>
                        `}
                    </div>
                </form>
            </div>
        </div>
    `;

    if(isEditMode) attachSubmit();
}

// HELPER FUNCTIONS
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profile-img-preview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function toggleEdit(mode) {
    isEditMode = mode;
    showProfile(); 
}

function checkProfession(val) {
    const box = document.getElementById('membership-box');
    box.style.display = (val === 'CA' || val === 'CS') ? 'block' : 'none';
}

async function showProfile() {
    const mainArea = document.getElementById('mainContent');
    const token = localStorage.getItem('userToken');

    mainArea.innerHTML = `<div class="glass-card" style="text-align:center; padding:100px 0;"><div class="spinner"></div><p>Syncing Professional Profile...</p></div>`;

    try {
        const response = await fetch(`${API}?action=check-partner-profile-status&token=${token}`);
        const data = await response.json();

        if (data.status === "success") {
            renderProfileUI(data.profile);
        } else {
            alert("Error: " + data.message);
        }
    } catch (e) {
        alert("Connection failed!");
    }
}

function renderProfileUI(p) {
    const mainArea = document.getElementById('mainContent');
    const photoUrl = p.photoLink || 'https://via.placeholder.com/150';
    const s = (p.profileStatus || "PENDING").toUpperCase();
    
    let badgeColor = "#ffcc00";
    if (s === "ACTIVE" || s === "APPROVED") badgeColor = "#00ccbb";
    else if (s === "REJECTED" || s === "BLACKLISTED") badgeColor = "#ff4d4d";
    else if (s === "UNDER REVIEW") badgeColor = "#00acee";

    if (s === "BLACKLISTED") {
        mainArea.innerHTML = `<div class="glass-card" style="padding:50px; text-align:center; margin-top:100px;"><h1>🚫</h1><h2>ACCOUNT TERMINATED</h2><button onclick="localStorage.clear(); location.reload();" class="btn btn-teal">LOGOUT</button></div>`;
        return; 
    }

    const dobForInput = p.dob ? new Date(p.dob).toISOString().split('T')[0] : "";

    mainArea.innerHTML = `
        <div class="animate-fade-in" style="max-width: 950px; margin: 0 auto; padding-bottom: 50px;">
            <div class="glass-card" style="padding: 40px; border-top: 5px solid var(--primary-teal);">
                <form id="profileForm">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <div style="position: relative; display: inline-block;">
                            <img src="${photoUrl}" id="profile-img-preview" 
                                 style="width: 140px; height: 140px; border-radius: 50%; border: 4px solid var(--primary-teal); object-fit: cover; object-position: center; aspect-ratio: 1/1; display: block; padding: 5px; background: rgba(255,255,255,0.05);">
                            ${isEditMode ? `<label for="upd-photo" style="position: absolute; bottom: 8px; right: 8px; background: var(--primary-teal); color: white; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; border: 2px solid #fff;"><span>✎</span></label><input type="file" id="upd-photo" style="display:none" accept="image/*" onchange="previewImage(this)">` : ''}
                        </div>
                        <h2 style="margin-top:15px; font-size: 22px; color: #fff;">${p.fullName || 'Partner Name'}</h2>
                        <div style="margin-top: 5px;">
                            <span style="background: ${badgeColor}33; color: ${badgeColor}; padding: 4px 15px; border-radius: 20px; font-size: 11px; font-weight: bold; border: 1px solid ${badgeColor};">● ${s}</span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px;">
                        <div><label>FULL NAME</label><input type="text" id="upd-name" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.fullName || ''}" ${!isEditMode ? 'readonly' : ''}></div>
                        <div><label>DATE OF BIRTH</label><input type="date" id="upd-dob" class="btn btn-outline" style="width:100%; text-align:left;" value="${dobForInput}" ${!isEditMode ? 'readonly' : ''}></div>
                        <div><label>EMAIL ADDRESS</label><input type="text" class="btn btn-outline" style="width:100%; text-align:left; background: rgba(255,255,255,0.02);" value="${p.email || localStorage.getItem('userEmail') || ''}" readonly></div>
                        <div><label>MOBILE NUMBER</label><input type="text" id="upd-mobile" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.mobile || ''}" ${!isEditMode ? 'readonly' : ''}></div>
                        
                        <div><label>PROFESSION</label>
                            ${!isEditMode ? `<input type="text" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.profession || ''}" readonly>` : 
                            `<select id="upd-profession" class="btn btn-outline" style="width:100%; text-align:left;" onchange="handleProfessionLogic(this.value)">
                                <option value="Tax Consultant" ${p.profession === 'Tax Consultant' ? 'selected' : ''}>Tax Consultant</option>
                                <option value="CA" ${p.profession === 'CA' ? 'selected' : ''}>Chartered Accountant (CA)</option>
                                <option value="CS" ${p.profession === 'CS' ? 'selected' : ''}>Company Secretary (CS)</option>
                                <option value="Advocate" ${p.profession === 'Advocate' ? 'selected' : ''}>Advocate</option>
                                <option value="Other" ${p.profession === 'Other' ? 'selected' : ''}>Other</option>
                            </select>`}
                        </div>

                        <div id="other-profession-box" style="display: ${p.profession === 'Other' ? 'block' : 'none'};">
                            <label>SPECIFY PROFESSION</label>
                            <input type="text" id="upd-other-spec" class="btn btn-outline" style="width:100%;" value="${p.otherProfession || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div id="membership-box" style="display: ${(p.profession === 'CA' || p.profession === 'CS') ? 'block' : 'none'};">
                            <label>MEMBERSHIP NO.</label>
                            <input type="text" id="upd-membership" class="btn btn-outline" style="width:100%;" value="${p.membershipNumber || ''}" ${!isEditMode ? 'readonly' : ''}>
                        </div>

                        <div><label>PAN NUMBER</label><input type="text" id="upd-pan" class="btn btn-outline" style="width:100%;" value="${p.panNumber || ''}" ${!isEditMode ? 'readonly' : ''}></div>
                        <div><label>BANK NAME</label><input type="text" id="upd-bank" class="btn btn-outline" style="width:100%;" value="${p.bankName || ''}" ${!isEditMode ? 'readonly' : ''}></div>
                        <div><label>ACCOUNT NUMBER</label><input type="text" id="upd-acc" class="btn btn-outline" style="width:100%;" value="${p.accountNumber || ''}" ${!isEditMode ? 'readonly' : ''}></div>
                        <div><label>IFSC CODE</label><input type="text" id="upd-ifsc" class="btn btn-outline" style="width:100%;" value="${p.ifscCode || ''}" ${!isEditMode ? 'readonly' : ''}></div>

                        <div style="grid-column: span 2;">
                            <label>PAN CARD (JPG/PDF)</label>
                            <div style="margin-top:5px;">
                                ${isEditMode ? `<input type="file" id="upd-pan-file" accept=".jpg,.jpeg,.png,.pdf">` : 
                                `<div class="btn btn-outline" style="text-align:left; border-style:dashed;">${p.panDocLink ? `✅ <a href="${p.panDocLink}" target="_blank" style="color:var(--primary-teal);">View PAN</a>` : '❌ Missing'}</div>`}
                            </div>
                        </div>

                        <div><label style="color:var(--secondary-gold);">REFERRAL CODE</label>
                            <input type="text" class="btn btn-outline" style="width:100%; color:var(--secondary-gold); border:1px dashed var(--secondary-gold);" value="${(s === 'ACTIVE' || s === 'APPROVED') ? (p.referralCode || 'NOT ASSIGNED') : 'Locked until Approval'}" readonly>
                        </div>

                        <div style="grid-column: span 2;"><label>ADDRESS</label><textarea id="upd-address" class="btn btn-outline" style="width:100%; min-height:80px;" ${!isEditMode ? 'readonly' : ''}>${p.address || ''}</textarea></div>
                    </div>

                    <div style="margin-top: 40px; display: flex; gap: 20px; justify-content: center;">
                        ${!isEditMode ? `<button type="button" onclick="toggleEdit(true)" class="btn btn-teal" style="padding:16px 60px;">✎ EDIT PROFILE</button>` : 
                        `<button type="submit" class="btn btn-teal" style="padding:16px 60px;">SAVE CHANGES</button><button type="button" onclick="toggleEdit(false)" class="btn btn-outline" style="color:#ff4d4d;">CANCEL</button>`}
                    </div>
                </form>
            </div>
        </div>
    `;

    if(isEditMode) {
        setTimeout(attachSubmit, 200); 
    }
}

async function attachSubmit() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "SAVING..."; 
        btn.disabled = true;

        try {
            const photoFile = document.getElementById('upd-photo')?.files[0];
            let photoBase64 = null;
            if (photoFile) {
                photoBase64 = await new Promise(r => { const reader = new FileReader(); reader.onload = () => r(reader.result.split(',')[1]); reader.readAsDataURL(photoFile); });
            }

            const panFile = document.getElementById('upd-pan-file')?.files[0];
            let panBase64 = null; let panMimeType = null;
            if (panFile) {
                panMimeType = panFile.type;
                panBase64 = await new Promise(r => { const reader = new FileReader(); reader.onload = () => r(reader.result.split(',')[1]); reader.readAsDataURL(panFile); });
            }

            const payload = {
                action: "update-partner-profile",
                token: localStorage.getItem('userToken'),
                fullName: document.getElementById('upd-name').value,
                dob: document.getElementById('upd-dob').value,
                mobile: document.getElementById('upd-mobile').value,
                profession: document.getElementById('upd-profession').value,
                otherProfession: document.getElementById('upd-other-spec')?.value || "",
                membershipNumber: document.getElementById('upd-membership')?.value || "",
                panNumber: document.getElementById('upd-pan').value,
                bankName: document.getElementById('upd-bank').value,
                accountNumber: document.getElementById('upd-acc').value,
                ifscCode: document.getElementById('upd-ifsc').value,
                address: document.getElementById('upd-address').value,
                panBlob: panBase64, 
                panName: panFile ? panFile.name : null, 
                panMime: panMimeType,
                photoBlob: photoBase64, 
                photoName: photoFile ? photoFile.name : null,
                resolution: window.screen.width + "x" + window.screen.height
            };

            const res = await fetch(API, { method: 'POST', body: JSON.stringify(payload) });
            const result = await res.json();
            
            if(result.status === "success") {
                alert("Profile Updated Successfully!");
                isEditMode = false;
                showProfile(); 
            } else { alert("Error: " + result.message); }
        } catch (e) { alert("Network Error!"); } 
        finally { btn.innerText = originalText; btn.disabled = false; }
    };
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => { document.getElementById('profile-img-preview').src = e.target.result; };
        reader.readAsDataURL(input.files[0]);
    }
}

function toggleEdit(mode) { isEditMode = mode; showProfile(); }

function handleProfessionLogic(val) {
    // 1. Membership box handle karein
    const membershipBox = document.getElementById('membership-box');
    if (membershipBox) {
        membershipBox.style.display = (val === 'CA' || val === 'CS') ? 'block' : 'none';
    }

    // 2. Other Specify box handle karein
    const otherBox = document.getElementById('other-profession-box');
    if (otherBox) {
        otherBox.style.display = (val === 'Other') ? 'block' : 'none';
    }
}
