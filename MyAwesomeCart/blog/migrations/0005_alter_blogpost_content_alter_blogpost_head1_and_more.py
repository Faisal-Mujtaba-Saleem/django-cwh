# Generated by Django 5.1.1 on 2024-10-09 15:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_alter_blogpost_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='content',
            field=models.TextField(default='', max_length=500, verbose_name='Content'),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='head1',
            field=models.CharField(default='', max_length=100, verbose_name='Head1'),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='head1_content',
            field=models.TextField(default='', max_length=1000, verbose_name='Head1 Content'),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='head2',
            field=models.CharField(default='', max_length=100, verbose_name='Head2'),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='head2_content',
            field=models.TextField(default='', max_length=1000, verbose_name='Head2 Content'),
        ),
    ]
