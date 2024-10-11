// productview.js

const preview_product_container = document.querySelector('#preview-product');
const buynow_btn = document.querySelector('.buy-now-button');

function main() {
    if (!preview_product_container) {
        console.error('#preview-product element not found.');
        return;
    }

    let preview_product;
    try {
        preview_product = JSON.parse(preview_product_container.value)[0];
        preview_product = { pk: preview_product.pk, ...preview_product.fields };
    } catch (error) {
        console.error('Error parsing preview product:', error);
        return;
    }

    const product_key = `product_${preview_product.pk}`;

    // Retrieve the cart from local storage.
    let cart = localStorage.getItem('cart');
    if (cart) {
        try {
            cart = JSON.parse(cart);
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            cart = {};
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    } else {
        cart = {};
    }

    // Define the product to be checked out with a default quantity of 1 and buynow flag.
    let buynow_product = { ...preview_product, qty: 1, buynow: true };

    // Add event listener to the Buy Now button.
    buynow_btn.addEventListener('click', (e) => {
        if (!buynow_product) {
            console.error('buynow_product is undefined.');
            return;
        }

        if (cart[product_key]) {
            cart[product_key].qty += 1;
            cart[product_key].buynow = true;
        } else {
            cart[product_key] = buynow_product;
        }

        // Save the updated cart to local storage.
        localStorage.setItem('cart', JSON.stringify(cart));

        // Redirect to the checkout page.
        window.location.href = '/shop/checkout/';
    });
}

// Initialize the main function if the current page is the product view page.
if (window.location.pathname.includes('/shop/productview/')) {
    main();
}
