from django.db import models
from django.core.serializers.json import DjangoJSONEncoder
from json.decoder import JSONDecoder

# Create your models here.


class Product(models.Model):
    """Model definition for Product."""
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(verbose_name=("Name"), max_length=50, default='')
    sku = models.CharField(verbose_name=("SKU"), max_length=50, default='')
    category = models.CharField(
        verbose_name=("Category"), max_length=50, default=''
    )
    sub_category = models.CharField(
        verbose_name=("Sub-Category"), max_length=50, default=''
    )
    stock = models.FloatField(verbose_name=("Stock"), default=0)
    price = models.FloatField(verbose_name=("Price"), default=0)
    description = models.TextField(
        verbose_name=("Description"), max_length=150, default=''
    )
    image = models.ImageField(
        verbose_name=("Image"), upload_to='shop/images', default=''
    )
    publishedAt = models.DateField(verbose_name=("Published At"), default='')

    def __str__(self):
        return self.name


class Contact(models.Model):
    """Model definition for Contact."""
    contact_id = models.AutoField(primary_key=True)
    name = models.CharField(verbose_name=("Name"), max_length=50, default='')
    email = models.EmailField(verbose_name=("Email"), max_length=254)
    phone = models.CharField(verbose_name=(
        "Phone"), max_length=13, default='+92 000 000 0000')
    description = models.TextField(verbose_name=(
        "Description"), max_length=150, default='')
    interest = models.CharField(verbose_name=(
        "Interest"), default='', max_length=50)

    def __str__(self):
        return self.name


class Order(models.Model):
    """Model definition for Order."""
    order_id = models.AutoField(primary_key=True)
    order_person = models.CharField(
        verbose_name=("Name"), max_length=50, default='')
    email = models.EmailField(verbose_name=("Email"), max_length=254)
    address = models.TextField(verbose_name=(
        "Address"), max_length=150, default='')
    city = models.CharField(verbose_name=("City"), max_length=50, default='')
    state = models.CharField(verbose_name=("State"), max_length=50, default='')
    zip_code = models.IntegerField(verbose_name=("Zip"), default=0)
    phone = models.CharField(verbose_name=(
        "Phone"), max_length=13, default='+92 000 000 0000')
    order_items = models.JSONField(verbose_name=(
        "Order Items"), encoder=DjangoJSONEncoder, decoder=JSONDecoder, default=dict)

    def __str__(self):
        return self.order_person


class Track(models.Model):
    """Model definition for Tracker."""
    track_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    order_status = models.CharField(
        verbose_name="Order Status", max_length=50, default=''
    )
    status_description = models.TextField(
        verbose_name="Status Description", max_length=150, default=""
    )
    timestamp = models.DateTimeField(verbose_name="Timestamp", auto_now=True)

    def __str__(self):
        return str(self.order_id)