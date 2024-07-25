// Initialize cart and load from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const appliedCoupons = JSON.parse(localStorage.getItem('appliedCoupons')) || [];

function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            
            <div class="cart-item-controls">
                <button class="cart-item-decrease" data-index="${index}">-</button>
                <div>${item.quantity}</div>
                <button class="cart-item-increase" data-index="${index}">+</button>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
        </div>
    `).join('');

    // Reattach event listeners after DOM update
    attachEventListeners();
}

function updateTotals() {
    fetch('../php/order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `cart_items=${JSON.stringify(cart)}&appliedCoupons=${JSON.stringify(appliedCoupons)}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('cart-subtotal').textContent = `$${data.subtotal}`;
        document.getElementById('cart-discount').textContent = `$${data.discount}`;
        document.getElementById('cart-shipping').textContent = `$${data.shipping}`;
        document.getElementById('cart-total').textContent = `$${data.total}`;
    })
    .catch(error => {
        console.error('Error updating totals:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateTotals();
});

function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
    
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || [];
    
    const isCouponAlreadyApplied = appliedCoupons.some(coupon => coupon.code === couponCode);
    const isCouponAlreadyUsed = usedCoupons.some(coupon => coupon.code === couponCode);

    if (isCouponAlreadyApplied || isCouponAlreadyUsed) {
        alert('Coupon has already been applied or used.');
        return;
    }

    fetch('../php/verify_coupon.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `coupon_code=${couponCode}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            appliedCoupons.push({ code: couponCode, value: data.discount, type: data.type, used: false });
            localStorage.setItem('appliedCoupons', JSON.stringify(appliedCoupons));

            updateTotals();
            alert('Coupon applied successfully!');
            
        } else {
            alert(data.message); // Display error message from server
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function attachEventListeners() {
    document.querySelectorAll('.cart-item-increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.cart-item-decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeItem);
    });
    document.querySelector('.checkout-button').addEventListener('click', processCheckout);

}

function increaseQuantity(event) {
    const index = event.target.getAttribute('data-index');
    if (cart[index]) {
        cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateTotals();
    }
}

function decreaseQuantity(event) {
    const index = event.target.getAttribute('data-index');
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateTotals();
    }
}

function removeItem(event) {
    const index = event.target.getAttribute('data-index');
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateTotals();
    }
}
document.querySelector('.coupon-apply-button').addEventListener('click', applyCoupon);

function processCheckout() {
    const customerEmail = document.getElementById('customer-email').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const customerAddress = document.getElementById('customer-address').value.trim();

    if (!customerEmail || !customerPhone || !customerAddress) {
        alert('Please fill in all the details.');
        return;
    }

    const total = parseFloat(document.getElementById('cart-total').textContent.replace('$', ''));

    fetch('../php/checkout.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `customer_email=${encodeURIComponent(customerEmail)}&customer_phone=${encodeURIComponent(customerPhone)}&customer_address=${encodeURIComponent(customerAddress)}&cart_items=${encodeURIComponent(JSON.stringify(cart))}&total=${total}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = '../html/order_successful.html';
            localStorage.removeItem('cart'); // Clear the cart after successful order
        } else {
            alert('There was an error processing your order.');
        }
    })
    .catch(error => {
        console.error('Error saving order:', error);
    });
}

