let totalPrice = 0;

const buyNowBtn = document.getElementById('buyNowBtn');
const favBtn = document.getElementById('favBtn');
const resetCartBtn = document.getElementById('resetCartBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const cartTableBody = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
const favTabBody = document.getElementById('favtabbody');
const applyfromfavbutton=document.getElementById('applyfromfav')

function fetchProductsAndAssign() {
    const jsonFilePath = './price.json'; 

    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            products = data; 
        })
        .catch(error => {
            console.error('Error fetching products:', error); 
        });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchProductsAndAssign();
});

// update the total price and displays it
function updateTotalPrice() {
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}


function toggleButtons() {
    const buyNowBtn = document.getElementById("buyNowBtn");
    if (buyNowBtn) {
        buyNowBtn.style.display = "none";
    }
    const favBtn = document.getElementById("favBtn");
    if (favBtn) {
        favBtn.hidden = false;
        favBtn.disabled = false; 
    }
}


// Buy Now button
function updateBuyNowButton() {
    buyNowBtn.disabled = cartTableBody.rows.length === 0;
}
function updatefavBtn() {
    favBtn.disabled = cartTableBody.rows.length === 0;
}

// Favorites button 
function updateFavoritesButton() {
    favoritesBtn.disabled = cartTableBody.rows.length === 0;
}

// adds selected product to the cart table
function addToCart(productName, price, quantityId) {
    // Gets the quantity value from the user input
    let quantity = document.getElementById(quantityId).value;

    // Validates quantity from the user input
    if (isNaN(quantity) || quantity <= 0 || quantity % 1 !== 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (quantity < 1 || quantity > 50) {
        alert("Please enter a quantity between 1 and 50.");
        return;
    }

    // To calculate the total price for the product
    let productTotalPrice = price * quantity;

    // to check whether the item already exists in the cart
    let existingRow = Array.from(cartTableBody.rows).find(row => row.cells[0].textContent === productName);

    if (existingRow) {
        // Update existing row
        let currentQuantity = parseInt(existingRow.cells[2].textContent);
        let updatedQuantity = currentQuantity + parseInt(quantity);
        existingRow.cells[2].textContent = updatedQuantity;
        existingRow.cells[3].textContent = `$${(price * updatedQuantity).toFixed(2)}`;
        totalPrice += productTotalPrice;
    } else {
        // Adds new row to the table
        let newRow = cartTableBody.insertRow();
        newRow.innerHTML = `
            <td>${productName}</td>
            <td>$${price.toFixed(2)}</td>
            <td>${quantity}</td>
            <td>$${productTotalPrice.toFixed(2)}</td>
            <td><button class="remove-btn">Remove</button></td>
        `;
        newRow.querySelector('.remove-btn').addEventListener('click', function () {
            let rowTotal = parseFloat(newRow.cells[3].textContent.replace('$', ''));
            totalPrice -= rowTotal;
            newRow.remove();
            updateTotalPrice();
            updateBuyNowButton();
            updatefavBtn();
            updateFavoritesButton();
        });

        totalPrice += productTotalPrice;
    }

    updateTotalPrice();
    updateBuyNowButton();
    updatefavBtn();
    updateFavoritesButton();
    document.getElementById(quantityId).value = '';
}

document.querySelectorAll('.add-to-cart').forEach((button, index) => {
    button.addEventListener('click', () => {
        let productId = button.closest('.medicine-item').querySelector('input').id;
        addToCart(products[index].name, products[index].price, productId);
    });
});



function processbuynow(){
    if (cartTableBody.rows.length === 0) {
        alert("Your cart is empty. Please add items to the cart before proceeding.");
        return;
    }
    let cartData = Array.from(cartTableBody.rows).map(row => ({
        productName: row.cells[0].textContent,
        price: row.cells[1].textContent,
        quantity: row.cells[2].textContent,
        total: row.cells[3].textContent
    }));
    localStorage.setItem('cartData', JSON.stringify(cartData));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));
    window.location.href = '/checkout.html';
}

function resetcartbtnfunction(){
    if (confirm("Are you sure you want to reset the cart? All items will be removed.")) {
        cartTableBody.innerHTML = '';
        totalPrice = 0;
        updateTotalPrice();
        updateBuyNowButton();
        updatefavBtn();
        updateFavoritesButton();
        localStorage.removeItem('cartData');
        localStorage.removeItem('totalPrice');
    }
}



function favebtnftn(){
    if (confirm("Would you like to save these items to your favorites?")) {
        let favorites = Array.from(cartTableBody.rows).map(row => ({
            productName: row.cells[0].textContent,
            price: row.cells[1].textContent,
            quantity: row.cells[2].textContent,
            total: row.cells[3].textContent
        }));
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert("Items have been saved to favorites.");
    }
}


// Function to display favorite items
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    cartTableBody.innerHTML = ''; 
    totalPrice = 0; 

    favorites.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total}</td>
            <td><button onclick="removeFavorite(${index})">Remove</button></td>
        `;
        cartTableBody.appendChild(row);

        totalPrice += parseFloat(item.total.replace('$', ''));
    });

    updateTotalPrice(); 
    toggleButtons(); 
}

// Function to move favorite items to the cart
function movefavtocheckout(){
    if (confirm("Would you like to move your favorites to the checkout page?")) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.length === 0) {
            alert("No favorite items to move.");
            return;
        }

        // Save favorite items to localStorage as cart data
        localStorage.setItem('cartData', JSON.stringify(favorites));

        // Calculate the total price of favorite items
        let newTotalPrice = favorites.reduce((acc, item) => acc + parseFloat(item.total.replace('$', '')), 0);
        localStorage.setItem('totalPrice', newTotalPrice.toFixed(2));

        // Redirect to the checkout page
        alert("Favorite items moved to the checkout page.");
        window.location.href = '/checkout.html';
    }

}

// Function to remove a favorite item
function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

applyfromfavbutton.addEventListener("click", displayFavorites )
buyNowBtn.addEventListener('click', processbuynow )
favBtn.addEventListener('click', movefavtocheckout)
resetCartBtn.addEventListener('click', resetcartbtnfunction )
favoritesBtn.addEventListener('click', favebtnftn)
