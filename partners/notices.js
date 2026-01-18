/**
 * notices.js - Single Sticky Note with Bullets
 */

(function() {
    const styles = `
        #notice-board-wrapper {
            display: flex;
            justify-content: flex-end;
            padding-right: 20px;
        }

        .sticky-note {
            width: 260px;
            min-height: 160px;
            padding: 15px;
            background: #fff9c4; /* Classic Yellow */
            color: #5d4037;
            box-shadow: 5px 5px 12px rgba(0,0,0,0.15);
            transform: rotate(-1.5deg);
            position: relative;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border-bottom-right-radius: 40px 5px; /* Subtle paper fold */
        }

        /* Tape Effect */
        .sticky-note::before {
            content: "";
            position: absolute;
            top: -12px;
            left: 35%;
            width: 80px;
            height: 28px;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(2px);
            border: 1px solid rgba(0,0,0,0.05);
        }

        .note-title { 
            font-weight: 800; 
            font-size: 0.85rem; 
            text-transform: uppercase;
            margin-bottom: 10px;
            border-bottom: 1px dashed rgba(0,0,0,0.1);
            padding-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .notice-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .notice-item {
            font-size: 0.8rem;
            margin-bottom: 8px;
            line-height: 1.3;
            display: flex;
            align-items: flex-start;
            gap: 6px;
        }

        .notice-bullet { color: #d4af37; font-weight: bold; }

        /* 2-Line Truncation Logic */
        .text-truncate {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }

        .read-more {
            color: #007bff;
            font-size: 0.7rem;
            cursor: pointer;
            font-weight: bold;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Ye data backend se aayega
    const noticesData = [
        { text: "Kal sabhi ke referral commissions transfer ho jayenge. Check bank account properly." },
        { text: "Refer 50 new clients and win a special Goa Trip package for 2 people." },
        { text: "New marketing posters are now available in the kit section." }
    ];

    function initNoticeBoard() {
        const container = document.getElementById('notice-board-wrapper');
        if (!container) return;

        let listHTML = noticesData.map(n => `
            <li class="notice-item">
                <span class="notice-bullet">•</span>
                <span>
                    <span class="text-truncate">${n.text}</span>
                    ${n.text.length > 50 ? '<span class="read-more">more...</span>' : ''}
                </span>
            </li>
        `).join('');

        container.innerHTML = `
            <div class="sticky-note">
                <div class="note-title">📌 Important Notices</div>
                <ul class="notice-list">
                    ${listHTML}
                </ul>
            </div>
        `;
    }

    window.addEventListener('DOMContentLoaded', initNoticeBoard);
})();
