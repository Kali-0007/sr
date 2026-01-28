/**
 * TaxEasePro - Professional GST Billing Engine
 * Features: Multi-copy PDF, GSTIN History, Auto-Tax Split, UQC Compliance
 */

// 1. GLOBAL CONFIGURATION & MASTER DATA
const myStateCode = "09"; // Uttar Pradesh
const uomList = [
    "BAG-BAGS", "BOX-BOX", "BTL-BOTTLES", "CBM-CUBIC METERS", 
    "KGS-KILOGRAMS", "MTR-METERS", "NOS-NUMBERS", "PCS-PIECES", 
    "SET-SETS", "SQM-SQUARE METERS", "THD-THOUSANDS"
];

// Load Party History from LocalStorage
let partyHistory = JSON.parse(localStorage.getItem('partyHistory')) || {
    "09AAACR1234A1Z5": { name: "Ramesh Trading Co.", pos: "09", address: "123, Civil Lines, Kanpur, UP" },
    "07ABCDE1234F1Z9": { name: "Global Tech Sol.", pos: "07", address: "Sector 15, Dwarka, New Delhi" }
};

// 2. UI & DOCUMENT TYPE LOGIC
function handleDocTypeChange() {
    const type = document.getElementById('docType').value;
    const refSection = document.getElementById('refSection'); // For CN/DN
    const taxHeads = document.querySelectorAll('.tax-head');
    const taxCols = document.querySelectorAll('.tax-col');

    // Show/Hide Reference section for Credit/Debit Notes
    if(refSection) {
        if(type.includes("Note")) {
            refSection.classList.remove('d-none');
        } else {
            refSection.classList.add('d-none');
        }
    }

    // GSTR-1 Rule: Bill of Supply doesn't have tax
    const isExempt = (type === "Bill of Supply");
    taxHeads.forEach(th => th.style.display = isExempt ? 'none' : '');
    
    // Recalculate everything after UI change
    calculateTotal();
}

// 3. GSTIN VERIFICATION ENGINE
function verifyGSTIN() {
    const gstin = document.getElementById('custGstin').value.toUpperCase().trim();
    const statusDiv = document.getElementById('gstinStatus');
    
    if (!gstin) return;

    if (partyHistory[gstin]) {
        // Auto-fill from History
        document.getElementById('custName').value = partyHistory[gstin].name;
        document.getElementById('pos').value = partyHistory[gstin].pos;
        if(document.getElementById('custAddr')) {
            document.getElementById('custAddr').value = partyHistory[gstin].address || "";
        }
        statusDiv.innerHTML = "<span class='text-success fw-bold'>● Verified (Saved Party)</span>";
    } else if (gstin.length === 15) {
        // New GSTIN Format Check
        const stateCode = gstin.substring(0, 2);
        document.getElementById('pos').value = stateCode; // Auto-suggest POS
        statusDiv.innerHTML = "<span class='text-warning fw-bold'>● New GSTIN (Will save on 'Save')</span>";
    } else {
        statusDiv.innerHTML = "<span class='text-danger fw-bold'>● Invalid GSTIN Format</span>";
    }
    calculateTotal();
}

// 4. ROW MANAGEMENT (DYNAMIC)
function addRow() {
    const table = document.getElementById('itemRows');
    const id = Date.now();
    const unitOptions = uomList.map(u => `<option value="${u.split('-')[0]}">${u}</option>`).join('');
    
    const rowHtml = `
        <tr id="row_${id}" class="item-row">
            <td class="row-index text-center pt-3"></td>
            <td><input type="text" class="form-control form-control-sm" placeholder="Item Description"></td>
            <td><input type="text" class="form-control form-control-sm" placeholder="HSN/SAC"></td>
            <td><input type="number" class="form-control form-control-sm qty" value="1" oninput="calculateTotal()"></td>
            <td><select class="form-select form-select-sm unit">${unitOptions}</select></td>
            <td><input type="number" class="form-control form-control-sm price" placeholder="0.00" oninput="calculateTotal()"></td>
            <td class="tax-col">
                <select class="form-select form-select-sm gstRate" onchange="calculateTotal()">
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18" selected>18%</option>
                    <option value="28">28%</option>
                </select>
            </td>
            <td><input type="text" class="form-control form-control-sm rowTotal" readonly value="0.00"></td>
            <td class="no-print pt-2">
                <button class="btn btn-sm text-danger border-0" onclick="removeRow('${id}')" title="Remove Row">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                </button>
            </td>
        </tr>`;
    table.insertAdjacentHTML('beforeend', rowHtml);
    updateRowIndices();
}

function removeRow(id) {
    const row = document.getElementById(`row_${id}`);
    if(row) row.remove();
    updateRowIndices();
    calculateTotal();
}

function updateRowIndices() {
    document.querySelectorAll('#itemRows tr').forEach((row, index) => {
        row.querySelector('.row-index').innerText = index + 1;
    });
}

