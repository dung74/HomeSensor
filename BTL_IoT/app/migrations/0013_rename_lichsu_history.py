# Generated by Django 4.2.16 on 2024-10-01 08:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_rename_thiet_bi_lichsu_device_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='LichSu',
            new_name='History',
        ),
    ]
