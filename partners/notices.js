/**
 * notices.js - Improved & Robust Version for TaxEasePro Dashboard
 * Features: Sticky note UI, backend integration with retries, modal popup, fallback, overwrite protection
 */
(function() {
  'use strict';

  // ── Config ───────────────────────────────────────────────────────────────
  const CONFIG = {
    WRAPPER_ID: 'notice-board-wrapper',
    MAX_RETRIES: 7,
    RETRY_DELAY_MS: 1400,
    NOTE_WIDTH: 320,
    NOTE_HEIGHT: 310,
    MODAL_WIDTH: 480,
    FALLBACK_NOTICES: [
      { text: "Notices temporarily unavailable. Please refresh or check later.", date: new Date().toISOString(), isNew: true },
      { text: "Important: Keep checking this section for updates.", date: "2026-01-01", isNew: false }
    ]
  };

  // ── Early Capture google.script (overwrite protection) ────────────────────
  let gsRun = null;
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    gsRun = google.script.run;
    console.log('[Notices] google.script captured successfully at init');
  }

  // ── CSS Injection ─────────────────────────────────────────────────────────
  const injectStyles = () => {
    const style = document.createElement('style');
   // ── CSS Injection (Optimized for Texture & Sorting) ────────────────────────
  const injectStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      #${CONFIG.WRAPPER_ID} {
        display: flex;
        justify-content: flex-end;
        pointer-events: none;
      }

      .nb-sticky {
        pointer-events: auto;
        width: ${CONFIG.NOTE_WIDTH}px;
        height: ${CONFIG.NOTE_HEIGHT}px;
        padding: 18px;
        /* Subtle Yellow with Grainy Paper Texture */
        background: #f4efc1 url('https://www.transparenttextures.com/patterns/handmade-paper.png');
        color: #5d4037;
        box-shadow: 4px 6px 15px rgba(0,0,0,0.15);
        transform: rotate(-1.8deg);
        position: relative;
        border-bottom-right-radius: 60px 8px;
        display: flex;
        flex-direction: column;
        user-select: none;
        border: 1px solid rgba(0,0,0,0.05);
      }

      /* Tape - Adjusted for realism */
      .nb-sticky::before {
        content: "";
        position: absolute;
        top: -14px;
        left: 38%;
        width: 90px;
        height: 30px;
        background: rgba(255,255,255,0.3);
        backdrop-filter: blur(2px);
        border: 1px solid rgba(255,255,255,0.2);
        transform: rotate(-3deg);
      }

      .nb-title {
        font-weight: 800;
        font-size: 0.85rem;
        text-transform: uppercase;
        margin-bottom: 10px;
        border-bottom: 1px dashed rgba(93, 64, 55, 0.2);
        padding-bottom: 6px;
        color: #3e2723;
        letter-spacing: 0.5px;
      }

      .nb-list {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        flex-grow: 1;
      }

      .nb-item {
        font-size: 0.85rem;
        line-height: 1.4;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column; /* Isse Date Message ke niche aayegi */
        cursor: pointer;
        padding: 6px;
        border-radius: 4px;
        border-bottom: 1px solid rgba(0,0,0,0.04);
      }

      .nb-item:hover { background: rgba(0,0,0,0.05); color: #000; }

      /* Recent Date Styling */
      .nb-date-stamp {
        font-size: 0.68rem;
        color: #8d6e63;
        font-weight: bold;
        text-align: right;
        margin-top: 3px;
        opacity: 0.8;
      }

      .nb-text {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex: 1;
      }

      /* Modal / Big Note with Felt Texture */
      .nb-big-note {
        width: ${CONFIG.MODAL_WIDTH}px;
        max-width: 92vw;
        min-height: 340px;
        background: #fdf5e6 url('https://www.transparenttextures.com/patterns/felt.png');
        padding: 40px;
        box-shadow: 0 15px 45px rgba(0,0,0,0.4);
        transform: rotate(1deg) scale(0.96);
        transition: all 0.3s ease;
        position: relative;
        border-radius: 4px;
        border-bottom-right-radius: 90px 18px;
      }

      .nb-close {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 30px;
        cursor: pointer;
        color: #757575;
      }
    `;
    document.head.appendChild(style);
  };

  // ── DOM Helpers ───────────────────────────────────────────────────────────
  const createElement = (tag, className = '', inner = '') => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (inner) el.innerHTML = inner;
    return el;
  };

  const escape = str => String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[m]));

  // ── UI Render Functions ───────────────────────────────────────────────────
  const renderList = (container, notices) => {
    if (!notices?.length) {
      container.innerHTML = '<div class="nb-empty">No active notices at the moment.</div>';
      return;
    }

    container.innerHTML = '';
    notices.forEach(n => {
      const item = createElement('div', 'nb-item');
      item.innerHTML = `
        <span class="nb-new">${n.isNew ? 'NEW' : ''}</span>
        <div class="nb-text">${escape(n.text)}</div>
      `;
      item.onclick = () => showModal(n);
      container.appendChild(item);
    });
  };

  const showModal = notice => {
    const overlay = createElement('div', 'nb-modal-overlay');
    overlay.innerHTML = `
      <div class="nb-big-note">
        <span class="nb-close">&times;</span>
        <div class="nb-modal-title">📌 Official Announcement</div>
        <div class="nb-modal-text">${escape(notice.text)}</div>
      </div>
    `;

    const closeBtn = overlay.querySelector('.nb-close');
    const bigNote = overlay.querySelector('.nb-big-note');

    const close = () => {
      overlay.classList.remove('visible');
      bigNote.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
    };

    closeBtn.onclick = close;
    overlay.onclick = e => { if (e.target === overlay) close(); };

    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.classList.add('visible');
      bigNote.classList.add('visible');
    }, 10);
  };

  // ── Fetch Logic with Retry & Protection ───────────────────────────────────
  // ── Fetch Logic with Dynamic API Capture ───────────────────────────────────
  // Purana loadNotices aur attemptFetch hata kar ye likhein
// notices.js mein is function ko isse replace karein
window.triggerNoticeFetch = function() {
    const listContainer = document.querySelector('.nb-list');
    const partnerId = localStorage.getItem('referralCode') || 'GUEST';
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtClA1mmRpEO154x20nahYGhDAN83ODXPE1jhzJs65aqkCnMEldsmwFoTyTF44Rp3j/exec";

    fetch(`${SCRIPT_URL}?partnerId=${partnerId}`)
    .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
    })
    .then(data => {
        console.log('[Notices] Success! Data received:', data);
        if (typeof renderList === 'function') {
            renderList(listContainer, data);
        }
    })
    .catch(err => {
        console.error('[Notices] Error details:', err);
    });
}; // <--- YE BRACKET MISSING THA, ise lagana zaroori hai
// ── Initialization ────────────────────────────────────────────────────────
const initNoticeBoard = () => {
    injectStyles();
    const wrapper = document.getElementById(CONFIG.WRAPPER_ID);
    if (!wrapper) return;

    wrapper.innerHTML = `
      <div class="nb-sticky">
        <div class="nb-title">📌 Notices</div>
        <div class="nb-list nb-loading">
          <div class="nb-spinner"></div>
          Loading notices...
        </div>
      </div>
    `;
    
    console.log('[Notices] Starting fetch now...');
    window.triggerNoticeFetch(); 
};

// DOM Load hone par sirf UI banaiye
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNoticeBoard);
} else {
    initNoticeBoard();
}

})(); // IIFE closing
