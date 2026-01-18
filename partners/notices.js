/**
 * notices.js - All-in-one Sticky Note Notice Board
 * Handles: Styling, Data fetching, and Rendering
 */

(function() {
    // 1. STYLES (CSS-in-JS) - Ise hum dynamic inject kar rahe hain
    const styles = `
        #notice-board-wrapper {
            display: flex;
            gap: 20px;
            padding: 10px;
            overflow-x: auto;
            max-width: 100%;
            margin-top: 10px;
        }

        .sticky-note {
            width: 180px;
            height: 180px;
            padding: 15px;
            position: relative;
            font-family: 'Permanent Marker', cursive, sans-serif; /* Rough look ke liye */
            box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .sticky-note:hover {
            transform: scale(1.05) rotate(0deg) !important;
            z-index: 10;
        }

        /* Tape Effect */
        .sticky-note::before {
            content: "";
            position: absolute;
            top: -10px;
            left: 30%;
            width: 70px;
            height: 25px;
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .note-yellow { background: #fff9c4; color: #5d4037; transform: rotate(-2deg); }
        .note-blue   { background: #e0f7fa; color: #006064; transform: rotate(1.5deg); }
        .note-green  { background: #f1f8e9; color: #33691e; transform: rotate(-1deg); }

        .note-title { font-weight: bold; font-size: 0.9rem; margin-bottom: 5px; text-decoration: underline; }
        .note-text { font-size: 0.8rem; line-height: 1.3; }
        .note-date { font-size: 0.65rem; text-align: right; opacity: 0.7; }
    `;

    // CSS ko head mein inject karna
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. DATA (Abhi static hai, baad mein backend se replace hoga)
    const dummyNotices = [
        { title: "Payout Alert", text: "Kal sabhi ke referral commissions transfer ho jayenge. Check your bank! 💰", color: "yellow", date: "18 Jan" },
        { title: "New Bonus", text: "5 Referrals = ₹500 Extra. Valid till Sunday only. 🔥", color: "blue", date: "17 Jan" },
        { title: "Training", text: "Naya Marketing Kit Drive folder mein upload kar diya gaya hai. 📂", color: "green", date: "15 Jan" }
    ];

    // 3. RENDER LOGIC
    function initNoticeBoard() {
        const container = document.getElementById('notice-board-wrapper');
        if (!container) return;

        container.innerHTML = dummyNotices.map(notice => `
            <div class="sticky-note note-${notice.color}">
                <div>
                    <div class="note-title">${notice.title}</div>
                    <div class="note-text">${notice.text}</div>
                </div>
                <div class="note-date">${notice.date}</div>
            </div>
        `).join('');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNoticeBoard);
    } else {
        initNoticeBoard();
    }
})();
