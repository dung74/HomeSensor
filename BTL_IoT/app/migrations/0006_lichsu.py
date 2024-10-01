# Generated by Django 3.2.25 on 2024-08-21 05:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_environmentaldata'),
    ]

    operations = [
        migrations.CreateModel(
            name='LichSu',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('thoi_gian', models.DateTimeField(auto_now_add=True)),
                ('thiet_bi', models.CharField(max_length=100)),
                ('trang_thai', models.CharField(choices=[('Bật', 'Bật'), ('Tắt', 'Tắt')], max_length=10)),
            ],
        ),
    ]
