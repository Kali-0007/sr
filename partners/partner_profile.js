const API = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";

async function showProfile() {
    const mainArea = document.getElementById('mainContent');
    const token = localStorage.getItem('userToken');

    mainArea.innerHTML = `<div class="glass-card" style="text-align:center; padding:100px 0;"><div class="spinner"></div><p>Loading Your Premium Profile...</p></div>`;

    try {
        const response = await fetch(`${API}?action=check-partner-profile-status&token=${token}`);
        const data = await response.json();

        if (data.status === "success") {
            const p = data.profile;
            const photoUrl = p.photoLink || 'https://via.placeholder.com/150';

            mainArea.innerHTML = `
                <div class="animate-fade-in" style="max-width: 900px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <h1 style="font-size: 24px; color: var(--primary-teal);">Partner Profile Control</h1>
                        <button onclick="location.reload()" class="btn btn-outline" style="border-radius: 50px;">← Dashboard</button>
                    </div>

                    <div class="glass-card" style="padding: 40px; border-top: 4px solid var(--primary-teal);">
                        <form id="updateProfileForm">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <div style="position: relative; display: inline-block;">
                                    <img src="${photoUrl}" id="profile-preview" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-teal); padding: 5px; background: rgba(255,255,255,0.1);">
                                    <label for="photo-upload" style="position: absolute; bottom: 5px; right: 5px; background: var(--primary-teal); color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px;">✎</label>
                                    <input type="file" id="photo-upload" style="display:none" accept="image/*">
                                </div>
                                <h2 style="margin-top: 15px; font-size: 20px;">${p.fullName}</h2>
                                <span style="background: var(--secondary-gold); color: black; padding: 2px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${p.profession || 'PARTNER'}</span>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">FULL NAME</label>
                                    <input type="text" id="upd-name" class="btn btn-outline" style="width:100%; text-align:left; background: rgba(255,255,255,0.05);" value="${p.fullName}">
                                </div>
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">MOBILE NUMBER</label>
                                    <input type="text" id="upd-mobile" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.mobile}">
                                </div>
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">PROFESSION</label>
                                    <select id="upd-profession" class="btn btn-outline" style="width:100%; text-align:left; appearance: auto;">
                                        <option value="${p.profession}">${p.profession || 'Select'}</option>
                                        <option value="CA">Chartered Accountant (CA)</option>
                                        <option value="CS">Company Secretary (CS)</option>
                                        <option value="Tax Consultant">Tax Consultant</option>
                                        <option value="Advocate">Advocate</option>
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">PAN NUMBER</label>
                                    <input type="text" id="upd-pan" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.panNumber}">
                                </div>
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">MEMBERSHIP NUMBER (IF ANY)</label>
                                    <input type="text" id="upd-membership" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.membershipNumber}">
                                </div>
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">BANK NAME</label>
                                    <input type="text" id="upd-bank" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.bankName}">
                                </div>
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">ACCOUNT NUMBER</label>
                                    <input type="text" id="upd-acc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.accountNumber}">
                                </div>
                                <div>
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">IFSC CODE</label>
                                    <input type="text" id="upd-ifsc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.ifscCode}">
                                </div>
                                <div style="grid-column: span 2;">
                                    <label style="font-size: 11px; color: var(--text-gray); letter-spacing: 1px;">OFFICE ADDRESS</label>
                                    <textarea id="upd-address" class="btn btn-outline" style="width:100%; text-align:left; min-height: 80px; padding-top:10px;">${p.address}</textarea>
                                </div>
                            </div>

                            <div style="margin-top: 40px; text-align: center;">
                                <button type="submit" id="saveBtn" class="btn btn-teal" style="padding: 18px 80px; font-weight: bold; font-size: 16px; border-radius: 50px; box-shadow: 0 10px 20px rgba(0, 204, 187, 0.3);">
                                    UPDATE PROFILE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            handleUpdateAction();
        }
    } catch (e) { alert("Session error!"); }
}

function handleUpdateAction() {
    const form = document.getElementById('updateProfileForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('saveBtn');
        btn.innerText = "SAVING CHANGES...";
        btn.disabled = true;

        const payload = {
            action: "update-partner-profile",
            token: localStorage.getItem('userToken'),
            fullName: document.getElementById('upd-name').value,
            mobile: document.getElementById('upd-mobile').value,
            profession: document.getElementById('upd-profession').value,
            panNumber: document.getElementById('upd-pan').value,
            membershipNumber: document.getElementById('upd-membership').value,
            bankName: document.getElementById('upd-bank').value,
            accountNumber: document.getElementById('upd-acc').value,
            ifscCode: document.getElementById('upd-ifsc').value,
            address: document.getElementById('upd-address').value
        };

        try {
            const res = await fetch(API, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.status === "success") {
                alert("Profile Updated Successfully!");
                location.reload();
            } else {
                alert("Error: " + result.message);
            }
        } catch (err) {
            alert("Update failed! Server issues.");
        } finally {
            btn.innerText = "UPDATE PROFILE";
            btn.disabled = false;
        }
    };
}
