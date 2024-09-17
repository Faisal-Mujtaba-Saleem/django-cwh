// Get the cart count element from the DOM, which displays the total number of items in the cart.
const cartCount = document.getElementById('cart-count');

// Get all "Add to Cart" buttons from the DOM.
let addToCart_Buttons = document.querySelectorAll('.addToCart-btn');

// Get the cart content container from the DOM, which holds the cart items list.
const HTML_cart_content = document.querySelector('#cart-content');

// Parse the 'products' attribute (which is a string) from the DOM and convert it into a JavaScript object.
let products = JSON.parse(HTML_cart_content.getAttribute('products'));

// Map through the parsed products array to format each product object with 'id' and its other fields.
products = products.map(product => {
    return { id: product.pk, ...product.fields };
});

// Retrieve the cart from local storage (if it exists) or initialize it as an empty object.
let cart = localStorage.getItem('cart');

// If no cart exists in local storage, create an empty cart object.
if (!cart) {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
} else {
    // If a cart exists, parse the stringified cart from local storage into a JavaScript object.
    cart = JSON.parse(cart);

    // Update the cart count displayed on the page.
    updateCartCount();
    // Update the HTML to reflect the current cart items.
    updateHTMLCartBody();
}

// Function to add a product to the cart using its product key (ID).
function addToCart(productKey) {
    // Check if the product is already in the cart, if so, increase its quantity.
    if (!!cart[productKey]) {
        cart[productKey].qty += 1;
    } else {
        // If the product is not in the cart, find it in the 'products' array and add it with a quantity of 1.
        const productToBeAdded = products.find(product => productKey === `product_${product.id}`);
        cart[productKey] = { ...productToBeAdded, qty: 1 };
    }

    // Update the cart count in the DOM.
    updateCartCount();

    // Save the updated cart to local storage as a string.
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the product controls (buttons for increasing/decreasing quantity) in the DOM.
function updateCart(product_controls_container, productKey) {
    // Replace the "Add to Cart" button with controls for increasing/decreasing quantity and displaying the current quantity.
    product_controls_container.innerHTML = `
    <div id="${productKey}" class="button-group d-inline" role="group" aria-label="Basic mixed styles example">
        <button type="button" id="add_${productKey}" class="add_product_btn btn btn-primary">+</button>
        <span id="product-count_${productKey}" class="my-auto">${cart[productKey].qty}</span>
        <button type="button" id="reduce_${productKey}" class="reduce_product_btn btn btn-danger">-</button>
    </div>
    `;

    // Function to update the displayed quantity of the product in the DOM.
    function updateProductCount() {
        document.getElementById(`product-count_${productKey}`).innerText = cart[productKey] ? cart[productKey].qty : 0;
    }

    // Attach event listeners to all increment buttons (for increasing product quantity).
    document.querySelectorAll('.add_product_btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Increase the product quantity in the cart.
            cart[productKey].qty += 1;

            // Update the cart count, product count, and cart body in the DOM.
            updateCartCount();
            updateProductCount();
            updateHTMLCartBody();

            // Save the updated cart to local storage.
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });

    // Attach event listeners to all decrement buttons (for decreasing product quantity).
    document.querySelectorAll('.reduce_product_btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Decrease the product quantity if it's greater than or equal to 1.
            if (cart[productKey] && cart[productKey].qty - 1 > 0) {
                cart[productKey].qty -= 1;

                // Update the cart count, product count, and cart body in the DOM.
                updateCartCount();
                updateProductCount();
                updateHTMLCartBody();

                // Save the updated cart to local storage.
                localStorage.setItem('cart', JSON.stringify(cart));
            } else if (cart[productKey]) {
                delete cart[productKey];
                localStorage.setItem('cart', JSON.stringify(cart));

                updateCartCount();
                updateProductCount();
                updateHTMLCartBody();
            }
        });
    });
}

// Function to update the total count of products in the cart and display it in the DOM.
function updateCartCount() {
    // Initialize the total count of products to zero.
    total_products_in_cart = 0;

    // If the cart is not empty, loop through each product and sum up their quantities.
    if (Object.keys(cart).length > 0) {
        for (const productKey in cart) {
            const product_count = cart[productKey].qty;
            total_products_in_cart += product_count;
        }
    }

    // Update the cart count element in the DOM with the total products count.
    cartCount.innerText = total_products_in_cart;
}

