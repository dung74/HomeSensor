import json
from paho.mqtt.client import Client
from .models import Monitor

def on_message(client, userdata, message):
    try:
        data = json.loads(message.payload)
        # print(f"Received data: {data}")  N
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        light_intensity = data.get('lightIntensity')

        if temperature is not None and humidity is not None and light_intensity is not None:
           
            reading = Monitor(
                temperature=temperature,
                humidity=humidity,
                light_intensity=light_intensity
            )
            reading.save()
            # print(f"Data saved: {temperature}, {humidity}, {light_intensity}")
        else:
            print("Invalid data: missing some values")
    except json.JSONDecodeError:
        print("Failed to decode JSON")

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker successfully!")
    else:
        print(f"Failed to connect, return code {rc}")

def start_mqtt_client():
    client = Client()
    client.username_pw_set(username="dungx", password="1234567")
    client.on_message = on_message
    client.on_connect = on_connect  
    client.connect("localhost", 1884, 60)
    client.subscribe("home/sensor")  # Đăng ký topic
    client.loop_start()  
