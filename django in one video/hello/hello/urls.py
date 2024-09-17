"""
URL configuration for hello project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include


# Change the text in the header (on top of the admin page)
admin.site.site_header = "Harry Icecreams Admin"

# Change the text in the browser tab and the heading on the login screen
admin.site.site_title = "Harry Icecreams Portal"

# Change the text on the login screen
admin.site.index_title = "Welcome to Harry Icecreams Portal"


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls'))
]
