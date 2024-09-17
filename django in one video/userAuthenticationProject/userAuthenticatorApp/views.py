from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from datetime import datetime

# user_password =  $@!&@|#2005

# Create your views here.

context = {
    'current_year': datetime.now().year,
    'title': 'User Authenticator'

}


def index(request):
    if not request.user.is_authenticated:
        return redirect('/login')

    return render(request, template_name='index.html', context=context)


def loginUser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if username and password:
            user = authenticate(username=username, password=password)

            if user != None:
                login(request, user)
                return redirect('/')

    return render(request, template_name='login.html', context=context)


def logoutUser(request):
    logout(request)
    return redirect('/login')
