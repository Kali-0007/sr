const API = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";

async function showProfile() {
    const mainArea = document.getElementById('mainContent'); 
    if(!mainArea) {
        alert("Error: id='mainContent' not found!");
        return;
    }

    // Loading State
    mainArea.innerHTML = `
        <div class="glass-card" style="text-align:center; padding:100px 20px;">
            <h2 style="color:var(--primary-teal);">Fetching Your Data...</h2>
            <p style="color:var(--text-gray);">Please wait while we connect to the secure server.</p>
        </div>`;

    const token = localStorage.getItem('userToken');

    try {
        // Aapka backend POST mangta hai token check karne ke liye
        const response = await fetch(API, {
            method: 'POST',
            body: JSON.stringify({
                action: "get-partner-profile", 
                token: token
            })
        });
        const data = await response.json();

        if (data.status === "success") {
            // BACKEND SE MATCHING KEYS: p.fullName, p.mobile, etc.
            const p = data.profile;

            mainArea.innerHTML = `
                <section class="hero animate-fade-in">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="font-size: 28px;">Partner Profile</h1>
                        <button onclick="location.reload()" class="btn btn-outline">← Back to Dashboard</button>
                    </div>

                    <div class="glass-card">
                        <form id="dynamicProfileForm">
                            <div style="color:var(--secondary-gold); font-size:12px; font-weight:700; margin-bottom:20px; text-transform:uppercase;">Account Information</div>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">FULL NAME</label>
                                    <input type="text" id="edit-name" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.fullName || ''}">
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">MOBILE</label>
                                    <input type="text" id="edit-mobile" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.mobile || ''}">
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">PROFESSION</label>
                                    <select id="edit-profession" class="btn btn-outline" style="width:100%; text-align:left; appearance: auto;">
                                        <option value="${p.profession || ''}">${p.profession || 'Select'}</option>
                                        <option value="CA">Chartered Accountant</option>
                                        <option value="CS">Company Secretary</option>
                                        <option value="Tax Consultant">Tax Consultant</option>
                                    </select>
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">PAN NUMBER</label>
                                    <input type="text" id="edit-pan" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.panNumber || ''}">
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">MEMBERSHIP NO (CA/CS)</label>
                                    <input type="text" id="edit-membership" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.membershipNumber || ''}">
                                </div>
                                <div style="grid-column: span 1;">
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">OFFICE ADDRESS</label>
                                    <input type="text" id="edit-address" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.address || ''}">
                                </div>
                            </div>

                            <div style="color:var(--secondary-gold); font-size:12px; font-weight:700; margin:40px 0 20px 0; text-transform:uppercase;">Bank Details (Payouts)</div>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">BANK NAME</label>
                                    <input type="text" id="edit-bank" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.bankName || ''}">
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">ACCOUNT NUMBER</label>
                                    <input type="text" id="edit-account" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.accountNumber || ''}">
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-gray); margin-bottom:8px;">IFSC CODE</label>
                                    <input type="text" id="edit-ifsc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.ifscCode || ''}">
                                </div>
                            </div>

                            <div style="margin-top:40px; text-align:center;">
                                <button type="submit" class="btn btn-teal" style="padding:15px 50px;">Save Profile Updates</button>
                            </div>
                        </form>
                    </div>
                </section>
            `;

            attachUpdateLogic();
        } else {
             mainArea.innerHTML = `<div class="glass-card" style="color:var(--danger-red); text-align:center;">Error: ${data.message}</div>`;
        }
    } catch (err) {
        mainArea.innerHTML = `<div class="glass-card" style="color:var(--danger-red); text-align:center;">Server unreachable. Check internet.</div>`;
    }
}

function attachUpdateLogic() {
    document.getElementById('dynamicProfileForm').onsubmit = async (e) => {
        e.preventDefault();
        const saveBtn = e.target.querySelector('button[type="submit"]');
        saveBtn.innerText = "UPDATING...";

        // In keys ko bilkul aise hi rehne dena kyunki backend yehi expect kar raha hai
        const payload = {
            action: "update-partner-profile",
            token: localStorage.getItem('userToken'),
            fullName: document.getElementById('edit-name').value,
            mobile: document.getElementById('edit-mobile').value,
            profession: document.getElementById('edit-profession').value,
            panNumber: document.getElementById('edit-pan').value,
            membershipNumber: document.getElementById('edit-membership').value,
            address: document.getElementById('edit-address').value,
            bankName: document.getElementById('edit-bank').value,
            accountNumber: document.getElementById('edit-account').value,
            ifscCode: document.getElementById('edit-ifsc').value
        };

        try {
            const res = await fetch(API, { method: 'POST', body: JSON.stringify(payload) });
            const result = await res.json();
            if (result.status === "success") {
                alert("Profile Updated Successfully!");
                location.reload(); 
            }
        } catch (err) {
            alert("Update failed!");
        } finally {
            saveBtn.innerText = "Save Profile Updates";
        }
    };
}
