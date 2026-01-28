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

function verifyGSTIN() {
    const gstin = document.getElementById('custGstin').value.toUpperCase().trim();
    const statusDiv = document.getElementById('gstinStatus');
    
    if (!gstin) return;

    // 1. Agar Party History (Local Storage) mein data mil gaya
    if (partyHistory[gstin]) {
        const party = partyHistory[gstin];
        
        // Basic Info fill karo
        document.getElementById('custName').value = party.name || "";
        document.getElementById('pos').value = party.pos || "";
        
        // Multi-field Address auto-fill karo
        document.getElementById('addr_building').value = party.addr_building || "";
        document.getElementById('addr_street').value = party.addr_street || "";
        document.getElementById('addr_city').value = party.addr_city || "";
        document.getElementById('addr_pincode').value = party.addr_pincode || "";
        
        statusDiv.innerHTML = "<span class='text-success fw-bold'>● Verified (Saved Party)</span>";
    } 
    // 2. Agar naya GSTIN hai (15 digit ka)
    else if (gstin.length === 15) {
        // GSTIN ke pehle 2 digits State Code hote hain, use POS mein auto-select karo
        const stateCode = gstin.substring(0, 2);
        const posDropdown = document.getElementById('pos');
        
        if (posDropdown.querySelector(`option[value="${stateCode}"]`)) {
            posDropdown.value = stateCode;
        }
        
        statusDiv.innerHTML = "<span class='text-warning fw-bold'>● New GSTIN (Auto-suggested POS)</span>";
    } 
    // 3. Agar format galat hai
    else {
        statusDiv.innerHTML = "<span class='text-danger fw-bold'>● Invalid GSTIN Format</span>";
    }
    
    // Tax calculate karo kyunki POS change hua ho sakta hai
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
        { title: "ORIGINAL FOR RECIPIENT", color: "#000" },
        { title: "DUPLICATE FOR TRANSPORTER", color: "#444" },
        { title: "TRIPLICATE FOR SUPPLIER", color: "#666" }
    ];

    // Data Extraction
   const invNo = document.getElementById('invNo')?.value || "---";
    const invDate = document.getElementById('invDate')?.value || "---";
    const gstin = document.getElementById('custGstin').value;
    const name = document.getElementById('custName').value;
    const pos = document.getElementById('pos').options[document.getElementById('pos').selectedIndex]?.text || "---";
    
    // Full Address Formatting
    const fullAddr = `${document.getElementById('addr_building').value}, ${document.getElementById('addr_street').value}, ${document.getElementById('addr_city').value} - ${document.getElementById('addr_pincode').value}`;

    // Item Rows Extraction
    let itemRowsHtml = "";
    document.querySelectorAll('#itemRows tr').forEach((row, index) => {
        const desc = row.querySelector('input[placeholder="Item Description"]')?.value || "---";
        const hsn = row.querySelector('input[placeholder="HSN/SAC"]')?.value || "---";
        const qty = row.querySelector('.qty')?.value || "0";
        const unit = row.querySelector('.unit')?.value || "";
        const price = row.querySelector('.price')?.value || "0.00";
        const gst = row.querySelector('.gstRate')?.value || "0";
        const total = row.querySelector('.rowTotal')?.value || "0.00";

        itemRowsHtml += `
            <tr>
                <td style="text-align:center">${index + 1}</td>
                <td style="font-weight:bold">${desc}</td>
                <td style="text-align:center">${hsn}</td>
                <td style="text-align:center">${qty} ${unit}</td>
                <td style="text-align:right">${price}</td>
                <td style="text-align:center">${gst}%</td>
                <td style="text-align:right; font-weight:bold">${total}</td>
            </tr>`;
    });

    const subTotal = document.getElementById('subTotal').innerText;
    const taxDetails = document.getElementById('taxDetails').innerHTML;
    const grandTotal = document.getElementById('grandTotal').innerText;
    const amtWords = document.getElementById('amountInWords').innerText;

    let finalHtml = "";
    copies.forEach((copy, index) => {
        const pageBreak = index > 0 ? 'style="page-break-before: always;"' : '';
        finalHtml += `
        <div class="invoice-container" ${pageBreak}>
            <div class="header">
                <div class="company-info">
                    <h2 style="margin:0; color:#0d6efd;">YOUR FIRM NAME</h2>
                    <p style="margin:2px 0;">123, Business Park, Industrial Area, Kanpur, UP</p>
                    <p style="margin:2px 0;">GSTIN: 09ABCDE1234F1Z5 | Mobile: +91 9876543210</p>
                </div>
                <div class="invoice-label">
                    <div class="copy-title">${copy.title}</div>
                    <h3 style="margin:5px 0;">TAX INVOICE</h3>
                </div>
            </div>

            <hr style="border:1px solid #eee; margin:15px 0;">

            <table class="details-table">
                <tr>
                    <td width="50%">
                        <div class="section-label">BILL TO</div>
                        <div class="party-name">${name}</div>
                        <div class="party-addr">${fullAddr}</div>
                        <div class="party-gst">GSTIN: <b>${gstin}</b></div>
                        <div class="party-gst">POS: <b>${pos}</b></div>
                    </td>
                    <td width="50%" style="vertical-align:top; text-align:right;">
                        <p>Invoice No: <b>${invNo}</b></p>
                        <p>Date: <b>${invDate}</b></p>
                    </td>
                </tr>
            </table>

            <table class="items-table">
                <thead>
                    <tr>
                        <th width="5%">#</th>
                        <th width="45%">Description of Goods</th>
                        <th width="10%">HSN</th>
                        <th width="10%">Qty</th>
                        <th width="10%">Rate</th>
                        <th width="5%">GST</th>
                        <th width="15%">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRowsHtml}
                </tbody>
            </table>

            <div style="display:flex; justify-content:space-between; margin-top:10px;">
                <div style="width:60%">
                    <p style="font-size:11px; margin-bottom:5px;"><b>Amount in Words:</b><br>${amtWords}</p>
                    <div style="border:1px solid #eee; padding:8px; font-size:10px; border-radius:5px;">
                        <b>Terms & Conditions:</b><br>
                        1. Goods once sold will not be taken back.<br>
                        2. Subject to Kanpur Jurisdiction.
                    </div>
                </div>
                <div style="width:35%">
                    <table class="summary-table">
                        <tr><td>Taxable Value:</td><td style="text-align:right">₹ ${subTotal}</td></tr>
                        <tr><td colspan="2" style="padding:0">${taxDetails}</td></tr>
                        <tr class="grand-total"><td>Grand Total:</td><td style="text-align:right">₹ ${grandTotal}</td></tr>
                    </table>
                </div>
            </div>

            <div class="footer">
                <div style="text-align:left">
                    <br><br>
                    <p>Customer Signature</p>
                </div>
                <div style="text-align:right">
                    <p>For <b>YOUR FIRM NAME</b></p>
                    <br><br>
                    <p>Authorised Signatory</p>
                </div>
            </div>
        </div>`;
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Invoice_${invNo}</title>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; background:#f0f0f0; margin:0; padding:0; }
                .invoice-container { background:#fff; width:210mm; min-height:297mm; margin:10px auto; padding:15mm; box-sizing:border-box; box-shadow:0 0 10px rgba(0,0,0,0.1); }
                .header { display:flex; justify-content:space-between; align-items:flex-start; }
                .copy-title { border:1px solid #000; padding:3px 8px; font-size:10px; font-weight:bold; display:inline-block; }
                .section-label { font-size:10px; color:#666; font-weight:bold; margin-bottom:5px; }
                .party-name { font-size:16px; font-weight:bold; margin-bottom:2px; }
                .party-addr, .party-gst { font-size:12px; color:#333; }
                .details-table { width:100%; border-collapse:collapse; margin:10px 0; }
                .items-table { width:100%; border-collapse:collapse; margin:20px 0; }
                .items-table th { background:#f8f9fa; border:1px solid #dee2e6; padding:8px; font-size:12px; text-transform:uppercase; }
                .items-table td { border:1px solid #dee2e6; padding:8px; font-size:12px; }
                .summary-table { width:100%; font-size:12px; }
                .summary-table td { padding:5px 0; }
                .grand-total { font-size:16px; font-weight:bold; border-top:2px solid #000; color:#0d6efd; }
                .footer { display:flex; justify-content:space-between; margin-top:50px; font-size:12px; }
                @media print {
                    body { background:none; }
                    .invoice-container { margin:0; box-shadow:none; width:100%; }
                }
            </style>
        </head>
        <body>${finalHtml}</body>
        </html>`);
    
    printWindow.document.close();
}

function saveBill() {
    const gstin = document.getElementById('custGstin').value.toUpperCase().trim();
    const name = document.getElementById('custName').value.trim();
    const pos = document.getElementById('pos').value;

    // Nayi Multi-field Address values uthao
    const addr_bldg = document.getElementById('addr_building').value.trim();
    const addr_str = document.getElementById('addr_street').value.trim();
    const addr_cty = document.getElementById('addr_city').value.trim();
    const addr_pin = document.getElementById('addr_pincode').value.trim();

    // Validation: GSTIN aur Name toh mandatory hain hi
    if (gstin.length === 15 && name) {
        // Object mein naya structure save karo
        partyHistory[gstin] = { 
            name: name, 
            pos: pos, 
            addr_building: addr_bldg,
            addr_street: addr_str,
            addr_city: addr_cty,
            addr_pincode: addr_pin
        };

        // Local Storage mein update karo
        localStorage.setItem('partyHistory', JSON.stringify(partyHistory));
        
        alert("Success: Party '" + name + "' saved with full address details!");
    } else {
        alert("Error: Please provide at least a valid 15-digit GSTIN and Party Name.");
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
