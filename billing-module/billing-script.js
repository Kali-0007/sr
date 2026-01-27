// Function to add a new row in the table
function addRow() {
    const table = document.getElementById('itemRows');
    const newRow = `
        <tr>
            <td><input type="text" class="form-control form-control-sm" placeholder="Item Name"></td>
            <td><input type="text" class="form-control form-control-sm" placeholder="Code"></td>
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
        </tr>`;
    table.insertAdjacentHTML('beforeend', newRow);
}

// Function to calculate all totals
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

    document.getElementById('subTotal').innerText = subTotal.toFixed(2);
    document.getElementById('totalGst').innerText = totalGst.toFixed(2);
    document.getElementById('grandTotal').innerText = (subTotal + totalGst).toFixed(2);
}
// Function to determine Tax Split (CGST/SGST or IGST)
function getTaxSplit() {
    const userState = "09-Uttar Pradesh"; // Ye hum baad mein profile se uthayenge
    const pos = document.getElementById('pos').value;
    const totalGst = parseFloat(document.getElementById('totalGst').innerText);

    let splitDetails = "";

    if (pos === "") {
        splitDetails = "Please select Place of Supply";
    } else if (pos === userState) {
        // Same State: Split into CGST & SGST
        const cgst = totalGst / 2;
        const sgst = totalGst / 2;
        splitDetails = `CGST: ₹${cgst.toFixed(2)} | SGST: ₹${sgst.toFixed(2)}`;
    } else {
        // Different State: Full IGST
        splitDetails = `IGST: ₹${totalGst.toFixed(2)}`;
    }

    // Isko display karne ke liye hum HTML mein ek chota div aur add karenge
    document.getElementById('taxBreakup').innerText = splitDetails;
}
