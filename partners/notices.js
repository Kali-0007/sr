/**
 * notices.js - Fixed Version
 * 1. Removed irritating blue/blink lines
 * 2. Increased width by ~1 inch
 * 3. Improved scroll and hover stability
 */

(function() {
    const styles = `
        #notice-board-wrapper { 
            display: flex; 
            justify-content: flex-end; 
            outline: none; /* Kisi bhi tarah ki outline hatane ke liye */
        }

        .sticky-note {
            width: 320px; /* Width increased from 300px to 380px (~1 inch extra) */
            height: 310px; 
            padding: 15px;
            background: #fff9c4; 
            color: #5d4037;
            box-shadow: 6px 6px 15px rgba(0,0,0,0.15);
            transform: rotate(-1.5deg); 
            position: relative;
            border-bottom-right-radius: 50px 5px;
            display: flex; 
            flex-direction: column;
            user-select: none; /* Text selection blue highlight rokne ke liye */
            border: none;
            outline: none;
        }

        /* Tape Effect */
        .sticky-note::before {
            content: ""; position: absolute; top: -12px; left: 40%;
            width: 80px; height: 28px; background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(2px); border: 1px solid rgba(0,0,0,0.05);
        }

        .note-title { 
            font-weight: 800; font-size: 0.85rem; 
            text-transform: uppercase; margin-bottom: 8px; 
            border-bottom: 1px dashed rgba(0,0,0,0.1); 
            padding-bottom: 5px; 
            display: flex; justify-content: space-between; 
        }

        .notice-list {
            list-style: none; padding: 0; margin: 0;
            overflow-y: auto; flex-grow: 1;
            outline: none;
        }
        
        /* Custom Scrollbar for better look */
        .notice-list::-webkit-scrollbar { width: 4px; }
        .notice-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

        .notice-item {
            font-size: 0.85rem; margin-bottom: 12px; line-height: 1.4;
            display: flex; gap: 8px; cursor: pointer; 
            transition: color 0.2s ease; /* Sirf color change hoga, shake nahi */
            outline: none;
            -webkit-tap-highlight-color: transparent; /* Mobile blue tap fix */
        }

        /* Hover par sirf halka sa color change, koi movement ya line nahi */
        .notice-item:hover { color: #000; }
        
        .new-badge {
            background: #ff5252; color: white; font-size: 0.6rem;
            padding: 1px 4px; border-radius: 3px; font-weight: bold;
            margin-right: 5px;
        }

        .text-truncate { 
            display: -webkit-box; -webkit-line-clamp: 2; 
            -webkit-box-orient: vertical; overflow: hidden; flex: 1; 
        }

        /* MODAL POPUP STYLES */
        .notice-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
            display: none; justify-content: center; align-items: center; z-index: 10000;
        }

       
        .big-sticky-note {
            width: 480px; 
            min-height: 320px; 
            background-color: #fdf5e6; 
            background-image: 
                radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0),
                linear-gradient(to bottom, transparent 95%, rgba(0,0,0,0.05) 100%);
            background-size: 20px 20px, 100% 30px;
            padding: 45px; 
            box-shadow: 
                2px 2px 5px rgba(0,0,0,0.1),
                15px 15px 35px rgba(0,0,0,0.3),
                inset 0 0 50px rgba(0,0,0,0.02);
            transform: rotate(1deg); 
            position: relative;
            border: 1px solid rgba(0,0,0,0.05);
            border-bottom-right-radius: 80px 15px;
            animation: popIn 0.3s ease-out;
            outline: none;
        }

        /* --- Ye texture ke liye extra hai, ise niche add kar dein --- */
        .big-sticky-note::after {
            content: "";
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url('https://www.transparenttextures.com/patterns/felt.png');
            opacity: 0.15;
            pointer-events: none;
            border-bottom-right-radius: 80px 15px;
        }

        @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1) rotate(1deg); opacity: 1; } }

        .close-btn { position: absolute; top: 15px; right: 20px; font-size: 28px; cursor: pointer; opacity: 0.4; border:none; outline:none; }
        .close-btn:hover { opacity: 1; color: #ff5252; }
        
        .big-note-content { font-size: 1.15rem; line-height: 1.6; color: #3e2723; margin-top: 15px; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const noticesData = [
        { id: 1, text: "Important: Kal sabhi ke referral payouts process honge. Bank details check karein.", date: "2026-01-18T10:00:00" },
        { id: 2, text: "New Bonus Offer: Refer 10 friends this week and get ₹1000 cashback instantly! 🔥", date: "2026-01-18T12:30:00" },
        { id: 3, text: "Training Video: Naya dashboard kaise use karein? Video 'Kit' section mein live hai.", date: "2026-01-16T09:00:00" }
    ];

    // --- 1. MODAL GENERATOR (Ek hi baar banega) ---
    function createNoticeModal() {
        if(!document.getElementById('noticeModal')) {
            const modal = document.createElement('div');
            modal.id = "noticeModal";
            modal.className = "notice-modal-overlay";
            modal.innerHTML = `
                <div class="big-sticky-note">
                    <span class="close-btn" onclick="document.getElementById('noticeModal').style.display='none'">&times;</span>
                    <div class="note-title" style="font-size: 1.1rem;">📌 Official Announcement</div>
                    <div class="big-note-content" id="modalText"></div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
        }
    }

    // --- 2. INITIALIZE NOTICE BOARD ---
    function initNoticeBoard() {
    const container = document.getElementById('notice-board-wrapper');
    if (!container) return;

    // Check ki kya hum Google environment mein hain
    if (typeof google === 'undefined' || !google.script) {
        console.warn("Google API load nahi hui. Shayad aap ise local chalane ki koshish kar rahe hain?");
        container.style.display = 'none';
        return;
    }

    createNoticeModal();

    const urlParams = new URLSearchParams(window.location.search);
    const partnerId = urlParams.get('id') || "GUEST"; 

    google.script.run
        .withSuccessHandler(function(noticesData) {
            if (noticesData && noticesData.length > 0) {
                renderNoticesToUI(noticesData, container);
            } else {
                container.style.display = 'none';
            }
        })
        .getPartnerNotices(partnerId);
}

    // --- 3. RENDER UI ---
    function renderNoticesToUI(sortedNotices, container) {
        // Click ke liye data ko save karna
        window.currentNotices = sortedNotices; 

        let listHTML = sortedNotices.map((n, index) => {
            return `
                <li class="notice-item" onclick="showFullNotice(${index})">
                    <span class="notice-bullet">•</span>
                    <div class="text-truncate">
                        ${n.isNew ? '<span class="new-badge">NEW</span>' : ''}
                        ${n.text}
                    </div>
                </li>
            `;
        }).join('');

        container.innerHTML = `
            <div class="sticky-note">
                <div class="note-title"><span>📌 Notices</span></div>
                <ul class="notice-list">${listHTML}</ul>
            </div>
        `;
    }

    // --- 4. SHOW FULL NOTICE ---
    window.showFullNotice = (idx) => {
        const modal = document.getElementById('noticeModal');
        const modalText = document.getElementById('modalText');
        if(modal && modalText && window.currentNotices) {
            modalText.innerText = window.currentNotices[idx].text;
            modal.style.display = 'flex';
        }
    };

    // Purana execution trigger hata kar ye likhein:
    setTimeout(function() {
        initNoticeBoard();
    }, 1000); 
})(); // Ye last ka bracket pehle se hoga wahi rehne dein
