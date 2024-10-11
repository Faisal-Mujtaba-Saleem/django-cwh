from django.shortcuts import render
from django.core.serializers import serialize
from shop.models import Product
from .models import BlogPost

# Fetch products from database
products = Product.objects.all()

# Create your views here.


def index(request):
    blogposts = BlogPost.objects.all()
    params = {
        "blogposts": blogposts,
        "products": serialize('json', products)
    }
    return render(request, template_name='blog/index.html', context=params)


def blogPost(request, post_id):
    post = BlogPost.objects.get(post_id=post_id)

    params = {
        "post": post,
        "products": serialize('json', products),
        "next": None,
        "prev": None
    }

    next_post = BlogPost.objects.filter(post_id=post_id+1)
    prev_post = BlogPost.objects.filter(post_id=post_id-1)

    if next_post.exists():
        params["next"] = next_post.first().post_id

    if prev_post.exists():
        params["prev"] = prev_post.first().post_id

    return render(request, template_name='blog/blogpost.html', context=params)
