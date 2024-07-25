//Authentication check
document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/adminControl/check_auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                window.location.href = '../html/login.html'; //Rediect to login
            } else {
                loadTableData('coupons', 'couponsTable');
                loadTableData('menu_items', 'menuItemsTable');
                loadTableData('orders', 'ordersTable');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


//Data and control functions

function loadTableData(table, tableId, statusFilter = '') {
    let url = `../php/adminControl/get_data.php?table=${table}`;
    
    // Add status filter to the URL if the table is 'orders'
    if (table === 'orders' && statusFilter) {
        url += `&status=${statusFilter}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(tableId).querySelector('tbody');
            
            // Check for success/error in response
            if (data.success === false) {
                console.error(data.error);
                return;
            }

            tableBody.innerHTML = data.map(row => {
                let inputs = '';
                let action = `<button class="btn btn-primary btn-sm" onclick="updateRow('${table}', ${row.id})">Save</button>`;
                let deleteButton = `<button class="btn btn-danger btn-sm" onclick="deleteRow('${table}', ${row.id})">Delete</button>`;
                
                if (table === 'coupons') {
                    inputs = `
                        <td><input type="text" class="form-control" value="${row.code}" data-id="${row.id}" data-field="code"></td>
                        <td><input type="date" class="form-control" value="${row.expiry_date}" data-id="${row.id}" data-field="expiry_date"></td>
                        <td><input type="number" class="form-control" value="${row.usage_limit}" data-id="${row.id}" data-field="usage_limit"></td>
                        <td>${action} ${deleteButton}</td>
                    `;
                } else if (table === 'menu_items') {
                    inputs = `
                        <td><input type="text" class="form-control" value="${row.name}" data-id="${row.id}" data-field="name"></td>
                        <td><input type="number" class="form-control" value="${row.price}" data-id="${row.id}" data-field="price"></td>
                        <td><input type="text" class="form-control" value="${row.image}" data-id="${row.id}" data-field="price"></td>
                        <td>${action} ${deleteButton}</td>
                    `;
                } else if (table === 'orders') {
                    const cartItemsFormatted = formatCartItems(row.cart_items, row.id);
                    inputs = `
                        <td><input type="email" class="form-control" value="${row.customer_email}" data-id="${row.id}" data-field="customer_email"></td>
                        <td><input type="text" class="form-control" value="${row.customer_phone}" data-id="${row.id}" data-field="customer_phone"></td>
                        <td><input type="text" class="form-control" value="${row.customer_address}" data-id="${row.id}" data-field="customer_address"></td>
                        <td>
                            <div class="cart-items-container">
                                <table class="cart-items-table">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody id="cart-items-${row.id}">
                                        ${cartItemsFormatted}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                        <td><input type="number" class="form-control" value="${row.total}" data-id="${row.id}" data-field="total"></td>
                        <td>
                            <select class="form-control" data-id="${row.id}" data-field="status">
                                <option value="pending" ${row.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="validated" ${row.status === 'validated' ? 'selected' : ''}>Validated</option>
                            </select>
                        </td>
                        <td>${action} ${deleteButton}</td>
                    `;
                }
                return `<tr>${inputs}</tr>`;
            }).join('');
        });
}


function updateRow(table, id) {
    let data = {};
    
    if (table === 'coupons') {
        const codeInput = document.querySelector(`input[data-id="${id}"][data-field="code"]`);
        const expiryDateInput = document.querySelector(`input[data-id="${id}"][data-field="expiry_date"]`);
        const usageLimitInput = document.querySelector(`input[data-id="${id}"][data-field="usage_limit"]`);

        data = {
            code: codeInput.value,
            expiry_date: expiryDateInput.value,
            usage_limit: usageLimitInput.value
        };
    } else if (table === 'menu_items') {
        const nameInput = document.querySelector(`input[data-id="${id}"][data-field="name"]`);
        const priceInput = document.querySelector(`input[data-id="${id}"][data-field="price"]`);

        data = {
            name: nameInput.value,
            price: priceInput.value
        };
    } else if (table === 'orders') {
        const customerEmailInput = document.querySelector(`input[data-id="${id}"][data-field="customer_email"]`);
        const customerPhoneInput = document.querySelector(`input[data-id="${id}"][data-field="customer_phone"]`);
        const customerAddressInput = document.querySelector(`input[data-id="${id}"][data-field="customer_address"]`);
        const totalInput = document.querySelector(`input[data-id="${id}"][data-field="total"]`);
        const statusSelect = document.querySelector(`select[data-id="${id}"][data-field="status"]`);

        data = {
            customer_email: customerEmailInput.value,
            customer_phone: customerPhoneInput.value,
            customer_address: customerAddressInput.value,
            total: totalInput.value,
            status: statusSelect.value
        };
    }

    fetch('../php/adminControl/update_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id, data })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Update successful');
            loadTableData(table, `${table}Table`, document.getElementById('statusFilter').value);
        } else {
            alert('Update failed: ' + result.error);
        }
    });
}

function saveCouponRow(button) {
    const code = document.getElementById('couponCode').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const usageLimit = document.getElementById('usageLimit').value;

    fetch('../php/adminControl/add_coupon.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, expiry_date: expiryDate, usage_limit: usageLimit })
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Coupon added successfully');
            // Optionally reload the table or form
            loadTableData('coupons', 'couponsTable'); // Reload the coupons table
        } else {
            alert('Add coupon failed: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function saveMenuItemRow(button) {
    const row = button.closest('tr');
    const name = row.querySelector('input[placeholder="Name"]').value;
    const price = row.querySelector('input[placeholder="Price"]').value;
    const fileInput = row.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!name || !price || !file) {
        alert('Please fill all fields and select an image.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', file);

    fetch('../php/adminControl/add_menu_item.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Menu item added successfully!');
            loadTableData('menu_items', 'menuItemsTable');
            ; 
        } else {
            alert('Failed to add menu item: ' + result.error);
        }
    });
}

function deleteRow(table, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch('../php/adminControl/delete_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: table, id: id })
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                alert('Item deleted successfully');
                if (table=='menu_items'){
                    loadTableData('menu_items', `menuItemsTable`)
                }
                else{
                    loadTableData(table, `${table}Table`)
                }
            } else {
                alert('Delete failed: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}


//Display functions

function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    loadTableData('orders', 'ordersTable', statusFilter);
}
function deleteRow_draft(button) {
    const row = button.closest('tr');
    row.remove();
}
function addCouponRow() {
    const tableBody = document.getElementById('couponsTable').querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="form-control" placeholder="Coupon Code" id="couponCode"></td>
        <td><input type="date" class="form-control" placeholder="Expiry Date" id="expiryDate"></td>
        <td><input type="number" class="form-control" placeholder="Usage Limit" id="usageLimit"></td>
        <td>
            <button class="btn btn-success btn-sm" onclick="saveCouponRow(this)">Save</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRow_draft(this)">X</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

function addMenuItemRow() {
    const tableBody = document.getElementById('menuItemsTable').querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="form-control" placeholder="Name"></td>
        <td><input type="number" class="form-control" placeholder="Price"></td>
        <td><input type="file" class="form-control" accept="image/*"></td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="saveMenuItemRow(this)">Save</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRow_draft(this)">X</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

function formatCartItems(cartItems, orderId) {
    try {
        const items = JSON.parse(cartItems);
        return items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('Error parsing cart items:', e);
        return '';
    }
}

