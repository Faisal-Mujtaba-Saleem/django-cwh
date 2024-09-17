from django.urls import path
from userAuthenticatorApp import views

urlpatterns = [
    path('', view=views.index, name='home'),
    path('login', view=views.loginUser, name='login'),
    path('logout', view=views.logoutUser, name='logout')
]
