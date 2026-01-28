// GST Standard Settings
const myStateCode = "09"; // UP
const uomList = ["BAG-BAGS", "BOX-BOX", "BTL-BOTTLES", "KGS-KILOGRAMS", "MTR-METERS", "NOS-NUMBERS", "PCS-PIECES", "SET-SETS"];

// Local Storage for Party History
let partyHistory = JSON.parse(localStorage.getItem('partyHistory')) || {
    "09AAACR1234A1Z5": { name: "Ramesh Trading Co.", pos: "09", address: "123, Civil Lines, Kanpur" }
};

// 1. UI Logic: Handle Document Type Change
function updateDocLabels() {
    const type = document.getElementById('docType').value;
    const refSection = document.getElementById('refSection'); // Ensure this ID exists in HTML
    const isNote = type.includes("Note");
    
    // Toggle reference section for Credit/Debit notes
    if(refSection) refSection.classList.toggle('d-none', !isNote);
    
    // Hide tax columns if Bill of Supply
    const isExempt = (type === "Bill of Supply");
    document.querySelectorAll('.tax-col, .tax-head').forEach(el => {
        el.style.display = isExempt ? 'none' : '';
    });
    
    calculateTotal();
}

// 2. GSTIN Verification & Auto-fill
function verifyGSTIN() {
    const gstin = document.getElementById('custGstin').value.toUpperCase();
    const statusDiv = document.getElementById('gstinStatus');
    
    if (partyHistory[gstin]) {
        document.getElementById('custName').value = partyHistory[gstin].name;
        document.getElementById('pos').value = partyHistory[gstin].pos;
        if(document.getElementById('custAddr')) {
            document.getElementById('custAddr').value = partyHistory[gstin].address || "";
        }
        statusDiv.innerHTML = "<span class='text-success'>● Verified from History</span>";
        calculateTotal();
    } else if (gstin.length === 15) {
        statusDiv.innerHTML = "<span class='text-warning'>● New GSTIN (Will save on 'Save')</span>";
    } else {
        statusDiv.innerHTML = "<span class='text-danger'>● Invalid GSTIN</span>";
    }
}

// 3. Dynamic Row Management
function addRow() {
    const table = document.getElementById('itemRows');
    const id = Date.now();
    const unitOptions = uomList.map(u => `<option value="${u.split('-')[0]}">${u}</option>`).join('');
    
    const newRow = `
        <tr id="row_${id}">
            <td>${table.rows.length + 1}</td>
            <td><input type="text" class="form-control form-control-sm" placeholder="Item Description"></td>
            <td><input type="text" class="form-control form-control-sm" placeholder="HSN"></td>
            <td><input type="number" class="form-control form-control-sm qty" value="1" oninput="calculateTotal()"></td>
            <td><select class="form-select form-select-sm">${unitOptions}</select></td>
            <td><input type="number" class="form-control form-control-sm price" placeholder="0.00" oninput="calculateTotal()"></td>
            <td class="tax-col">
                <select class="form-select form-select-sm gstRate" onchange="calculateTotal()">
                    <option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18" selected>18%</option><option value="28">28%</option>
                </select>
            </td>
            <td><input type="text" class="form-control form-control-sm rowTotal" readonly value="0.00"></td>
            <td><button class="btn btn-sm text-danger no-print" onclick="removeRow('${id}')">×</button></td>
        </tr>`;
    table.insertAdjacentHTML('beforeend', newRow);
}

function removeRow(id) {
    document.getElementById(`row_${id}`).remove();
    calculateTotal();
}

// 4. Core Calculation Engine
function calculateTotal() {
    let subTotal = 0;
    let totalGst = 0;
    const docType = document.getElementById('docType').value;
    const rows = document.querySelectorAll('#itemRows tr');

    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const gstRate = (docType === "Bill of Supply") ? 0 : parseFloat(row.querySelector('.gstRate').value) || 0;

        const taxableValue = qty * price;
        const gstAmount = (taxableValue * gstRate) / 100;
        
        row.querySelector('.rowTotal').value = (taxableValue + gstAmount).toFixed(2);
        subTotal += taxableValue;
        totalGst += gstAmount;
    });

    document.getElementById('subTotal').innerText = subTotal.toFixed(2);
    document.getElementById('grandTotal').innerText = (subTotal + totalGst).toFixed(2);
    
    updateTaxBreakup(totalGst);
}

// 5. Intelligent Tax Splitting (Based on GST Rate selected)
function updateTaxBreakup(totalGst) {
    const customerState = document.getElementById('pos').value;
    const taxDetails = document.getElementById('taxDetails');
    
    if (!customerState) {
        taxDetails.innerHTML = "<small class='text-danger'>Select State for Tax Breakup</small>";
        return;
    }

    if (customerState === myStateCode) {
        const halfGst = (totalGst / 2).toFixed(2);
        taxDetails.innerHTML = `
            <div class="d-flex justify-content-between small"><span>CGST:</span> <span>${halfGst}</span></div>
            <div class="d-flex justify-content-between small"><span>SGST:</span> <span>${halfGst}</span></div>`;
    } else {
        taxDetails.innerHTML = `
            <div class="d-flex justify-content-between small"><span>IGST:</span> <span>${totalGst.toFixed(2)}</span></div>`;
    }
}

// 6. Save Logic
function saveBill() {
    const gstin = document.getElementById('custGstin').value.toUpperCase();
    const name = document.getElementById('custName').value;
    const addr = document.getElementById('custAddr').value;
    const pos = document.getElementById('pos').value;

    if (gstin.length === 15 && name) {
        partyHistory[gstin] = { name: name, pos: pos, address: addr };
        localStorage.setItem('partyHistory', JSON.stringify(partyHistory));
        alert("Invoice Data & Party Details Saved!");
    } else {
        alert("Please fill GSTIN and Party Name!");
    }
}

// PDF Generation Mockup
function printBill() {
    window.print();
}

window.onload = addRow;
