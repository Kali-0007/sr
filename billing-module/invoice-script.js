// Sample Local Storage for Party History (Initial Data)
let partyHistory = JSON.parse(localStorage.getItem('partyHistory')) || {
    "09AAACR1234A1Z5": { name: "Ramesh Trading Co.", pos: "09", address: "Kanpur, UP" },
    "07ABCDE1234F1Z9": { name: "Global Tech Sol.", pos: "07", address: "New Delhi" }
};

// 1. Function to Verify GSTIN & Auto-fill
function verifyGSTIN() {
    const gstin = document.getElementById('custGstin').value.toUpperCase();
    const statusDiv = document.getElementById('gstinStatus');
    
    if (partyHistory[gstin]) {
        // Data found in history
        document.getElementById('custName').value = partyHistory[gstin].name;
        document.getElementById('pos').value = partyHistory[gstin].pos;
        statusDiv.innerHTML = "<span class='text-success'>● Verified from History</span>";
        calculateTotal(); // Recalculate tax based on POS
    } else if (gstin.length === 15) {
        statusDiv.innerHTML = "<span class='text-warning'>● New GSTIN Detected (Saving...)</span>";
        // Logic: Yahan hum aage API call bhi kar sakte hain
    } else {
        statusDiv.innerHTML = "<span class='text-danger'>● Invalid GSTIN Format</span>";
    }
}

// 2. Add Row with Delete Option
function addRow() {
    const table = document.getElementById('itemRows');
    const rowCount = table.rows.length + 1;
    const newRow = `
        <tr>
            <td>${rowCount}</td>
            <td><input type="text" class="form-control form-control-sm" placeholder="Item Name"></td>
            <td><input type="text" class="form-control form-control-sm" placeholder="HSN"></td>
            <td><input type="number" class="form-control form-control-sm qty" value="1" oninput="calculateTotal()"></td>
            <td><input type="number" class="form-control form-control-sm price" placeholder="0.00" oninput="calculateTotal()"></td>
            <td>
                <select class="form-select form-select-sm gstRate" onchange="calculateTotal()">
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18" selected>18%</option>
                    <option value="28">28%</option>
                </select>
            </td>
            <td><input type="text" class="form-control form-control-sm rowTotal" readonly value="0.00"></td>
            <td><button class="btn btn-sm btn-outline-danger border-0" onclick="removeRow(this)">×</button></td>
        </tr>`;
    table.insertAdjacentHTML('beforeend', newRow);
}

function removeRow(btn) {
    btn.closest('tr').remove();
    calculateTotal();
}

// 3. Calculation Logic with Tax Split
function calculateTotal() {
    let subTotal = 0;
    let totalGst = 0;
    const rows = document.querySelectorAll('#itemRows tr');

    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const gstRate = parseFloat(row.querySelector('.gstRate').value) || 0;

        const taxableValue = qty * price;
        const gstAmount = (taxableValue * gstRate) / 100;
        const rowTotal = taxableValue + gstAmount;

        row.querySelector('.rowTotal').value = rowTotal.toFixed(2);
        subTotal += taxableValue;
        totalGst += gstAmount;
    });

    const grandTotal = subTotal + totalGst;
    
    document.getElementById('subTotal').innerText = subTotal.toFixed(2);
    document.getElementById('grandTotal').innerText = grandTotal.toFixed(2);
    
    updateTaxBreakup(totalGst);
}

// 4. Detailed Tax Breakup (CGST/SGST vs IGST)
function updateTaxBreakup(totalGst) {
    const myState = "09"; // Your firm's state code
    const customerState = document.getElementById('pos').value;
    const taxDetails = document.getElementById('taxDetails');
    
    if (!customerState) {
        taxDetails.innerHTML = "<small class='text-danger'>Select State for Tax Breakup</small>";
        return;
    }

    if (customerState === myState) {
        const cgst = totalGst / 2;
        taxDetails.innerHTML = `
            <div class="d-flex justify-content-between small"><span>CGST (9%):</span> <span>${cgst.toFixed(2)}</span></div>
            <div class="d-flex justify-content-between small"><span>SGST (9%):</span> <span>${cgst.toFixed(2)}</span></div>
        `;
    } else {
        taxDetails.innerHTML = `
            <div class="d-flex justify-content-between small"><span>IGST (18%):</span> <span>${totalGst.toFixed(2)}</span></div>
        `;
    }
}

// 5. Save Bill & Add to History
function saveBill() {
    const gstin = document.getElementById('custGstin').value.toUpperCase();
    const name = document.getElementById('custName').value;
    const pos = document.getElementById('pos').value;

    if (gstin && name && !partyHistory[gstin]) {
        partyHistory[gstin] = { name: name, pos: pos };
        localStorage.setItem('partyHistory', JSON.stringify(partyHistory));
        alert("Bill Saved & Party Added to History!");
    } else {
        alert("Invoice Saved Successfully!");
    }
}

// Initialize with one row
window.onload = addRow;
