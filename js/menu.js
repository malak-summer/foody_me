
// Initialize the cart
let cart = [];

// Function to add item to the cart
function addToCart(itemName, itemPrice) {
  const itemIndex = cart.findIndex(item => item.name === itemName); //findout if the item is already there
  if (itemIndex > -1) {
      cart[itemIndex].quantity += 1;
  } else {
      cart.push({ name: itemName, quantity: 1, price: itemPrice });
  }
  updateCartCount();
  saveCart();
}

function redirectToOrder() {
  window.location.href = 'carte.html';
}
// Function to update the cart count display
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountElement.textContent = totalItems;
}

// Function to save cart to local storage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart from local storage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartCount();
  }
}

// Function to load menu items from the server
function loadMenu() {
  fetch('../php/get_menu.php', {
            method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
  })
      .then(response => response.json())
      .then(menuItems => {
          const gallery = document.querySelector('.gallery');
          gallery.innerHTML = ''; // Clear existing items

          menuItems.forEach(item => {
              const menuItem = document.createElement('div');
              menuItem.className = 'menu-item';
              menuItem.innerHTML = `
                  <img src="${item.image}" alt="${item.name}">
                  <p>${item.name} - $${item.price}</p>
                  <button type="button" class="btn btn-outline-light" onclick="addToCart('${item.name}', ${item.price})">Add To Cart <i class="fa-solid fa-cart-shopping"></i></button>
              `;
              gallery.appendChild(menuItem);
          });
      })
      .catch(error => console.error('Error loading menu:', error));
}
document.addEventListener('DOMContentLoaded', loadMenu);

document.addEventListener('DOMContentLoaded', loadCart);
