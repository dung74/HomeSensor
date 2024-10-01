from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    
    def ready(self):
        from .mqtt_listener import start_mqtt_client
        start_mqtt_client()