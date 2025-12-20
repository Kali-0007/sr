/**
 * TaxEasePro - Upload Handler & Recent Documents Logic
 */

// Updated API URL - Single endpoint for all actions (CORS fixed)
const API_URL = 'https://script.google.com/macros/s/AKfycbzTUALDXMllHmxN1rlCjp9pEhFMJUSszHbKQ3WeZ18xs9PgrAb4cyCBmghTpY1cW6Ms/exec';

document.addEventListener('DOMContentLoaded', () => {
    initializeUploadHandler();
   
    // Load documents if on home tab
    if (document.querySelector('#home')?.style.display !== 'none') {
        loadUserDocuments();
    }

    // Refresh on tab switch
    const tabs = document.querySelectorAll('.sidebar a');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.tab === 'home' || tab.dataset.tab === 'upload') {
                loadUserDocuments();
            }
        });
    });
});

function initializeUploadHandler() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectFilesBtn');
   
    if (!dropZone || !fileInput || !selectBtn) return;

    selectBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = '';
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }, false);
}

function handleFiles(files) {
    const progressContainer = document.getElementById('uploadProgressContainer');
    progressContainer.innerHTML = '';

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert("Please login to upload files.");
        return;
    }

    [...files].forEach(file => {
        if (file.size > 15 * 1024 * 1024) {
            createStatusItem(file.name, 'error', 'File too large (>15MB)');
            return;
        }

        const statusId = 'status-' + Math.random().toString(36).substr(2, 9);
        createStatusItem(file.name, 'uploading', 'Uploading...', statusId);

        const reader = new FileReader();
        reader.onload = function(e) {
            const rawData = new Uint8Array(e.target.result);
            const base64Data = btoa(String.fromCharCode(...rawData));

            const payload = {
                action: 'upload-file',
                payload: {  // Backend expects payload object with token, fileName, etc.
                    token: authToken,
                    fileName: file.name,
                    fileData: base64Data,
                    mimeType: file.type || 'application/octet-stream'
                }
            };

            fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
                if (!res.ok) throw new Error('Server error');
                return res.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    updateStatusItem(statusId, 'success', 'Uploaded successfully');
                    loadUserDocuments(); // Refresh list
                } else {
                    updateStatusItem(statusId, 'error', 'Error: ' + (data.message || 'Unknown'));
                }
            })
            .catch(err => {
                updateStatusItem(statusId, 'error', 'Network Error');
                console.error('Upload failed:', err);
            });
        };
        reader.readAsArrayBuffer(file);
    });
}

// UI Helpers
function createStatusItem(fileName, status, message, id = null) {
    const container = document.getElementById('uploadProgressContainer');
    const div = document.createElement('div');
    div.className = `upload-item ${status}`;
    if (id) div.id = id;

    div.innerHTML = `
        <div class="file-info">
            <span class="fname">${fileName}</span>
            <span class="fmsg">${message}</span>
        </div>
        <div class="status-icon">
            ${status === 'uploading' ? '<div class="spinner"></div>' : ''}
            ${status === 'success' ? '✓' : ''}
            ${status === 'error' ? '✕' : ''}
        </div>
    `;
    container.appendChild(div);
}

function updateStatusItem(id, status, message) {
    const item = document.getElementById(id);
    if (!item) return;

    item.className = `upload-item ${status}`;
    const msgEl = item.querySelector('.fmsg');
    const iconEl = item.querySelector('.status-icon');

    if (msgEl) msgEl.textContent = message;
    if (iconEl) {
        iconEl.innerHTML = status === 'success' ? '✓' : status === 'error' ? '✕' : '<div class="spinner"></div>';
    }
}

/**
 * Load User Documents - Using GET for efficiency
 */
function loadUserDocuments() {
    const authToken = localStorage.getItem('authToken');
    const tbody = document.getElementById('recentDocsBody');
    if (!authToken || !tbody) return;

    // Show loading
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#666; padding:20px;">Loading documents...</td></tr>';

    // GET request with query params
    fetch(`${API_URL}?action=get-documents&token=${encodeURIComponent(authToken)}`)
        .then(res => {
            if (!res.ok) throw new Error('Server error');
            return res.json();
        })
        .then(data => {
            if (data.status === 'success') {
                renderDocTable(data.documents || []);
            } else {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error: ' + (data.message || 'Failed to load') + '</td></tr>';
            }
        })
        .catch(err => {
            console.error("Server failure:", err);
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Network error. Please try again.</td></tr>';
        });
}

function renderDocTable(docs) {
    const tbody = document.getElementById('recentDocsBody');
    tbody.innerHTML = '';

    if (docs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#666; padding:20px;">No documents uploaded yet.</td></tr>';
        return;
    }

    docs.forEach(doc => {
        const dateStr = new Date(doc.date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:20px;">📄</span>
                    ${doc.name}
                </div>
            </td>
            <td>${dateStr}</td>
            <td><span class="status-badge status-approved">${doc.status || 'Pending'}</span></td>
            <td>
                <a href="${doc.url}" target="_blank" style="color:var(--secondary); text-decoration:none;">View</a>
            </td>
        `;
        tbody.appendChild(row);
    });
}
