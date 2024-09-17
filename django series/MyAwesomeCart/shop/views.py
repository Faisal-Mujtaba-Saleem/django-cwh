from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
from email.message import EmailMessage
import smtplib
import os
import json
from .models import Product, Contact, Order, Track
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('.env')

SERVER_EMAIL = os.getenv('SERVER_EMAIL')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')

# Fetch products from database
products = Product.objects.all()
serialized_products = serialize('json', products)


def send_email(To, From, Subject, content):
    """
    Sends an email to a recipient using the email server specified in .env file
    """
    try:
        SMTP_SERVER = "smtp.gmail.com"
        SMTP_PORT = 587
        SMTP_USERNAME = 'faisalmujtaba2005@gmail.com'
        SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')

        message = EmailMessage()
        message.set_content(content)
        message["From"] = From
        message["To"] = To
        message["Subject"] = Subject

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)

            print(f'Sent email to {To} successfully')
    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)


def generateCategorizedProductSlides(query=''):
    # Retrieve distinct product categories to avoid duplicates
    products_categories = [
        product['category']
        # Only unique categories
        for product in products.values('category').distinct()
    ]

    # Initialize an empty list to hold the categorized product slides
    categorized_products_slides = []

    # Loop through each category to process products
    for category in products_categories:
        # Filter the products that belong to the current category
        products_with_same_category = products.filter(category=category)

        # Filter the products based on the search query
        if query != '':
            def filterProductsWithSearchQuery(product):
                condition = query.lower() in product.name.lower() or query.lower() in product.sku.lower() or query.lower() in product.category.lower() or query.lower() in product.sub_category.lower() or query.lower() in product.description.lower() or query.lower() in str(
                    product.price
                ).lower()
                if condition:
                    return True

                return False

            products_with_same_category = list(
                filter(
                    filterProductsWithSearchQuery,
                    products_with_same_category
                )
            )

        # Set the number of items per slide (for the product carousel, etc.)
        nSlideItems = 3

        # Create slides by grouping products into chunks of `nSlideItems`
        same_category_products_slides = [
            products_with_same_category[i:i+nSlideItems]
            for i in range(0, len(products_with_same_category), nSlideItems)
        ]

        # Create a dictionary with the current category and the slides for that category
        category_slides_dict = {
            'category': category,
            'slides': same_category_products_slides
        }

        # Append the category and its slides to the overall list
        if category_slides_dict['slides'] != []:
            categorized_products_slides.append(category_slides_dict)

    # Return the categorized product slides after processing all categories
    return categorized_products_slides


def index(request):
    """
    Returns the index page which displays all products categorized by their categories
    """
    try:
        categorized_products_slides = generateCategorizedProductSlides()

        params = {
            'categorized_products_slides': categorized_products_slides,
            "products": serialized_products
        }

        return render(request, template_name='shop/index.html', context=params)
    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)


def search(request):
    """
    Returns the index page which displays all products categorized by their categories
    """
    try:
        query = request.GET.get('search', '')
        print('query', query)

        if query != '':
            categorized_products_slides = generateCategorizedProductSlides(
                query=query
            )

            params = {
                'categorized_products_slides': categorized_products_slides,
                "products": serialized_products
            }

            return render(request, template_name='shop/index.html', context=params)

        else:
            return redirect('ShopHome')

    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)


def about(request):
    """
    Returns the about page which displays all products
    """
    try:
        return render(request, template_name='shop/about.html')
    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)


def contact(request):
    """
    Returns the contact page which allows users to send a message to the admin
    """
    try:
        contact_saved = False
        if request.method == 'POST':
            post = request.POST
            name = post.get('name', '')
            email = post.get('email', '')
            phone = post.get('phone', '')
            description = post.get('description', '')
            interest = post.get('interest', '')

            contact = Contact(name=name, email=email, phone=phone,
                              description=description, interest=interest)
            contact.save()

            if contact.pk is not None:
                contact_saved = True
                send_email(To=contact.email, From=SERVER_EMAIL, Subject='Contact Confirmation',
                           content=f'Hi {contact.name}, thank you for contacting us. We will get back to you soon.')
                msg_content_to_admin = f'Name: {contact.name}\nEmail: {contact.email}\nPhone: {
                    contact.phone}\nDescription: {contact.description}\nInterest: {contact.interest}'
                send_email(To=ADMIN_EMAIL, From=SERVER_EMAIL,
                           Subject='Contact Notification From MyAwesomeCart', content=msg_content_to_admin)

        params = {
            'contact_saved': contact_saved
        }

        return render(request, template_name='shop/contact.html', context=params)
    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)


