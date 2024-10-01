from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(History)
# admin.site.register(EnvironmentalData)
admin.site.register(Monitor)
admin.site.register(DeviceState)