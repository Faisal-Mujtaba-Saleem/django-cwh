// Get the form element used for tracking orders.
const tracking_form = document.getElementById('tracking-form');

// Get the container where the tracked order details will be displayed.
const order_track_container = document.getElementById('order_track_container');

// Get the element that displays a message if no orders are tracked.
const empty_track_message = document.getElementById('empty_track_message');

/**
* Entry point for the tracker page.
*
* This function initializes two inner functions:
* 1. trackOrder: an async function that fetches order data from the server.
* 2. populateTrackedOrder: a sync function that listens for form submission and populates the page with order details.
*
* @returns {void}
*/
function main() {
    // Declare objects to hold order tracking data.
    let order_track = {};
    let tracked_order = {};

    /**
    * Asynchronously sends a POST request to the server to fetch order details.
    * @param {FormData} tracking_data - The tracking data submitted from the form.
    * @returns {Object} - The tracked order data from the server.
    */
    const trackOrder = async (tracking_data) => {
        try {
            let headersList = {
                "Accept": "*/*",
            };

            let response = await fetch("http://localhost:8000/shop/tracker/", {
                method: "POST",
                body: tracking_data,
                headers: headersList
            });

            let data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
            return {};
        }
    };


    /**
    * Adds an event listener to the tracking form to handle form submissions.
    * It sends the tracking data to the server and populates the page with order details.
    */
    function populateTrackedOrder() {
        tracking_form.addEventListener('submit', async (e) => {
            // Prevent the default form submission behavior (i.e., page reload).
            e.preventDefault();

            // Gather the tracking data from the form.
            const tracking_form_data = new FormData(e.target);

            // Call trackOrder to get the tracked order data.
            order_track = await trackOrder(tracking_form_data);

            // Check if any valid order data was returned.
            if (Object.keys(order_track).length !== 0) {
                // Store the order details and format the timestamp.
                tracked_order = order_track.order;
                const timestamp = new Date(order_track.timestamp).toLocaleString();

                // Populate the container with the tracked order details.
                order_track_container.innerHTML = `
                <div class="card mb-3">
                    <div class="card-header">
                        <h5>Order #${order_track.order_id}
                            <span class="badge text-bg-secondary">${order_track.order_status}</span>
                        </h5>
                        <span class="mb-0 mt-2 text-muted">
                            ${order_track.status_description}
                        </span>
                    </div>
                    <div id="tracked_order_items" class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Ordered Items:
                            <span class="badge bg-info">
                                ${Object.keys(tracked_order).length}
                            </span>
                        </h6>
                        <ul class="list-group list-group-flush">
                            <li id="dummy_tracked_order_item" class="list-group-item">
                                <div class="row">
                                    <div class="col-md-3">
                                        <p class="mb-0">
                                            <strong>Item Name</strong>
                                        </p>
                                    </div>
                                    <div class="col-md-3">
                                        <p class="mb-0">
                                            <strong>Price</strong>
                                        </p>
                                    </div>
                                    <div class="col-md-3">
                                        <p class="mb-0">
                                            <strong>Qty</strong>
                                        </p>
                                    </div>
                                    <div class="col-md-3">
                                        <p class="mb-0">
                                            <strong>Total</strong>
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!-- Timestamp displayed in the card footer -->
                    <div class="card-footer">
                        <p class="text-body-secondary my-auto py-2 text-muted">
                            <strong>Last updated:</strong>
                            <span class="badge text-bg-secondary">${timestamp}</span>
                        </p>
                    </div>
                </div>
`

                // Get the element where the order items will be displayed.
                const tracked_order_items = document.getElementById('tracked_order_items');
                let tracked_order_price = 0;

                // Iterate through each item in the tracked order.
                for (const order_item in tracked_order) {
                    const item_details = tracked_order[order_item];

                    // Calculate the total price of the tracked order.
                    tracked_order_price += item_details.price * item_details.qty;

                    // Append each item detail (name, price, qty, total) to the order item list.
                    tracked_order_items.querySelector('ul').innerHTML += `                        
                            <li class="list-group-item">
                                <div class="row">
                                    <div class="col-md-3">
                                        <p class="mb-0">${item_details.name}</p>
                                    </div>
                                    <div class="col-md-3">
                                        <p class="mb-0">
                                            <span class="badge rounded-pill bg-primary">Rs. ${item_details.price}</span>
                                        </p>
                                    </div>
                                    <div class="col-md-3">
                                        <p class="mb-0">
                                            <span class="badge rounded-pill bg-secondary">${item_details.qty}</span>
                                        </p>
                                    </div>
                                    <div class="col-md-3">
                                        <p class="mb-0">
                                            <span class="badge rounded-pill bg-success">Rs. ${item_details.price * item_details.qty}</span>
                                        </p>
                                    </div>
                                </div>
                            </li>
`
                }

                // Append the total order price at the end of the list.
                tracked_order_items.querySelector('ul').innerHTML += `
                    <h5 class="card-subtitle mt-3 fs-5 text-end">Total: <span class="badge bg-info">Rs. ${tracked_order_price}</span></h5>
                `;
            } else {
                // If no order was found, display an error message.
                order_track_container.innerHTML = `<p>Sorry, no order found with tracking ID <strong>${tracking_form_data.get('tracking_id')}</strong>.</p>`;
            }

            e.target.reset();
        });
    }

    // Show or hide the empty message based on whether an order has been tracked.
    if (Object.keys(order_track).length === 0) {
        empty_track_message.hidden = false;
    } else {
        empty_track_message.hidden = true;
    }

    // Initialize the form population process.
    populateTrackedOrder();
}

// Ensure the script runs only on the order tracking page.
if (location.pathname === '/shop/tracker/') {
    main();
}
