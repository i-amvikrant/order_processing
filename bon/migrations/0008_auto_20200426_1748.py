# Generated by Django 2.2.5 on 2020-04-26 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bon', '0007_modules_total_cost'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parts',
            name='image',
            field=models.ImageField(default='abc.jpg', upload_to='parts'),
        ),
    ]
