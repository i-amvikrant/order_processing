# Generated by Django 2.2.5 on 2020-04-25 10:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bon', '0004_auto_20200425_1604'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='sub_module_list',
            unique_together={('designID', 'subID')},
        ),
    ]
