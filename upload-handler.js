/**
 * TaxEasePro - Upload Handler & Recent Documents Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeUploadHandler();
    
    // Load documents if we are already on the home tab, or when switching to it
    if(document.querySelector('#home').style.display !== 'none') {
        loadUserDocuments();
    }

    // Hook into existing tab click logic to refresh tables
    const tabs = document.querySelectorAll('.sidebar a');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.tab === 'home' || tab.dataset.tab === 'upload') {
                loadUserDocuments(); // Refresh list on tab switch
            }
        });
    });
});

function initializeUploadHandler() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectFilesBtn');
    
    if (!dropZone || !fileInput) return;

    // 1. Handle Browse Button
    selectBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset input
    });

    // 2. Handle Drag & Drop Events
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

/**
 * Process and Upload Files
 */
function handleFiles(files) {
    const progressContainer = document.getElementById('uploadProgressContainer');
    progressContainer.innerHTML = ''; // Clear previous messages
    
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert("Please login to upload files.");
        return;
    }

    ([...files]).forEach(file => {
        // Validation: 15MB Limit (Apps Script limit is roughly 50MB, but 15MB is safe for web app transfer)
        if (file.size > 15 * 1024 * 1024) {
            createStatusItem(file.name, 'error', 'File too large (>15MB)');
            return;
        }

        // Create UI Progress Item
        const statusId = 'status-' + Math.random().toString(36).substr(2, 9);
        createStatusItem(file.name, 'uploading', 'Uploading...', statusId);

        // Read File
        const reader = new FileReader();
        reader.onload = function(e) {
            const rawData = new Uint8Array(e.target.result);
            // Convert to standard array for Google Script compatibility
            const dataArray = Array.from(rawData); 

            const payload = {
                data: dataArray,
                name: file.name,
                mimeType: file.type,
                token: authToken
            };

            // Call Backend
            google.script.run
                .withSuccessHandler((res) => {
                    if (res.status === 'success') {
                        updateStatusItem(statusId, 'success', 'Uploaded successfully');
                        loadUserDocuments(); // Refresh table immediately
                    } else {
                        updateStatusItem(statusId, 'error', 'Error: ' + res.message);
                    }
                })
                .withFailureHandler((err) => {
                    updateStatusItem(statusId, 'error', 'Network Error');
                    console.error(err);
                })
                .uploadFile(payload);
        };
        reader.readAsArrayBuffer(file);
    });
}

// --- UI Helpers for Upload ---

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
    
    if(msgEl) msgEl.textContent = message;
    
    if(iconEl) {
        if(status === 'success') iconEl.innerHTML = '✓';
        else if(status === 'error') iconEl.innerHTML = '✕';
    }
}

/**
 * Fetch and Display User Documents
 */
function loadUserDocuments() {
    const authToken = localStorage.getItem('authToken');
    const tbody = document.getElementById('recentDocsBody');
    if(!authToken || !tbody) return;

    // Optional: Show loading state in table if empty
    // tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#666;">Loading documents...</td></tr>';

    google.script.run
        .withSuccessHandler((res) => {
            if (res.status === 'success') {
                renderDocTable(res.documents);
            } else {
                console.error("Failed to load docs:", res.message);
            }
        })
        .withFailureHandler((err) => {
            console.error("Server failure:", err);
        })
        .getUserDocuments(authToken);
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
            <td><span class="status-badge status-approved">Available</span></td>
            <td>
                <a href="${doc.viewUrl}" target="_blank" style="color:var(--secondary); text-decoration:none; margin-right:10px;">View</a>
                </td>
        `;
        tbody.appendChild(row);
    });
}
