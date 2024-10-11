from shop.models import Product
import os
import django
import json
from django.core.files.base import ContentFile
from django.utils import timezone

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_awesome_cart.settings')
django.setup()

# Import your model after setting up Django

incorrect_paths = []


def upload_products_to_db(name, sku, description, price, stock, category, sub_category, image_path):
    if not os.path.exists(image_path):
        incorrect_paths.append(image_path)
        return

    if Product.objects.filter(sku=sku).exists():
        print(f'Product with SKU {sku} already exists')
        return

    with open(image_path, 'rb') as image_file:
        image_content = ContentFile(
            image_file.read(), name=os.path.basename(image_path))

        product = Product(
            name=name,
            description=description,  # Corrected typo
            sku=sku,
            price=price,
            stock=stock,
            category=category,
            sub_category=sub_category,
            image=image_content,
            publishedAt=timezone.now()
        )
        product.save()

        print(f'Product {name} uploaded successfully!')


if __name__ == "__main__":
    try:
        with open('db_.json') as json_file:
            products_to_upload = json.load(json_file)['products']
            for product in products_to_upload:
                category = product['category']
                sub_category = product['sub_category']
                for item in product['items']:
                    # Debugging print statement
                    print(f'Processing item')
                    if 'sku' not in item:
                        print(f'Missing SKU in item: {item}')
                        continue

                    upload_products_to_db(
                        category=category, sub_category=sub_category, **item
                    )

        if incorrect_paths:
            print(f'Incorrect paths: {incorrect_paths}')

    except Exception as e:
        print(f'Error: {e}')

    finally:
        print('Done!')
