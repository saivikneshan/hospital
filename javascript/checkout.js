let cartData = JSON.parse(localStorage.getItem('cartData')) || [];
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

const cartTableBody = document.getElementById('cartTableBody');
const totalPriceElement = document.getElementById('totalPrice');
const paymentMethodDropdown = document.getElementById('paymentMethod');
const cardDetailsSection = document.getElementById('cardDetails');
const checkoutForm = document.getElementById('checkoutForm');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const addressField = document.getElementById('address');
const phoneField = document.getElementById('phone');
const cardNumberField = document.getElementById('cardNumber');
const expiryDateField = document.getElementById('expiryDate');
const cvvField = document.getElementById('cvv');

function populateCart() {
    cartData.forEach((item, index) => {
        let row = cartTableBody.insertRow();
        row.insertCell(0).textContent = item.productName;
        row.insertCell(1).textContent = item.price;
        row.insertCell(2).textContent = item.quantity;
        row.insertCell(3).textContent = item.total;

        //  Remove button
        let removeButtonCell = row.insertCell(4);
        let removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.classList.add('remove-btn');

        removeButton.addEventListener('click', function () {
            row.remove();
            let itemTotal = parseFloat(item.total.replace('$', ''));
            totalPrice -= itemTotal;

            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;

            cartData.splice(index, 1);

            localStorage.setItem('cartData', JSON.stringify(cartData));
            localStorage.setItem('totalPrice', totalPrice.toFixed(2));
        });

        removeButtonCell.appendChild(removeButton);
    });

    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Validates the name 
function validateName(event) {
    const name = event.target.value;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!nameRegex.test(name)) {
        alert("Please enter a valid name (letters and spaces only).");
        event.target.value = name.replace(/[^a-zA-Z\s]/g, '');
    }
}

// Validates the phone number
function validatePhone(event) {
    const phone = event.target.value;
    const phoneRegex = /^[0-9]*$/;

    if (!phoneRegex.test(phone)) {
        alert("Please enter a valid phone number (numbers only).");
        event.target.value = phone.replace(/[^0-9]/g, ''); 
    }

    if (phone.length > 10) {
        alert("Phone number should not exceed 10 digits.");
        event.target.value = phone.slice(0, 10); // Limits input to 10 digits
    }
}

// Validation for expiration date 
function validateExpiryDate() {
    const expiryDate = expiryDateField.value;

    // Check if the format is valid
    const dateRegex = /^\d{4}-\d{2}$/;
    if (!dateRegex.test(expiryDate)) {
        alert("Please enter a valid expiry date in YYYY-MM format.");
        return;
    }

    const [year, month] = expiryDate.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert("Please enter a valid expiry date in the future.");
        expiryDateField.value = ""; // Clear invalid input
    }
}


function togglePaymentMethod() {
    if (paymentMethodDropdown.value === 'card') {
        cardDetailsSection.style.display = 'block';
        cardNumberField.setAttribute('required', true);
        expiryDateField.setAttribute('required', true);
        cvvField.setAttribute('required', true);
    } else {
        cardDetailsSection.style.display = 'none';
        cardNumberField.removeAttribute('required');
        expiryDateField.removeAttribute('required');
        cvvField.removeAttribute('required');
    }
}


function handleFormSubmission(event) {
    event.preventDefault();

    // Cart validation
    if (cartData.length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }

    const name = nameField.value;
    const email = emailField.value;
    const address = addressField.value;
    const phone = phoneField.value;
    const paymentMethod = paymentMethodDropdown.value;

    // Validate card details
    if (paymentMethod === 'card') {
        const cardNumber = cardNumberField.value;
        const expiryDate = expiryDateField.value;
        const cvv = cvvField.value;

        if (!cardNumber || !expiryDate || !cvv) {
            alert("Please fill in all card details.");
            return;
        }
    }

    alert("Order placed successfully!");
    localStorage.clear(); // Clears the cart
    window.location.href = '/thank_you.html'; // Redirects to a thank you page
}

document.addEventListener('DOMContentLoaded', function () {
    populateCart();

    paymentMethodDropdown.addEventListener('change', togglePaymentMethod);
    checkoutForm.addEventListener('submit', handleFormSubmission);

    nameField.addEventListener('input', validateName);
    phoneField.addEventListener('input', validatePhone);
    expiryDateField.addEventListener('blur', validateExpiryDate); // Validate expiry date on blur
});
