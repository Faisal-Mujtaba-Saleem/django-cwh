// index.js

// Get the cart count element from the DOM, which displays the total number of items in the cart.
const cartCount = document.getElementById('cart-count');

// Get the cart content container from the DOM, which holds the cart items list.
const HTML_cart_content = document.querySelector('#cart-content');

// Initialize products array
let products = [];

// Safely parse the 'products' attribute (which is a string) from the DOM and convert it into a JavaScript object.
if (HTML_cart_content && HTML_cart_content.getAttribute('products')) {
    try {
        products = JSON.parse(HTML_cart_content.getAttribute('products')).map(product => {
            return { id: product.pk, ...product.fields };
        });
    } catch (error) {
        console.error('Error parsing products:', error);
    }
} else {
    console.warn('No products attribute found on #cart-content element.');
}

// Retrieve the cart from local storage (if it exists) or initialize it as an empty object.
let cart = localStorage.getItem('cart');

if (!cart) {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
} else {
    try {
        cart = JSON.parse(cart);
    } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update the cart count displayed on the page.
    updateCartCount();
    // Update the HTML to reflect the current cart items.
    updateHTMLCartBody();
}

// Function to add a product to the cart using its product key (ID).
function addToCart(product_key) {
    if (!product_key) {
        console.error('Product key is undefined.');
        return;
    }

    // Check if the product is already in the cart, if so, increase its quantity.
    if (cart[product_key]) {
        cart[product_key].qty += 1;
    } else {
        // If the product is not in the cart, find it in the 'products' array and add it with a quantity of 1.
        const productToBeAdded = products.find(product => product_key === `product_${product.id}`);
        if (productToBeAdded) {
            cart[product_key] = { ...productToBeAdded, qty: 1 };
        } else {
            console.warn(`Product with key ${product_key} not found in products array.`);
            return;
        }
    }

    // Update the cart count in the DOM.
    updateCartCount();

    // Save the updated cart to local storage as a string.
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the HTML cart body.
    updateHTMLCartBody();
}

// Function to restore the "Add to Cart" button after removing an item.
function restoreAddToCartButton(product_key) {
    updateCartCount();
    updateHTMLCartBody();

    const element_to_replace = document.getElementById(product_key);
    if (element_to_replace && element_to_replace.tagName === 'BUTTON') {
        console.warn(`Button with ID ${product_key} already exists.`);
        return;
    }

    // Create a new "Add to Cart" button to replace the controls for the removed item.
    const restored_add_to_cart_btn = document.createElement('button');
    restored_add_to_cart_btn.className = 'addToCart-btn btn btn-success';
    restored_add_to_cart_btn.id = product_key;
    restored_add_to_cart_btn.innerText = 'Add to Cart';

    if (element_to_replace) {
        element_to_replace.replaceWith(restored_add_to_cart_btn);
    } else {
        console.warn(`Element with ID ${product_key} not found.`);
    }

    // Attach a click event listener to the new "Add to Cart" button.
    attachClickListenersToAddToCartButtons();
}