// Function to update the HTML content of the cart body, which displays the list of items.
function updateHTMLCartBody() {
    // Check if the cart contains any items.
    if (Object.keys(cart).length > 0) {
        // If the cart has items, create an ordered list for displaying the items.
        HTML_cart_content.innerHTML = `
        <ol id="cart-items-list" class="list-group list-group-numbered"> </ol>
        `;

        // Get the list element where cart items will be displayed.
        const cart_items_list = document.getElementById('cart-items-list');

        // Initialize a variable to hold the HTML for the list items.
        let list_items = ``;

        // Initialize a variable to hold the total price of all items in the cart.
        let addToCart_total = 0;

        // Loop through each product in the cart and create a list item for it.
        for (const productKey in cart) {
            const product = cart[productKey];

            // Calculate the total price for each product.
            addToCart_total += product.price * product.qty;

            // Append the product details to the list_items string.
            list_items += `
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${product.name}</div>
                    <div class="fw-bold">- ${product.sku}</div>
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
                    <button class="btn btn-danger btn-sm ms-3" onclick="removeCartItem('product_${product.id}')">Remove</button>
                </div>
            </li>
            `;
        }

        // Set the innerHTML of the cart_items_list to the generated list items.
        cart_items_list.innerHTML = list_items;

        // Create a container for the total price at the bottom of the cart.
        const addToCart_total_container = document.createElement('div');

        // Add the necessary classes to the total price container.
        addToCart_total_container.className = "list-group-item d-flex justify-content-between align-items-center text-light font-weight-bold mt-4";

        // Set the innerHTML of the total price container with the total amount.
        addToCart_total_container.innerHTML = `
        <span class="fs-5">
            <strong>Grand Total:</strong>
        </span>
        <span class="badge bg-info text-dark fs-6 lh-base">${addToCart_total} Rs./-</span>
`;

        // Append the total price container to the cart content.
        HTML_cart_content.appendChild(addToCart_total_container);
    } else {
        // If the cart is empty, clear the cart content in the DOM.
        HTML_cart_content.innerHTML = ``;
    }
}

// Function to remove a specific item from the cart.
function removeCartItem(productKey) {
    // Delete the product from the cart object.
    delete cart[productKey];

    // Update the cart count and cart body in the DOM.
    updateCartCount();
    updateHTMLCartBody();

    // Create a new "Add to Cart" button to replace the controls for the removed item.
    const restored_add_to_cart_btn = document.createElement('button');
    restored_add_to_cart_btn.className = 'addToCart-btn btn btn-success';
    restored_add_to_cart_btn.id = productKey;
    restored_add_to_cart_btn.innerText = 'Add to Cart';

    // Replace the current controls with the new "Add to Cart" button.
    document.getElementById(productKey).replaceWith(restored_add_to_cart_btn);

    // Attach a click event listener to the new "Add to Cart" button.
    restored_add_to_cart_btn.addEventListener('click', (e) => {
        // Get the product key (ID) of the clicked button's associated product.
        const product_controls_container = e.target.parentElement;
        const productKey = e.target.id;

        // Add the product to the cart and update the product controls (buttons for quantity management).
        addToCart(productKey);
        updateCart(product_controls_container, productKey);
    });

    // Save the updated cart to local storage.
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to remove an item during checkout (similar to removeCartItem but for checkout page).
function removeCheckoutItem(productKey) {
    // Delete the product from the cart.
    delete cart[productKey];

    // Update the cart count and cart body in the DOM.
    updateCartCount();
    updateHTMLCartBody();

    // Save the updated cart to local storage.
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
    updateHTMLCartBody();
}

products.forEach(product => {
    const productKey = `product_${product.id}`;
    const product_controls_container = document.getElementById(`product-controls_${product.id}`);

    if (!!cart[productKey] && product_controls_container !== null) {
        console.log(cart[productKey]);

        updateCart(product_controls_container, productKey);
    }
});

// Attach click event listeners to all "Add to Cart" buttons on the page.
addToCart_Buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Get the product key (ID) of the clicked button's associated product.
        const product_controls_container = e.target.parentElement;
        const productKey = e.target.id;

        // Add the product to the cart and update the product controls (buttons for quantity management).
        addToCart(productKey);
        updateCart(product_controls_container, productKey);
        updateHTMLCartBody();
    });
});
