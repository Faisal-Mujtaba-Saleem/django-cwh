from django.db import models

# Create your models here.


class Contact(models.Model):
    """Contact model for our site"""
    username = models.CharField(verbose_name="username", max_length=50)
    email = models.EmailField(verbose_name="email", max_length=254)
    phone = models.CharField(verbose_name='phone.', max_length=12)
    description = models.TextField(verbose_name="description")
    date_n_time = models.DateTimeField(verbose_name="date_n_time", auto_now=True)

    def __str__(self):
        return self.username
    