def checkout(request):
    """
    Returns the checkout page which allows users to place an order
    """
    try:
        checkedout = False
        if request.method == 'POST':
            post = request.POST
            order_items = json.loads(post.get('order_items', ''))
            order_person = post.get('order_person', '')
            order_email = post.get('order_email', '')
            order_address = post.get('order_address', '') + ' ' + \
                post.get('order_address2', '')
            order_city = post.get('order_city', '')
            order_state = post.get('order_state', '')
            order_zip_code = post.get('order_zip-code', '')
            order_phone = post.get('order_phone', '')

            # Create and save the order
            order = Order(
                order_items=order_items, order_person=order_person, email=order_email,
                address=order_address, city=order_city, state=order_state, zip_code=order_zip_code, phone=order_phone
            )
            order.save()

            # Create and save the order tracking
            order_track = Track(
                order_id=order, order_status='Order Placed', status_description='Order has been placed successfully, we\'ll try delivering it you as soon as possible!',
            )
            order_track.save()

            if order.pk is not None:
                checkedout = True
                indented_order_items = json.dumps(order_items, indent=4)

                send_email(To=order_email, From=SERVER_EMAIL, Subject='Order Confirmation', content=f'Hi {order_person}, thank you for your order. Your order id is {
                           order.pk}. Use it to track your order using our order tracker. We will get back to you soon.')

                send_email(To=ADMIN_EMAIL, From=SERVER_EMAIL, Subject='Order Notification From MyAwesomeCart',
                           content=f'New order has been placed with id {order.pk}. Here are the details. \n\n{order} \n\n\n Order Items: {indented_order_items}. Check it out at http://127.0.0.1:8000/admin or track it using http://127.0.0.1:8000/shop/track.')

                # Redirect to tracker page after order is successfully saved
                return redirect(f'/shop/tracker?redirected=true&order_id={order.pk}')
            else:
                print('Error in saving order')
                # Handle error, return HttpResponse if order wasn't saved
                return HttpResponse("Error in saving order", status=500)

        # Handle GET request or other method (non-POST)
        params = {
            'products': serialized_products
        }
        if checkedout:
            params['checkedout'] = checkedout
            params['order_id'] = order.pk

        return render(request, template_name='shop/checkout.html', context=params)

    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)


@csrf_exempt
def tracker(request):
    """
    Returns the track order page which allows users to track their orders
    """
    try:
        if request.method == 'POST':
            post = request.POST

            order_id = post.get('tracking_id', '')
            order_email = post.get('tracking_email', '')

            if order_id != '' and order_email != '':
                order_to_track = Order.objects.all().filter(
                    order_id=order_id, email=order_email)

                if order_to_track.exists():
                    order_track = Track.objects.filter(order_id=order_id)

                    # Serialize the data and convert it to a json string and then load it into a json object
                    tracking_data = json.loads(serialize('json', order_track))
                    # Dump the json object into a json string with indentation after extracting the fields
                    tracking_data = tracking_data[0]['fields']
                    tracking_data['order'] = order_to_track[0].order_items

                    print(tracking_data)

                    # Return the tracking data as a JsonResponse
                    return JsonResponse(tracking_data, status=200)

                else:
                    return HttpResponse("Order not found", status=404)

            else:
                return HttpResponse("Please provide both order ID and email", status=400)

        params = {
            "redirected": False
        }

        if request.GET.get('redirected', '') != '':
            params['redirected'] = True
            params['order_id'] = request.GET.get('order_id')

        return render(request, template_name='shop/tracker.html', context=params)
    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)


def productView(request, product_id):
    """
    Returns a product page which displays a specific product
    """
    try:
        product = Product.objects.get(product_id=product_id)
        preview_product = serialize('json', [product])

        params = {
            "products": serialized_products,
            "product": product,
            "preview_product": preview_product
        }
        return render(request, template_name='shop/product.html', context=params)
    except Exception as e:
        # Catch any exception and log it, also return an HttpResponse with error message
        print(e)
        return HttpResponse(f"An error occurred: {e}", status=500)
