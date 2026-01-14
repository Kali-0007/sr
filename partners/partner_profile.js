const API = "https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec";

async function showProfile() {
    const mainArea = document.getElementById('mainContent');
    if (!mainArea) return;

    mainArea.innerHTML = `
        <div class="glass-card" style="text-align:center; padding:100px 20px;">
            <h2 style="color:var(--primary-teal);">Fetching Your Data...</h2>
            <p style="color:var(--text-gray);">Connecting to secure vault...</p>
        </div>`;

    const token = localStorage.getItem('userToken');

    try {
        // Sabse stable tarika: URL parameters ke saath bhejenge
        const fetchUrl = `${API}?action=check-partner-profile-status&token=${token}`;
        
        // Hum simple GET request use karenge kyunki Google Script GET par parameters turant utha leta hai
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (data.status === "success") {
            const p = data.profile;
            renderProfileUI(p);
        } else {
            mainArea.innerHTML = `<div class="glass-card" style="text-align:center; padding:50px;">
                <h3 style="color:var(--danger-red);">Error: ${data.message}</h3>
                <button onclick="location.reload()" class="btn btn-outline">Try Again</button>
            </div>`;
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        mainArea.innerHTML = `<div class="glass-card" style="text-align:center; padding:50px;">
            <h3 style="color:var(--danger-red);">Server Connection Failed</h3>
            <p>Please check your internet or script deployment.</p>
        </div>`;
    }
}

// UI render karne ka alag function taaki code saaf rahe
function renderProfileUI(p) {
    const mainArea = document.getElementById('mainContent');
    mainArea.innerHTML = `
        <section class="hero animate-fade-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h1 style="font-size: 28px;">Professional Profile</h1>
                <button onclick="location.reload()" class="btn btn-outline">← Dashboard</button>
            </div>

            <div class="glass-card">
                <form id="dynamicProfileForm">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div>
                            <label style="font-size:12px; color:var(--text-gray);">FULL NAME</label>
                            <input type="text" id="edit-name" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.fullName || ''}">
                        </div>
                        <div>
                            <label style="font-size:12px; color:var(--text-gray);">MOBILE</label>
                            <input type="text" id="edit-mobile" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.mobile || ''}">
                        </div>
                        <div>
                            <label style="font-size:12px; color:var(--text-gray);">PROFESSION</label>
                            <input type="text" id="edit-profession" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.profession || ''}" readonly>
                        </div>
                        <div>
                            <label style="font-size:12px; color:var(--text-gray);">PAN NUMBER</label>
                            <input type="text" id="edit-pan" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.panNumber || ''}">
                        </div>
                         <div>
                            <label style="font-size:12px; color:var(--text-gray);">BANK NAME</label>
                            <input type="text" id="edit-bank" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.bankName || ''}">
                        </div>
                        <div>
                            <label style="font-size:12px; color:var(--text-gray);">IFSC CODE</label>
                            <input type="text" id="edit-ifsc" class="btn btn-outline" style="width:100%; text-align:left;" value="${p.ifscCode || ''}">
                        </div>
                    </div>
                    <div style="margin-top:30px; text-align:center;">
                        <button type="button" onclick="alert('Update logic coming next!')" class="btn btn-teal" style="padding:15px 60px;">SAVE PROFILE</button>
                    </div>
                </form>
            </div>
        </section>
    `;
}
