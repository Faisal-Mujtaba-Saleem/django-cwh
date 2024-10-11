from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name='BlogHome'),
    path('blogpost/<int:post_id>', view=views.blogPost, name='BlogPost'),
]
