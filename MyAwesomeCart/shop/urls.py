from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name='ShopHome'),
    path('about/', view=views.about, name='AboutUS'),
    path('contact/', view=views.contact, name='ContactUs'),
    path('tracker/', view=views.tracker, name='Tracker'),
    path(
        'productview/<int:product_id>/',
        view=views.productView, name='ProductView'
    ),
    path('search/', view=views.search, name='Search'),
    path('checkout/', view=views.checkout, name='Checkout'),
    path("login/", view=views.loginUser, name="Login"),
    path("logout/", view=views.logoutUser, name="Logout"),
    path("signup/", view=views.signup, name="SignUp"),
]
