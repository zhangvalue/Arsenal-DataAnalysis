# Generated by Django 2.1.7 on 2019-03-23 02:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kaoqins', '0003_auto_20190323_0217'),
    ]

    operations = [
        migrations.RenameField(
            model_name='kaoqintype',
            old_name='title',
            new_name='name',
        ),
    ]
