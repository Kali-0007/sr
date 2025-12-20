/**
 * TaxEasePro - Upload Handler & Recent Documents Logic (Fixed CORS)
 */

// Dashboard se hi URL uthayega agar dashboard.html mein define hai
const API_URL = 'https://script.google.com/macros/s/AKfycbzd81RjjizVxsTxSgXK8ur9ge_nzui1iDd-y6HnpZE6xEqc89a9qr8ihWdFdpEldKwK/exec';

document.addEventListener('DOMContentLoaded', () => {
    initializeUploadHandler();
    
    // Initial Load
    loadUserDocuments();

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
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    }, false);
}

function handleFiles(files) {
    const progressContainer = document.getElementById('uploadProgressContainer');
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
        reader.onload = async function(e) {
            // Base64 nikalne ka simple tarika
            const base64Data = e.target.result.split(',')[1];

            // CORS SE BACHNE KE LIYE URLSEARCHPARAMS USE KAREIN
            const formData = new URLSearchParams();
            formData.append('action', 'upload-file');
            formData.append('token', authToken);
            formData.append('fileName', file.name);
            formData.append('fileData', base64Data);
            formData.append('mimeType', file.type || 'application/octet-stream');

            try {
                // Fetch call bina kisi custom header ke (CORS Safe)
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: formData,
                    // Content-Type khud set ho jayega application/x-www-form-urlencoded
                });

                const data = await response.json();

                if (data.status === 'success') {
                    updateStatusItem(statusId, 'success', 'Uploaded successfully');
                    loadUserDocuments(); // Table refresh karein
                } else {
                    updateStatusItem(statusId, 'error', 'Error: ' + data.message);
                }
            } catch (err) {
                updateStatusItem(statusId, 'error', 'Network/CORS Error');
                console.error('Upload Error:', err);
            }
        };
        reader.readAsDataURL(file); // ArrayBuffer se better readAsDataURL hai base64 ke liye
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
    if (iconEl) iconEl.innerHTML = status === 'success' ? '✓' : status === 'error' ? '✕' : '<div class="spinner"></div>';
}

function loadUserDocuments() {
    const authToken = localStorage.getItem('authToken');
    const tbody = document.getElementById('recentDocsBody');
    if (!authToken || !tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#666; padding:20px;">Checking documents...</td></tr>';

    fetch(`${API_URL}?action=get-documents&token=${encodeURIComponent(authToken)}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                renderDocTable(data.documents || []);
            } else {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#666; padding:20px;">No documents found.</td></tr>`;
            }
        })
        .catch(err => {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Connection Error</td></tr>';
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
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><div style="display:flex; align-items:center; gap:10px;"><span>📄</span> ${doc.name}</div></td>
            <td>${new Date(doc.date).toLocaleDateString()}</td>
            <td><span class="status-badge status-approved">${doc.status || 'Success'}</span></td>
            <td><a href="${doc.url}" target="_blank" style="color:var(--secondary);">View</a></td>
        `;
        tbody.appendChild(row);
    });
}
