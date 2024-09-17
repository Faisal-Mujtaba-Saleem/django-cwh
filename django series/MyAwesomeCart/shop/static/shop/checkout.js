// Get the checkout list container element from the DOM
const checkout_listContainer = document.getElementById('checkout-list-container');

// Get the checkout list element where products will be displayed
const checkout_list = document.getElementById('checkout-list');

// Get the hidden input element that stores the order items as JSON
const order_items = document.getElementById('order_items');

const checkout_info_alert = document.getElementById('checkout-info');

// Get the empty cart message element to display when no items are in the cart
const empty_cart_message = document.getElementById('empty-cart-message');

// Get the checkout form element from the DOM
const checkout_form = document.getElementById('checkout-form');

function main() {
    // Get the checked-out products from local storage
    let checkedout_products = localStorage.getItem('checkedout_products');

    try {
        // If there are checked-out products in local storage, parse them
        if (checkedout_products) {
            checkedout_products = JSON.parse(checkedout_products);

            // Merge the checked-out products and the cart products
            for (const [key, value] of Object.entries(cart)) {
                if (checkedout_products[key]) {
                    checkedout_products[key].qty += value.qty;
                } else {
                    checkedout_products[key] = value;
                }
            }
        } else {
            // If no checked-out products, initialize with the current cart
            checkedout_products = { ...cart };
            localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));
        }

        /**
         * Removes a product from the checkout list
         * @param {string} productKey the key of the product to be removed
         */
        function removeCheckoutItem(productKey) {
            // Delete the product from the checkedout_products
            delete checkedout_products[productKey];

            // Update the checked-out products in local storage
            localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));

            // Refresh the checkout list after removal
            populateCheckoutList();
        }

        function toggleCheckoutInfo(checkedout_products_qty = 0) {
            is_empty_info = checkout_info_alert.innerText.split('').every(e => e === ' ');
            if (is_empty_info) {

                checkout_info_alert.hidden = false;
                checkout_info_alert.innerHTML = `You have successfully checked out <strong>${checkedout_products_qty}</strong> products. Enter your details below and place the order. Thanks for shopping with us!`;
            } else {
                checkout_info_alert.innerHTML = ``;
                checkout_info_alert.hidden = true;
            }
        }

        /**
         * Populates the checkout list with the items in the cart
         * If the cart is empty, it displays a message
         * @param {Object} checkedout_products - the products in the cart that are to be checked out
         */
        function populateCheckoutList() {
            // Clear the checkout list HTML
            checkout_list.innerHTML = '';
            let checkoutTotal = 0;

            // If there are checked-out products, populate the list
            if (Object.keys(checkedout_products).length > 0) {
                let checkout_list_HTML = '';

                // Loop through the checked-out products and generate HTML
                for (const productKey in checkedout_products) {
                    const product = checkedout_products[productKey];

                    // Create HTML for each product in the checkout list
                    checkout_list_HTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                            <div class="ms-2 me-auto">
                                <div class="fw-bold">${product.name} - ${product.sku}</div>
                                <p class="m-0">
                                    Price: <span class="badge bg-secondary">${product.price} Rs./-</span>
                                </p>
                                <p class="m-0">
                                    Total: <span class="badge bg-info text-dark">${product.price * product.qty} Rs./-</span>
                                </p>
                            </div>

                            <div class="d-flex flex-column justify-content-between align-items-end align-self-stretch">
                                <!-- Display the product quantity -->
                                <span class="badge bg-primary rounded-pill">${product.qty}</span>
                                <!-- Button to remove the product from the checkout list -->
                                <button id="${productKey}" class="remove-checkout-items-buttons btn btn-danger btn-sm ms-3">Remove</button>
                            </div>
                        </li>
                    `;

                    // Calculate the total price for the checkout
                    checkoutTotal += product.price * product.qty;
                }

                // Display the total price at the bottom of the checkout list
                document.getElementById('checkout-total').innerHTML = `<strong>Total:</strong> <span class="badge bg-info text-dark">${checkoutTotal} Rs./-</span>`;

                // Insert the generated HTML into the checkout list element
                checkout_list.innerHTML = checkout_list_HTML;

                let checkedout_products_qty = Object.keys(checkedout_products).length
                toggleCheckoutInfo(checkedout_products_qty);
            } else {
                // If no products, clear the checkout list and show an empty cart message
                checkout_list.innerHTML = '';
                document.getElementById('checkout-total').innerHTML = '';
                empty_cart_message.hidden = false;
                empty_cart_message.innerText = 'Your cart is empty, please add some items to your cart before checking out!';
            }

            // Set the order items value to the JSON string of checked-out products
            order_items.value = JSON.stringify(checkedout_products, null, 2);

            // Clear the cart after checking out
            cart = {};

            // Update cart and checked-out products in local storage
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));

            // Update the cart body and count in the DOM
            updateHTMLCartBody();
            updateCartCount();
        }

        // Populate the checkout list on page load
        populateCheckoutList();

        // Add event listeners for the remove buttons in the checkout list
        checkout_list.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('remove-checkout-items-buttons')) {
                // Remove the clicked product from the checkout list
                removeCheckoutItem(e.target.id);

                if (checkedout_products.length === 0) {
                    toggleCheckoutInfo()
                }
            }
        });

        // Add a submit event listener to the checkout form
        checkout_form.addEventListener('submit', (e) => {
            // Clear the checked-out products after the order is submitted
            checkedout_products = {};
            localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));

            // Log order placed success and current URL for debugging
            console.log('Order placed successfully!', location.href);
        });

    } catch (error) {
        console.log('Error in main function:', error);
    }
}

// Call the main function if the current page is the checkout page
if (location.pathname === '/shop/checkout/') {
    main();
}
