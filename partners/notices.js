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
        background: #f1f8e9;
        color: #5d4037;
        box-shadow: 5px 7px 15px rgba(0,0,0,0.18);
        transform: rotate(-1.8deg);
        position: relative;
        border-bottom-right-radius: 60px 8px;
        display: flex;
        flex-direction: column;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
      }

      .nb-sticky::after {
        content: "";
        position: absolute;
        inset: 0;
        background: url('https://www.transparenttextures.com/patterns/paper-fibers.png');
        opacity: 0.10;
        pointer-events: none;
        border-radius: inherit;
      }

      /* Tape */
      .nb-sticky::before {
        content: "";
        position: absolute;
        top: -14px;
        left: 38%;
        width: 90px;
        height: 30px;
        background: rgba(255,255,255,0.45);
        backdrop-filter: blur(1.5px);
        border: 1px solid rgba(0,0,0,0.08);
        transform: rotate(-3deg);
      }

      .nb-title {
        font-weight: 800;
        font-size: 0.9rem;
        text-transform: uppercase;
        margin-bottom: 10px;
        border-bottom: 1px dashed rgba(0,0,0,0.12);
        padding-bottom: 6px;
        color: #3e2723;
      }

      .nb-list {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        flex-grow: 1;
      }

      .nb-list::-webkit-scrollbar { width: 5px; }
      .nb-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 10px; }

      .nb-item {
        font-size: 0.87rem;
        line-height: 1.45;
        margin-bottom: 12px;
        display: flex;
        gap: 8px;
        cursor: pointer;
        transition: color 0.18s ease;
        padding: 4px 6px;
        border-radius: 4px;
      }

      .nb-item:hover { color: #000; background: rgba(0,0,0,0.03); }

      .nb-new {
        background: #e53935;
        color: white;
        font-size: 0.65rem;
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: bold;
        margin-right: 6px;
      }

      .nb-text {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex: 1;
      }

      /* Loading & Empty */
      .nb-loading, .nb-empty {
        text-align: center;
        padding: 40px 0;
        color: #757575;
        font-style: italic;
        font-size: 0.9rem;
      }

      .nb-spinner {
        width: 22px;
        height: 22px;
        border: 3px solid #ddd;
        border-top: 3px solid #616161;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 10px;
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      /* Modal */
      .nb-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(6px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.25s;
      }

      .nb-modal-overlay.visible { opacity: 1; }

      .nb-big-note {
        width: ${CONFIG.MODAL_WIDTH}px;
        max-width: 92vw;
        min-height: 340px;
        background: #fdf5e6;
        padding: 40px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.35);
        transform: rotate(1.2deg) scale(0.96);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        border-radius: 4px;
        border-bottom-right-radius: 90px 18px;
      }

      .nb-big-note.visible { transform: rotate(1.2deg) scale(1); }

      /* Felt texture simulation */
      .nb-big-note::after {
        content: "";
        position: absolute;
        inset: 0;
        background: url('https://www.transparenttextures.com/patterns/felt.png');
        opacity: 0.18;
        pointer-events: none;
        border-radius: inherit;
      }

      .nb-close {
        position: absolute;
        top: 18px;
        right: 22px;
        font-size: 32px;
        cursor: pointer;
        color: #757575;
        line-height: 1;
      }

      .nb-close:hover { color: #d32f2f; }

      .nb-modal-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #3e2723;
        margin-bottom: 18px;
      }

      .nb-modal-text {
        font-size: 1.1rem;
        line-height: 1.65;
        color: #424242;
        white-space: pre-wrap;
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
        if (Array.isArray(data)) {
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
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