// Function to update the product controls (buttons for increasing/decreasing quantity) in the DOM.
function updateCart(product_controls_container, product_key) {
    if (!product_controls_container || !product_key) {
        console.error('Invalid arguments passed to updateCart.');
        return;
    }

    // Replace the "Add to Cart" button with controls for increasing/decreasing quantity and displaying the current quantity.
    product_controls_container.innerHTML = `
        <div id="${product_key}" class="button-group d-inline" role="group" aria-label="Product quantity controls">
            <button type="button" id="add_${product_key}" class="add_product_btn btn btn-primary">+</button>
            <span id="product-count_${product_key}" class="my-auto">${cart[product_key].qty}</span>
            <button type="button" id="reduce_${product_key}" class="reduce_product_btn btn btn-danger">-</button>
        </div>
    `;

    // Function to update the displayed quantity of the product in the DOM.
    function updateProductCount() {
        const countElement = document.getElementById(`product-count_${product_key}`);
        if (countElement) {
            countElement.innerText = cart[product_key] ? cart[product_key].qty : 0;
        }
    }

    // Attach event listeners to the increment and decrement buttons.
    const addButton = document.getElementById(`add_${product_key}`);
    const reduceButton = document.getElementById(`reduce_${product_key}`);

    if (addButton) {
        addButton.addEventListener('click', () => {
            cart[product_key].qty += 1;
            updateCartCount();
            updateProductCount();
            updateHTMLCartBody();
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    } else {
        console.warn(`Add button for ${product_key} not found.`);
    }

    if (reduceButton) {
        reduceButton.addEventListener('click', () => {
            if (cart[product_key]?.qty > 1) {
                cart[product_key].qty -= 1;
                updateCartCount();
                updateProductCount();
                updateHTMLCartBody();
                localStorage.setItem('cart', JSON.stringify(cart));
            } else {
                delete cart[product_key];
                localStorage.setItem('cart', JSON.stringify(cart));
                restoreAddToCartButton(product_key);
            }
        });
    } else {
        console.warn(`Reduce button for ${product_key} not found.`);
    }
}

// Function to update the total count of products in the cart and display it in the DOM.
function updateCartCount() {
    let total_products_in_cart = 0;

    for (const product_key in cart) {
        if (cart.hasOwnProperty(product_key)) {
            const product_count = cart[product_key].qty;
            total_products_in_cart += product_count;
        }
    }

    cartCount.innerText = total_products_in_cart;
}

// Function to update the HTML content of the cart body, which displays the list of items.
function updateHTMLCartBody() {
    if (!HTML_cart_content) {
        console.error('#cart-content element not found.');
        return;
    }

    if (Object.keys(cart).length > 0) {
        HTML_cart_content.innerHTML = `
            <ol id="cart-items-list" class="list-group list-group-numbered"></ol>
        `;

        const cart_items_list = document.getElementById('cart-items-list');
        const clearCartBtn = document.getElementById('clear-cart-btn');

        if (!cart_items_list) {
            console.error('#cart-items-list element not found.');
            return;
        }

        let list_items = ``;
        let addToCart_total = 0;

        for (const product_key in cart) {
            if (cart.hasOwnProperty(product_key)) {
                const product = cart[product_key];

                // Validate product properties
                if (!product || typeof product.price !== 'number' || !product.name || !product.sku) {
                    console.warn(`Invalid product data for ${product_key}. Skipping.`);
                    continue;
                }

                addToCart_total += product.price * product.qty;

                list_items += `
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">${product.name}</div>
                            <div class="fw-bold">SKU: ${product.sku}</div>
                            <p class="m-0">
                                Price: <span class="badge bg-secondary">${product.price} Rs./-</span>
                            </p>
                            <p class="m-0">
                                Total: <span class="badge bg-info text-dark">${product.price * product.qty} Rs./-</span>
                            </p>
                        </div>

                        <div class="d-flex flex-column justify-content-between align-items-end align-self-stretch"> 
                            <!-- Quantity -->
                            <span class="badge bg-primary rounded-pill">${product.qty}</span>
                            <!-- Remove Item Button -->
                            <button class="btn btn-danger btn-sm ms-3 remove-cart-item-btn" data-product-key="${product_key}">Remove</button>
                        </div>
                    </li>
                `;
            }
        }

        cart_items_list.innerHTML = list_items;

        // Create a container for the total price at the bottom of the cart.
        const addToCart_total_container = document.createElement('div');
        addToCart_total_container.className = "list-group-item d-flex justify-content-between align-items-center text-light font-weight-bold mt-4";
        addToCart_total_container.innerHTML = `
            <span class="fs-5">
                <strong>Grand Total:</strong>
            </span>
            <span class="badge bg-info text-dark fs-6 lh-base">${addToCart_total} Rs./-</span>
        `;

        HTML_cart_content.appendChild(addToCart_total_container);

        // Attach event listeners to the remove buttons.
        attachRemoveCartItemListeners();

        // Attach event listener to the "Clear Cart" button.
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the entire cart?')) {
                    clearCart();
                }
            });
        }
    } else {
        HTML_cart_content.innerHTML = `
            <p class="text-success">Your cart is empty.</p>
        `;
    }
}

// Function to remove a specific item from the cart.
function removeCartItem(product_key) {
    if (cart.hasOwnProperty(product_key)) {
        delete cart[product_key];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateHTMLCartBody();
    } else {
        console.warn(`Product key ${product_key} not found in cart.`);
    }
}

// Function to clear the entire cart.
function clearCart() {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateHTMLCartBody();
}

// Function to attach event listeners to "Remove" buttons in the cart.
function attachRemoveCartItemListeners() {
    const removeButtons = document.querySelectorAll('.remove-cart-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product_key = e.target.getAttribute('data-product-key');
            removeCartItem(product_key);
        });
    });
}

// Function to attach event listeners to all "Add to Cart" buttons on the page.
function attachClickListenersToAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.addToCart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product_key = e.target.id;
            const product_controls_container = document.getElementById(`product-controls_${product_key.split('_')[1]}`);
            addToCart(product_key);
            if (product_controls_container) {
                updateCart(product_controls_container, product_key);
            }
            updateHTMLCartBody();
        });
    });
}

// Initialize the cart UI for products already in the cart.
products.forEach(product => {
    const product_key = `product_${product.id}`;
    const product_controls_container = document.getElementById(`product-controls_${product.id}`);

    // If the product is already in the cart, update the product controls (buttons for quantity management).
    if (cart[product_key] && product_controls_container !== null) {
        updateCart(product_controls_container, product_key);
    }
});

// Initial attachment of click listeners to "Add to Cart" buttons.
attachClickListenersToAddToCartButtons();
