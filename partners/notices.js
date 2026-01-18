/**
 * notices.js - Final Professional Version
 * All-in-one: Sorting, New Badge, Scrollbar, and Modal Popup
 */

(function() {
    const styles = `
        #notice-board-wrapper { display: flex; justify-content: flex-end; }

        .sticky-note {
            width: 300px; height: 190px; padding: 15px;
            background: #fff9c4; color: #5d4037;
            box-shadow: 6px 6px 15px rgba(0,0,0,0.15);
            transform: rotate(-1.5deg); position: relative;
            border-bottom-right-radius: 50px 5px;
            display: flex; flex-direction: column;
        }

        .sticky-note::before {
            content: ""; position: absolute; top: -12px; left: 35%;
            width: 80px; height: 28px; background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(2px); border: 1px solid rgba(0,0,0,0.05);
        }

        .note-title { font-weight: 800; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 5px; display: flex; justify-content: space-between; }

        .notice-list {
            list-style: none; padding: 0; margin: 0;
            overflow-y: auto; flex-grow: 1;
        }
        .notice-list::-webkit-scrollbar { width: 4px; }
        .notice-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }

        .notice-item {
            font-size: 0.82rem; margin-bottom: 12px; line-height: 1.3;
            display: flex; gap: 8px; cursor: pointer; transition: 0.2s; position: relative;
        }
        .notice-item:hover { transform: translateX(5px); color: #000; }
        
        .new-badge {
            background: #ff5252; color: white; font-size: 0.6rem;
            padding: 1px 4px; border-radius: 3px; font-weight: bold;
            margin-right: 5px; animation: pulse 1.5s infinite;
        }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

        .text-truncate { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }

        /* MODAL POPUP STYLES */
        .notice-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
            display: none; justify-content: center; align-items: center; z-index: 10000;
        }

        .big-sticky-note {
            width: 450px; min-height: 320px; background: #fff9c4;
            padding: 40px; box-shadow: 25px 25px 50px rgba(0,0,0,0.5);
            transform: rotate(1deg); position: relative;
            border-bottom-right-radius: 70px 15px;
            animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popIn { from { transform: scale(0.8) rotate(-5deg); opacity: 0; } to { transform: scale(1) rotate(1deg); opacity: 1; } }

        .close-btn { position: absolute; top: 15px; right: 20px; font-size: 28px; cursor: pointer; opacity: 0.4; }
        .close-btn:hover { opacity: 1; color: #ff5252; }
        .big-note-content { font-size: 1.15rem; line-height: 1.6; color: #3e2723; margin-top: 15px; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Dummy Data - Backend se aate hi ye array update hoga
    const noticesData = [
        { id: 1, text: "Important: Kal sabhi ke referral payouts process honge. Bank details check karein.", date: "2026-01-18T10:00:00" },
        { id: 2, text: "New Bonus Offer: Refer 10 friends this week and get ₹1000 cashback instantly! 🔥", date: "2026-01-18T12:30:00" },
        { id: 3, text: "Training Video: Naya dashboard kaise use karein? Video 'Kit' section mein live hai.", date: "2026-01-16T09:00:00" },
        { id: 4, text: "Maintenance: Sunday ko server 1 ghante ke liye down rahega.", date: "2026-01-15T15:00:00" }
    ];

    function initNoticeBoard() {
        const container = document.getElementById('notice-board-wrapper');
        if (!container) return;

        // 1. Create Modal Placeholder
        if(!document.getElementById('noticeModal')) {
            const modal = document.createElement('div');
            modal.id = "noticeModal";
            modal.className = "notice-modal-overlay";
            modal.innerHTML = `
                <div class="big-sticky-note">
                    <span class="close-btn" onclick="document.getElementById('noticeModal').style.display='none'">&times;</span>
                    <div class="note-title" style="font-size: 1.1rem; border-color: rgba(0,0,0,0.1);">📌 Official Announcement</div>
                    <div class="big-note-content" id="modalText"></div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
        }

        // 2. Sorting Logic (Latest First)
        const sortedNotices = [...noticesData].sort((a, b) => new Date(b.date) - new Date(a.date));

        // 3. Render Items
        let listHTML = sortedNotices.map((n) => {
            const isNew = (new Date() - new Date(n.date)) < 24 * 60 * 60 * 1000; // Less than 24 hours
            return `
                <li class="notice-item" onclick="showFullNotice('${encodeURIComponent(n.text)}')">
                    <span class="notice-bullet">•</span>
                    <div class="text-truncate">
                        ${isNew ? '<span class="new-badge">NEW</span>' : ''}
                        ${n.text}
                    </div>
                </li>
            `;
        }).join('');

        container.innerHTML = `
            <div class="sticky-note">
                <div class="note-title"><span>📌 Notices</span> <span style="font-size: 0.6rem; opacity: 0.6;">Scroll for more</span></div>
                <ul class="notice-list">${listHTML}</ul>
            </div>
        `;

        window.showFullNotice = (encodedText) => {
            document.getElementById('modalText').innerText = decodeURIComponent(encodedText);
            document.getElementById('noticeModal').style.display = 'flex';
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNoticeBoard);
    } else {
        initNoticeBoard();
    }
})();
