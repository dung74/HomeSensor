from django.contrib import admin
from django.urls import path
from. import views


urlpatterns=[
     path('', views.home, name = "home"),
     path('profile/',views.profile, name = "profile"),
     path('monitor/',views.monitor, name = "monitor"),
     path('history/', views.history, name = "history"),
     path('toggle-device/', views.toggle_device, name='toggle_device'),
     path('sensor-data/', views.get_sensor_data, name='get_sensor_data'),
     
]