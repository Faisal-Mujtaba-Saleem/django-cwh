# Generated by Django 5.1 on 2024-09-10 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0006_rename_order_id_track_order_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='track',
            name='timestamp',
            field=models.TimeField(auto_now=True, verbose_name='Timestamp'),
        ),
    ]