// 5. TAX CALCULATION & BREAKUP
function calculateTotal() {
    let subTotal = 0;
    let totalGst = 0;
    const docType = document.getElementById('docType').value;
    const isExempt = (docType === "Bill of Supply");

    document.querySelectorAll('#itemRows tr').forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const gstRate = isExempt ? 0 : parseFloat(row.querySelector('.gstRate').value) || 0;

        const taxableValue = qty * price;
        const gstAmount = (taxableValue * gstRate) / 100;
        const rowTotal = taxableValue + gstAmount;

        row.querySelector('.rowTotal').value = rowTotal.toFixed(2);
        subTotal += taxableValue;
        totalGst += gstAmount;
    });

    // Update Totals in UI
    document.getElementById('subTotal').innerText = subTotal.toFixed(2);
    const grandTotal = subTotal + totalGst;
    document.getElementById('grandTotal').innerText = grandTotal.toFixed(2);

    // Dynamic Tax Split (CGST/SGST vs IGST)
    const pos = document.getElementById('pos').value;
    const taxDiv = document.getElementById('taxDetails');
    
    if (!pos) {
        taxDiv.innerHTML = "<small class='text-danger'>Select POS for Tax</small>";
    } else if (pos === myStateCode) {
        const half = (totalGst / 2).toFixed(2);
        taxDiv.innerHTML = `
            <div class="d-flex justify-content-between small"><span>CGST:</span><span>₹ ${half}</span></div>
            <div class="d-flex justify-content-between small"><span>SGST:</span><span>₹ ${half}</span></div>`;
    } else {
        taxDiv.innerHTML = `<div class="d-flex justify-content-between small"><span>IGST:</span><span>₹ ${totalGst.toFixed(2)}</span></div>`;
    }

    // Convert to Words
    if(document.getElementById('amountInWords')) {
        document.getElementById('amountInWords').innerText = "Amount in Words: " + numberToWords(Math.round(grandTotal)) + " Only";
    }
}

// 6. 3-COPY PDF GENERATION (The "Magic" Function)
function generate3Copies() {
    const copies = [
        { title: "ORIGINAL FOR RECIPIENT", color: "#0d6efd" },
        { title: "DUPLICATE FOR TRANSPORTER", color: "#6c757d" },
        { title: "TRIPLICATE FOR SUPPLIER", color: "#198754" }
    ];

    // Clone the main billing card
    const originalCard = document.querySelector('.billing-card').cloneNode(true);
    
    // Fix Input Values for Print (Inputs don't clone their values to HTML)
    const inputs = document.querySelector('.billing-card').querySelectorAll('input, select, textarea');
    const clonedInputs = originalCard.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input, index) => {
        const val = input.value;
        const target = clonedInputs[index];
        const span = document.createElement('span');
        span.className = "print-value fw-bold";
        
        // Handle select display (show text, not value code)
        if(target.tagName === "SELECT") {
            span.innerText = target.options[target.selectedIndex].text;
        } else {
            span.innerText = val || "---";
        }
        target.parentNode.replaceChild(span, target);
    });

    let finalHtml = "";
    copies.forEach((copy, index) => {
        const pageBreak = index > 0 ? 'style="page-break-before: always; padding-top: 30px;"' : '';
        finalHtml += `
            <div class="invoice-page" ${pageBreak}>
                <div style="display: flex; justify-content: space-between; align-items: center; border: 2px solid #000; padding: 10px; margin-bottom: 20px;">
                    <h5 style="margin:0; color:${copy.color}">${copy.title}</h5>
                    <span style="font-size: 12px;">Generated via TaxEasePro</span>
                </div>
                ${originalCard.innerHTML}
                <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #888;">
                    This is a computer-generated document. No signature required.
                </div>
            </div>`;
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Download_Invoice_${Date.now()}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 40px; background: white !important; font-size: 12px; }
                .no-print, button, .addRowBtn, .input-group-text, .btn { display:none !important; }
                .section-title { color: #000 !important; border-bottom: 1px solid #000 !important; }
                .table-primary { background-color: #f2f2f2 !important; color: #000 !important; }
                .billing-card { box-shadow: none !important; border: none !important; }
                .total-box { border: 1px solid #000 !important; background: #fafafa !important; }
                .print-value { display: inline-block; min-width: 10px; }
                @page { size: A4; margin: 0; }
            </style>
        </head>
        <body>${finalHtml}</body>
        </html>`);
    
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 750);
}

// 7. UTILS: SAVE & WORD CONVERSION
function saveBill() {
    const gstin = document.getElementById('custGstin').value.toUpperCase().trim();
    const name = document.getElementById('custName').value.trim();
    const addr = document.getElementById('custAddr').value.trim();
    const pos = document.getElementById('pos').value;

    if (gstin.length === 15 && name) {
        partyHistory[gstin] = { name: name, pos: pos, address: addr };
        localStorage.setItem('partyHistory', JSON.stringify(partyHistory));
        alert("Success: Invoice data saved to local history!");
    } else {
        alert("Error: Please provide valid GSTIN and Party Name.");
    }
}

function numberToWords(num) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'Overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
}

// Start with one default row
window.onload = () => {
    addRow();
    // Set default date to today
    document.getElementById('invDate').valueAsDate = new Date();
};
