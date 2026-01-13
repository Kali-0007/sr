const API = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";

async function showProfile() {
    const mainArea = document.getElementById('mainContent'); 
    if(!mainArea) return console.error("Element #mainContent not found!");

    mainArea.innerHTML = `
        <div style="text-align:center; padding:50px;">
            <h2 style="color:var(--accent);">Fetching Complete Profile...</h2>
            <p style="color:var(--text-muted);">Connecting to secure database</p>
        </div>`;

    const token = localStorage.getItem('userToken');

    try {
        const response = await fetch(`${API}?action=get-partner-profile&token=${token}`);
        const data = await response.json();

        if (data.status === "success") {
            const p = data.profile;

            mainArea.innerHTML = `
                <div class="glass-card" style="padding: 30px; background: rgba(255,255,255,0.05); border-radius: 20px; border: 1px solid var(--glass-border); animation: fadeIn 0.5s;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <div>
                            <h2 style="color: var(--accent); margin:0;">Partner Professional Profile</h2>
                            <p style="color:var(--text-muted); font-size:12px; margin:5px 0 0 0;">Manage your identity and payout settings</p>
                        </div>
                        <button onclick="location.reload()" class="btn btn-outline" style="padding:8px 15px;">✕ Close</button>
                    </div>

                    <form id="dynamicProfileForm">
                        <div style="color:var(--gold); font-size:12px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:20px; letter-spacing:1px;">PERSONAL & IDENTITY</div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom:30px;">
                            <div><label>Partner ID</label><input type="text" class="form-control" value="${p.Partner_ID || ''}" disabled style="background:rgba(0,0,0,0.2)"></div>
                            <div><label>Full Name</label><input type="text" class="form-control" id="edit-name" value="${p.Name || ''}"></div>
                            <div><label>Mobile Number</label><input type="text" class="form-control" id="edit-mobile" value="${p.Mobile || ''}"></div>
                            <div><label>Email Address</label><input type="email" class="form-control" value="${p.Email || ''}" disabled></div>
                            <div><label>Date of Birth</label><input type="date" class="form-control" id="edit-dob" value="${p.DOB ? p.DOB.split('T')[0] : ''}"></div>
                            <div><label>Profession</label>
                                <select id="edit-profession" class="form-control">
                                    <option value="${p.Profession || ''}">${p.Profession || 'Select Profession'}</option>
                                    <option value="Chartered Accountant (CA)">Chartered Accountant (CA)</option>
                                    <option value="Company Secretary (CS)">Company Secretary (CS)</option>
                                    <option value="Tax Consultant">Tax Consultant</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div style="color:var(--gold); font-size:12px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:20px; letter-spacing:1px;">OFFICE & VERIFICATION</div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom:30px;">
                            <div><label>PAN Number</label><input type="text" class="form-control" id="edit-pan" value="${p.PAN_Number || ''}" style="text-transform:uppercase" maxlength="10"></div>
                            <div><label>Membership Number (If CA/CS)</label><input type="text" class="form-control" id="edit-membership" value="${p.Membership_Number || ''}"></div>
                            <div><label>Office Address</label><input type="text" class="form-control" id="edit-address" value="${p.Address || ''}"></div>
                            <div><label>Profile Status</label><input type="text" class="form-control" value="${p.Profile_Status || 'Under Review'}" disabled style="color:var(--accent)"></div>
                            <div><label>My Referral Code</label><input type="text" class="form-control" value="${p.Referral_Code || ''}" disabled style="font-weight:bold; color:var(--gold)"></div>
                        </div>

                        <div style="color:var(--gold); font-size:12px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:20px; letter-spacing:1px;">BANKING (FOR PAYOUTS)</div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom:30px;">
                            <div><label>Bank Name</label><input type="text" class="form-control" id="edit-bank" value="${p.Bank_Name || ''}"></div>
                            <div><label>Account Number</label><input type="text" class="form-control" id="edit-account" value="${p.Account_Number || ''}"></div>
                            <div><label>IFSC Code</label><input type="text" class="form-control" id="edit-ifsc" value="${p.IFSC_Code || ''}" style="text-transform:uppercase"></div>
                        </div>

                        <div style="background:rgba(0,242,254,0.05); padding:20px; border-radius:12px; display:grid; grid-template-columns: repeat(3, 1fr); text-align:center; border:1px solid rgba(0,242,254,0.1);">
                            <div><span style="display:block; font-size:11px; color:var(--text-muted);">TOTAL EARNINGS</span><b style="font-size:18px; color:var(--accent);">₹${p.Total_Earnings || '0'}</b></div>
                            <div><span style="display:block; font-size:11px; color:var(--text-muted);">COMMISSION RATE</span><b style="font-size:18px; color:var(--gold);">${p.Commission_Rate || '0'}%</b></div>
                            <div><span style="display:block; font-size:11px; color:var(--text-muted);">LAST LOGIN</span><small style="font-size:12px;">${p.Last_Login || 'First Time'}</small></div>
                        </div>

                        <div style="text-align: center; margin-top: 40px;">
                            <button type="submit" class="btn btn-primary" style="padding: 15px 60px; font-weight:bold; letter-spacing:1px;">UPDATE ALL PROFILE RECORDS</button>
                        </div>
                    </form>
                </div>
            `;

            attachUpdateLogic();
        }
    } catch (err) {
        console.error(err);
        mainArea.innerHTML = `<div style="color:#ff4d4d; text-align:center; padding:50px;"><h2>Connection Error</h2><p>Could not resolve API address. Please check your internet or script URL.</p></div>`;
    }
}

function attachUpdateLogic() {
    const form = document.getElementById('dynamicProfileForm');
    if(!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "SAVING DATA...";
        submitBtn.disabled = true;

        const payload = {
            action: "update-partner-profile",
            token: localStorage.getItem('userToken'),
            Name: document.getElementById('edit-name').value,
            Mobile: document.getElementById('edit-mobile').value,
            DOB: document.getElementById('edit-dob').value,
            Profession: document.getElementById('edit-profession').value,
            PAN_Number: document.getElementById('edit-pan').value,
            Membership_Number: document.getElementById('edit-membership').value,
            Address: document.getElementById('edit-address').value,
            Bank_Name: document.getElementById('edit-bank').value,
            Account_Number: document.getElementById('edit-account').value,
            IFSC_Code: document.getElementById('edit-ifsc').value
        };

        try {
            const res = await fetch(API, { method: 'POST', body: JSON.stringify(payload) });
            const result = await res.json();
            
            if (result.status === "success") {
                alert("✅ Success: Profile updated in Sheet!");
                showProfile(); // Reload dynamic content
            } else {
                alert("❌ Error: " + result.message);
            }
        } catch (err) {
            alert("❌ Network Error: Could not reach the server.");
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    };
}
