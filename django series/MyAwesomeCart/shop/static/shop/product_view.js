const preview_product_container = document.querySelector('#preview-product');
const buynow_btn = document.querySelector('.buy-now-button');

function main() {
    // Parse the preview product data from the container and format it
    let preview_product = JSON.parse(preview_product_container.value)[0];
    preview_product = { pk: preview_product.pk, ...preview_product.fields };
    console.log(preview_product);

    // Create a unique key for the product based on its primary key (pk)
    const productKey = `product_${preview_product.pk}`;

    // Get checked out products from local storage
    let checkedout_products = localStorage.getItem('checkedout_products');

    // Define the product to be checked out with a default quantity of 1
    let buynow_product = { ...preview_product, qty: 1 };

    // Add event listener to the Buy Now button
    buynow_btn.addEventListener('click', (e) => {
        console.log(!!checkedout_products);

        if (checkedout_products) {
            try {
                checkedout_products = JSON.parse(checkedout_products);

                // If the product already exists, update its quantity, otherwise add it to the list
                if (checkedout_products[productKey]) {
                    checkedout_products[productKey].qty += 1;
                } else {
                    checkedout_products[productKey] = buynow_product;
                }

                // Update local storage with the new or updated product
                localStorage.setItem('checkedout_products', JSON.stringify(checkedout_products));
            } catch (error) {
                console.error('Error parsing checkedout_products:', error);
                // In case of an error, initialize the storage with the product
                localStorage.setItem('checkedout_products', JSON.stringify({ [productKey]: buynow_product }));
            }
        } else {
            // If there are no checked-out products in local storage, initialize with the current product
            localStorage.setItem('checkedout_products', JSON.stringify({ [productKey]: buynow_product }));
        }

        // Redirect to the checkout page
        location.href = '/shop/checkout/';
    });
}

// Initialize the main function if the current page is the product view page
if (location.pathname.includes('/shop/productview/')) {
    main();
}
