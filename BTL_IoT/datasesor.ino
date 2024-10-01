#include <DHTesp.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Thiết lập các chân GPIO cho cảm biến và LED
#define DHT_PIN 16  // GPIO 16 (D0) cho DHT11
#define PHOTO_PIN A0  // Chân A0 cho cảm biến ánh sáng
#define LED1_PIN 5       // GPIO 5 (D1) cho LED1
#define LED2_PIN 4       // GPIO 4 (D2) cho LED2
#define LED3_PIN 12  // GPIO 12 (D6)
DHTesp dht;

//----Thông tin kết nối Wi-Fi-----------
const char* ssid = "VIETTEL";
const char* password = "13572468";
// const char* ssid = "SSG";
// const char* password = "Ssg12068168";
// const char* ssid = "iPhone";
// const char* password = "987654321";

// const char* ssid = "Dung dep zai";
// const char* password = "milan1899@@";

//-----Thông tin kết nối MQTT cục bộ-----
const char* mqtt_server = "192.168.1.3";  // Địa chỉ IP của máy tính cục bộ
// const char* mqtt_server = "10.10.20.42";  // Địa chỉ IP của máy tính cong ty
// const char* mqtt_server = "172.20.10.6";
const int mqtt_port = 1884;
const char* mqtt_username = "dungx";      // Tài khoản MQTT của bạn
const char* mqtt_password = "1234567";     // Mật khẩu MQTT của bạn
WiFiClient espClient;
PubSubClient client(espClient);
const int max_value = 1023;
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void callback(char* topic, byte* payload, unsigned int length) {
  String message;

  // Chuyển payload thành chuỗi
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("Message received on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  Serial.println(message);

  // Kiểm tra nếu thông điệp là "ON" hoặc "OFF" để bật/tắt LED
  // Kiểm tra nội dung thông báo để điều khiển các đèn LED
  if (message == "LED1 ON") {
    digitalWrite(LED1_PIN, HIGH);  // Bật LED1
    Serial.println("LED1 is ON");
  } else if (message == "LED1 OFF") {
    digitalWrite(LED1_PIN, LOW);   // Tắt LED1
    Serial.println("LED1 is OFF");
  } else if (message == "LED2 ON") {
    digitalWrite(LED2_PIN, HIGH);  // Bật LED2
    Serial.println("LED2 is ON");
  } else if (message == "LED2 OFF") {
    digitalWrite(LED2_PIN, LOW);   // Tắt LED2
    Serial.println("LED2 is OFF");
  } else if (message == "LED3 ON") {
    digitalWrite(LED3_PIN, HIGH);  // Bật LED3
    Serial.println("LED3 is ON");
  } else if (message == "LED3 OFF") {
    digitalWrite(LED3_PIN, LOW);   // Tắt LED3
    Serial.println("LED3 is OFF");
  } else if (message =="ALL OFF") {
    digitalWrite(LED1_PIN, LOW);   // Tắt LED1
    Serial.println("LED1 is OFF");
    digitalWrite(LED2_PIN, LOW);   // Tắt LED2
    Serial.println("LED2 is OFF");
    digitalWrite(LED3_PIN, LOW);   // Tắt LED3
    Serial.println("LED3 is OFF");
  } else if (message =="ALL ON") {
    digitalWrite(LED1_PIN, HIGH);   // Tắt LED1
    Serial.println("LED1 is ON");
    digitalWrite(LED2_PIN, HIGH);   // Tắt LED2
    Serial.println("LED2 is ON");
    digitalWrite(LED3_PIN, HIGH);   // Tắt LED3
    Serial.println("LED3 is ON");
  } 
}
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID = "ESPClient-";
    clientID += String(random(0xffff), HEX);

    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("ledControll");
     
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);  // Khởi động Serial Monitor
  dht.setup(DHT_PIN, DHTesp::DHT11);  // Thiết lập cảm biến DHT11

  pinMode(LED1_PIN, OUTPUT);  // Thiết lập chân LED1 là OUTPUT
  pinMode(LED2_PIN, OUTPUT);  // Thiết lập chân LED2 là OUTPUT
  pinMode(LED3_PIN, OUTPUT);  // Thiết lập chân LED3 là OUTPUT

  setup_wifi();  // Kết nối Wi-Fi
  client.setServer(mqtt_server, mqtt_port);  // Đặt MQTT broker
  client.setCallback(callback);  // Gán hàm callback để xử lý lệnh MQTT
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Đọc giá trị từ DHT11
  float temperature = dht.getTemperature();
  float humidity = dht.getHumidity();

  // Đọc giá trị ánh sáng từ chân analog (AO)
  int lightIntensity = max_value - analogRead(PHOTO_PIN);

  // Kiểm tra và in dữ liệu lên Serial Monitor
  if (!isnan(temperature) && !isnan(humidity)) {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" *C, Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

    // Tạo thông báo JSON để gửi qua MQTT
    String payload = "{\"temperature\": ";
    payload += String(temperature);
    payload += ", \"humidity\": ";
    payload += String(humidity);
    payload += ", \"lightIntensity\": ";
    payload += String(lightIntensity);
    payload += "}";

    // Gửi dữ liệu qua MQTT
    client.publish("home/sensor", payload.c_str());
    Serial.print("Published data: ");
    Serial.println(payload);
  } else {
    Serial.println("Failed to read from DHT sensor!");
  }

  Serial.print("Light Intensity (Analog): ");
  Serial.println(lightIntensity);

  // if (lightIntensity > 500) {
  //   digitalWrite(LED_PIN, HIGH);  // Bật LED nếu cường độ ánh sáng cao
  // } else {
  //   digitalWrite(LED_PIN, LOW);   // Tắt LED nếu cường độ ánh sáng thấp
  // }

  delay(2000);
}
