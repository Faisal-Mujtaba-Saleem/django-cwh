from django.shortcuts import render, HttpResponse
from myapp.models import Contact
from django.contrib import messages
from datetime import datetime

# Create your views here.


context = {
    'title': 'Harry Ice Creams'
}


# To manage blank endpoint

def index(request):
    return render(request, template_name='index.html', context=context)
    # return HttpResponse(content='This is homepage')


# To manage /about endpoint

def about(request):
    return render(request, template_name='about.html', context=context)
    # return HttpResponse(content='This is aboutpage')


# To manage /services endpoint

def services(request):
    return render(request, template_name='services.html', context=context)
    # return HttpResponse(content='This is servicespage')


# To manage /contact endpoint

def contact(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        description = request.POST.get('description')

        contact = Contact(username=username, email=email,
                          phone=phone, description=description, date_n_time=datetime.today())
        contact.save()

        messages.add_message(request, messages.INFO,
                             "Your message has been sent!")

    return render(request, template_name='contact.html', context=context)
    # return HttpResponse(content='This is contactpage')
