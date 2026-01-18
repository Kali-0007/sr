// notices.js - Simplified version without getting stuck in loops
const styles = `
    #notice-board-wrapper { display: flex; justify-content: flex-end; outline: none; }
    .sticky-note { width: 320px; height: 310px; padding: 15px; background: #fff9c4; color: #5d4037; box-shadow: 6px 6px 15px rgba(0,0,0,0.15); transform: rotate(-1.5deg); position: relative; border-bottom-right-radius: 50px 5px; display: flex; flex-direction: column; border: none; outline: none; }
    .note-title { font-weight: 800; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 5px; display: flex; justify-content: space-between; }
    .notice-list { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex-grow: 1; outline: none; }
    .notice-item { font-size: 0.85rem; margin-bottom: 12px; line-height: 1.4; display: flex; gap: 8px; cursor: pointer; transition: color 0.2s ease; outline: none; }
    .new-badge { background: #ff5252; color: white; font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; font-weight: bold; margin-right: 5px; }
    .text-truncate { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
    .notice-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: none; justify-content: center; align-items: center; z-index: 10000; }
    .big-sticky-note { width: 480px; min-height: 320px; background-color: #fdf5e6; padding: 45px; box-shadow: 15px 15px 35px rgba(0,0,0,0.3); transform: rotate(1deg); position: relative; border-bottom-right-radius: 80px 15px; }
    .close-btn { position: absolute; top: 15px; right: 20px; font-size: 28px; cursor: pointer; opacity: 0.4; }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

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
            </div>`;
        document.body.appendChild(modal);
    }
}

function initNoticeBoard() {
    const container = document.getElementById('notice-board-wrapper');
    if (!container) return;

    createNoticeModal();
    
    // Agar payouts.js ko google mil gaya, toh yahan bhi mil jayega
    const partnerId = localStorage.getItem('referralCode') || "GUEST"; 

    google.script.run
        .withSuccessHandler(function(noticesData) {
            console.log("NOTICES RECEIVED:", noticesData);
            if (noticesData && noticesData.length > 0) {
                renderNoticesToUI(noticesData, container);
            } else {
                // Testing ke liye board dikhate hain agar backend khali ho
                renderNoticesToUI([{text: "No new announcements today.", isNew: false}], container);
            }
        })
        .getPartnerNotices(partnerId);
}

function renderNoticesToUI(sortedNotices, container) {
    window.currentNotices = sortedNotices; 
    let listHTML = sortedNotices.map((n, index) => `
        <li class="notice-item" onclick="showFullNotice(${index})">
            <span class="notice-bullet">•</span>
            <div class="text-truncate">
                ${n.isNew ? '<span class="new-badge">NEW</span>' : ''}
                ${n.text}
            </div>
        </li>`).join('');

    container.innerHTML = `
        <div class="sticky-note">
            <div class="note-title"><span>📌 Notices</span></div>
            <ul class="notice-list">${listHTML}</ul>
        </div>`;
}

window.showFullNotice = (idx) => {
    const modal = document.getElementById('noticeModal');
    const modalText = document.getElementById('modalText');
    if(modal && modalText && window.currentNotices) {
        modalText.innerText = window.currentNotices[idx].text;
        modal.style.display = 'flex';
    }
};
