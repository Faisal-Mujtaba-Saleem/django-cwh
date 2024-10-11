// checkout.js

// Get necessary DOM elements.
const checkout_listContainer = document.getElementById('checkout-list-container');
const checkout_list = document.getElementById('checkout-list');
const order_items = document.getElementById('order_items');
const checkout_info_alert = document.getElementById('checkout-info');
const empty_cart_message = document.getElementById('empty-cart-message');
const checkout_form = document.getElementById('checkout-form');

/**
 * Initializes the checkout page by populating the checkout list with products from the cart and checked-out products.
 * If the cart is empty, it displays a message.
 */
function main() {
    // Retrieve the cart and checked-out products from local storage.
    // let cart = localStorage.getItem('cart');
    let checkedout_products = localStorage.getItem('checkedout_products');

    try {
        // // Parse the cart; if it doesn't exist, initialize as empty object.
        // if (cart) {
        //     try {
        //         cart = JSON.parse(cart);
        //     } catch (error) {
        //         console.error('Error parsing cart from localStorage:', error);
        //         cart = {};
        //         localStorage.setItem('cart', JSON.stringify(cart));
        //     }
        // } else {
        //     cart = {};
        // }

        // Parse the checked-out products; if it doesn't exist, initialize as empty object.
        if (checkedout_products) {
            try {
                checkedout_products = JSON.parse(checkedout_products);
            } catch (error) {
                console.error('Error parsing checkedout_products from localStorage:', error);
                checkedout_products = {};
                localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));
            }
        } else {
            checkedout_products = {};
        }

        // Determine if the user navigated from the product view page by checking for 'buynow' items in the cart.
        const cameFromProductView = (
            Object.values(cart).some(product => product.buynow) && document.referrer.includes('productview')
        );

        if (cameFromProductView) {
            console.log('User came from product view page. Merging cart and buynow products...');

            // Merge buynow products into checkedout_products.
            for (const [key, product] of Object.entries(cart)) {
                if (product.buynow) {
                    if (checkedout_products[key]) {
                        checkedout_products[key].qty += product.qty;
                        checkedout_products[key].buynow = true;
                    } else {
                        checkedout_products[key] = { ...product };
                    }
                }
            }

            // Remove buynow flag from merged products to avoid duplication in future checkouts.
            for (const key in checkedout_products) {
                if (checkedout_products.hasOwnProperty(key)) {
                    delete checkedout_products[key].buynow;
                }
            }

            // Clear the buy-now products from the cart after merging.
            for (const key in cart) {
                if (cart.hasOwnProperty(key)) {
                    if (!!cart[key].buynow) {
                        delete cart[key];
                    }
                }
            }
        } else {
            // Merge entire cart into checkedout_products.
            for (const [key, product] of Object.entries(cart)) {
                if (checkedout_products[key]) {
                    checkedout_products[key].qty += product.qty;
                } else {
                    checkedout_products[key] = { ...product };
                }
            }

            // Clear the cart after merging.
            cart = {};
        }

        // Save the updated checkedout_products back to local storage.
        localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));
        localStorage.setItem('cart', JSON.stringify(cart));

        /**
         * Removes a product from the checkout list.
         * @param {string} productKey - The key of the product to be removed.
         */
        function removeCheckoutItem(productKey) {
            if (checkedout_products.hasOwnProperty(productKey)) {
                delete checkedout_products[productKey];
                localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));
                populateCheckoutList();
            } else {
                console.warn(`Product key ${productKey} not found in checkedout_products.`);
            }
        }

        /**
         * Toggles the visibility and content of the checkout info alert.
         * @param {number} checkedout_products_qty - The number of products checked out.
         */
        function toggleCheckoutInfo(checkedout_products_qty = 0) {
            if (checkedout_products_qty > 0) {
                checkout_info_alert.hidden = false;
                checkout_info_alert.innerHTML = `You have successfully checked out <strong>${checkedout_products_qty}</strong> product(s). Enter your details below and place the order. Thanks for shopping with us!`;
            } else {
                checkout_info_alert.innerHTML = ``;
                checkout_info_alert.hidden = true;
            }
        }

        /**
         * Populates the checkout list with the items in the checkedout_products.
         * If the cart is empty, it displays a message.
         */
        function populateCheckoutList() {
            if (!checkout_list) {
                console.error('#checkout-list element not found.');
                return;
            }

            checkout_list.innerHTML = '';
            let checkoutTotal = 0;

            if (Object.keys(checkedout_products).length > 0) {
                let checkout_list_HTML = '';

                for (const productKey in checkedout_products) {
                    if (checkedout_products.hasOwnProperty(productKey)) {
                        const product = checkedout_products[productKey];

                        // Validate product properties
                        if (!product || typeof product.price !== 'number' || !product.name || !product.sku) {
                            console.warn(`Invalid product data for ${productKey}. Skipping.`);
                            continue;
                        }

                        checkoutTotal += product.price * product.qty;

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
                    }
                }

                // Display the total price at the bottom of the checkout list.
                document.getElementById('checkout-total').innerHTML = `<strong>Total:</strong> <span class="badge bg-info text-dark">${checkoutTotal} Rs./-</span>`;

                // Insert the generated HTML into the checkout list element.
                checkout_list.innerHTML = checkout_list_HTML;

                const checkedout_products_qty = Object.keys(checkedout_products).length;
                toggleCheckoutInfo(checkedout_products_qty);
            } else {
                checkout_list.innerHTML = '';
                document.getElementById('checkout-total').innerHTML = '';
                empty_cart_message.hidden = false;
                empty_cart_message.innerText = 'Your cart is empty, please add some items to your cart before checking out!';
                toggleCheckoutInfo();
            }

            // Set the order items value to the JSON string of checked-out products.
            if (order_items) {
                order_items.value = JSON.stringify(checkedout_products, null, 2);
            }

            // Update the cart count and HTML in index.js if necessary.
            // Assuming index.js functions are globally accessible.
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
            if (typeof updateHTMLCartBody === 'function') {
                updateHTMLCartBody();
            }
        }

        // Populate the checkout list on page load.
        populateCheckoutList();

        // Add event listeners for the remove buttons in the checkout list using event delegation.
        if (checkout_list) {
            checkout_list.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('remove-checkout-items-buttons')) {
                    const productKey = e.target.id;
                    removeCheckoutItem(productKey);
                }
            });
        }

        // Add a submit event listener to the checkout form to clear checkedout_products after order submission.
        if (checkout_form) {
            checkout_form.addEventListener('submit', (e) => {
                // Optionally, you can add form validation here.

                // Clear the checked-out products after the order is submitted.
                checkedout_products = {};
                localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));

                // Optionally, redirect to a success page.
            });
        }
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

// Initialize the main function if the current page is the checkout page.
if (window.location.pathname === '/shop/checkout/') {
    main();
}
