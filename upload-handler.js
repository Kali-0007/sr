/**
 * TaxEasePro - Upload Handler (Complete Fix)
 */

// APNA WEB APP URL YAHA DALEIN
const API_URL = 'https://script.google.com/macros/s/AKfycbxRZ-hqly1jTRzI9ZtUu4p6fHIprzSizA_0n5R4ztt0drHk_PKbABA52G8IgmttL_U/exec';

document.addEventListener('DOMContentLoaded', () => {
    initUploadSystem();
    loadUserDocuments();
});

function initUploadSystem() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectFilesBtn');

    if (!dropZone || !fileInput || !selectBtn) return;

    selectBtn.onclick = () => fileInput.click();

    fileInput.onchange = (e) => handleFiles(e.target.files);

    // Drag & Drop Logic
    ['dragenter', 'dragover'].forEach(n => {
        dropZone.addEventListener(n, (e) => {
            e.preventDefault();
            dropZone.classList.add('highlight');
        });
    });

    ['dragleave', 'drop'].forEach(n => {
        dropZone.addEventListener(n, (e) => {
            e.preventDefault();
            dropZone.classList.remove('highlight');
            if (n === 'drop') handleFiles(e.dataTransfer.files);
        });
    });
}

async function handleFiles(files) {
    const token = localStorage.getItem('authToken');
    if (!token) return alert("Please login first!");

    const container = document.getElementById('uploadProgressContainer');

    for (const file of files) {
        // UI Pe loading dikhana
        const statusId = 'up-' + Math.random().toString(36).substr(2, 9);
        const item = document.createElement('div');
        item.id = statusId;
        item.className = 'upload-item uploading';
        item.innerHTML = `<div class="file-info"><span class="fname">${file.name}</span><span class="fmsg">Uploading...</span></div><div class="status-icon"><div class="spinner"></div></div>`;
        container.appendChild(item);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const base64 = reader.result.split(',')[1];
                
                // CORS Fix: URLSearchParams use kar rahe hain
                const bodyData = new URLSearchParams();
                bodyData.append('action', 'upload-file');
                bodyData.append('token', token);
                bodyData.append('fileData', base64);
                bodyData.append('fileName', file.name);
                bodyData.append('mimeType', file.type);

                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: bodyData,
                    mode: 'cors'
                });

                const result = await response.json();

                if (result.status === 'success') {
                    updateUI(statusId, 'success', 'Uploaded ✅');
                    loadUserDocuments();
                } else {
                    updateUI(statusId, 'error', result.message);
                }
            } catch (err) {
                updateUI(statusId, 'error', 'Network Error');
                console.error(err);
            }
        };
    }
}

function updateUI(id, status, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `upload-item ${status}`;
    el.querySelector('.fmsg').innerText = msg;
    el.querySelector('.status-icon').innerHTML = status === 'success' ? '✓' : '✕';
}

function loadUserDocuments() {
    const token = localStorage.getItem('authToken');
    const tbody = document.getElementById('recentDocsBody');
    if (!token || !tbody) return;

    fetch(`${API_URL}?action=get-documents&token=${encodeURIComponent(token)}`)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'success' && data.documents) {
                renderTable(data.documents);
            }
        }).catch(e => console.log("Load error", e));
}

function renderTable(docs) {
    const tbody = document.getElementById('recentDocsBody');
    tbody.innerHTML = docs.length ? '' : '<tr><td colspan="4">No documents found.</td></tr>';
    // Table rendering logic...
}
