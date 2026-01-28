// 1. Configuration & Data
const myStateCode = "09"; 
const uomList = ["NOS-NUMBERS", "KGS-KILOGRAMS", "PCS-PIECES", "MTR-METERS", "BOX-BOX", "SET-SETS"];

let partyHistory = JSON.parse(localStorage.getItem('partyHistory')) || {
    "09AAACR1234A1Z5": { name: "Ramesh Trading Co.", pos: "09", address: "123, Civil Lines, Kanpur" }
};

// 2. Add Row Function (Includes Units)
function addRow() {
    const table = document.getElementById('itemRows');
    const id = Date.now();
    const unitOptions = uomList.map(u => `<option value="${u.split('-')[0]}">${u}</option>`).join('');
    
    const newRow = `
        <tr id="row_${id}">
            <td class="row-index">${table.rows.length + 1}</td>
            <td><input type="text" class="form-control form-control-sm" placeholder="Item Name"></td>
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
            <td class="no-print"><button class="btn btn-sm text-danger" onclick="removeRow('${id}')">×</button></td>
        </tr>`;
    table.insertAdjacentHTML('beforeend', newRow);
    updateDocLabels();
}

function removeRow(id) {
    document.getElementById(`row_${id}`).remove();
    calculateTotal();
}

// 3. UI Sync (Doc Type & GSTIN)
function updateDocLabels() {
    const type = document.getElementById('docType').value;
    const isExempt = (type === "Bill of Supply");
    document.querySelectorAll('.tax-col, .tax-head').forEach(el => el.style.display = isExempt ? 'none' : '');
    calculateTotal();
}

function verifyGSTIN() {
    const gstin = document.getElementById('custGstin').value.toUpperCase();
    if (partyHistory[gstin]) {
        document.getElementById('custName').value = partyHistory[gstin].name;
        document.getElementById('pos').value = partyHistory[gstin].pos;
        if(document.getElementById('custAddr')) document.getElementById('custAddr').value = partyHistory[gstin].address;
        calculateTotal();
    }
}

// 4. Calculation Engine & Amount in Words
function calculateTotal() {
    let subTotal = 0, totalGst = 0;
    const isExempt = document.getElementById('docType').value === "Bill of Supply";

    document.querySelectorAll('#itemRows tr').forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const gstRate = isExempt ? 0 : parseFloat(row.querySelector('.gstRate').value) || 0;

        const taxable = qty * price;
        const gst = (taxable * gstRate) / 100;
        
        row.querySelector('.rowTotal').value = (taxable + gst).toFixed(2);
        subTotal += taxable;
        totalGst += gst;
    });

    document.getElementById('subTotal').innerText = subTotal.toFixed(2);
    const grandTotal = subTotal + totalGst;
    document.getElementById('grandTotal').innerText = grandTotal.toFixed(2);
    
    // Tax Breakup
    const pos = document.getElementById('pos').value;
    const taxDiv = document.getElementById('taxDetails');
    if (pos === myStateCode) {
        taxDiv.innerHTML = `<div class="d-flex justify-content-between"><span>CGST:</span><span>${(totalGst/2).toFixed(2)}</span></div>
                            <div class="d-flex justify-content-between"><span>SGST:</span><span>${(totalGst/2).toFixed(2)}</span></div>`;
    } else {
        taxDiv.innerHTML = `<div class="d-flex justify-content-between"><span>IGST:</span><span>${totalGst.toFixed(2)}</span></div>`;
    }
    
    document.getElementById('amountInWords').innerText = "Rupees " + grandTotal.toLocaleString('en-IN') + " Only";
}

// 5. THE 3-COPY PRINT LOGIC (MAGIC)
function generate3Copies() {
    const originalContent = document.body.innerHTML;
    const printArea = document.querySelector('.billing-card').cloneNode(true);
    
    // Sabhi inputs ki values ko text mein convert karo taaki print mein dikhe
    printArea.querySelectorAll('input, select, textarea').forEach(el => {
        const val = el.value;
        const span = document.createElement('span');
        span.innerText = val;
        el.parentNode.replaceChild(span, el);
    });

    const copies = ["Original for Recipient", "Duplicate for Transporter", "Triplicate for Supplier"];
    let finalHtml = "";

    copies.forEach((title, index) => {
        let copyNode = printArea.cloneNode(true);
        let label = `<div class="print-label" style="display:block; text-align:right; font-weight:bold; border:1px solid #000; padding:5px; margin-bottom:10px;">${title}</div>`;
        let pageBreak = index > 0 ? 'style="page-break-before:always; margin-top:50px;"' : '';
        finalHtml += `<div ${pageBreak}>${label}${copyNode.innerHTML}</div>`;
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Print Invoice</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="invoice-style.css">
        <style>.no-print { display:none !important; } .print-label { display:block !important; }</style>
        </head><body><div class="container">${finalHtml}</div></body></html>`);
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

function saveBill() {
    const gstin = document.getElementById('custGstin').value.toUpperCase();
    if (gstin.length === 15) {
        partyHistory[gstin] = { 
            name: document.getElementById('custName').value, 
            pos: document.getElementById('pos').value,
            address: document.getElementById('custAddr').value 
        };
        localStorage.setItem('partyHistory', JSON.stringify(partyHistory));
        alert("Invoice Saved!");
    }
}

window.onload = addRow;
