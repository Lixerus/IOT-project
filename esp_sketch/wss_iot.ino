#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include <DHT.h>

#define DHT_PIN D3
#define DHT_TYPE DHT11

DHT dht_sensor(DHT_PIN, DHT_TYPE);

bool LEDstatus = LOW;

const char* ssid = "Your ssid";    //
const char* password = "Your password";  //

struct Settings {
  char mode;
  int target_temp;
  int delta;
};

Settings systemSettings;

WebSocketsServer webSocket = WebSocketsServer(81);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
      }
      break;
    case WStype_TEXT:
      Serial.printf("[%u] Received text: %s\n", num, payload);
      if(payload[0] == 'a'){
        systemSettings.mode = 'a';
      }
      else if(payload[0] == 'm'){
        systemSettings.mode = 'm';
      }
      else if (isdigit(payload[0]) != 0){
        int temp = atoi((char*)payload);
        systemSettings.target_temp = temp;
      }
      else if (payload[0] == 'n' && systemSettings.mode == 'm'){
        LEDstatus = LOW;
      }
      else if (payload[0] == 'f' && systemSettings.mode == 'm'){
        LEDstatus = HIGH;
      }
      break;
  }
}

void auto_mode(float temperature){
  if(systemSettings.mode != 'a'){return;}
  if(LEDstatus == HIGH && temperature >= systemSettings.target_temp+systemSettings.delta){LEDstatus = LOW;}
  else if(LEDstatus == LOW && temperature < systemSettings.target_temp-systemSettings.delta){LEDstatus = HIGH;}
}

float get_temp(){
  float temperature_C = dht_sensor.readTemperature();
  if ( isnan(temperature_C)) {
    Serial.println("Failed to read from DHT sensor!");}
  return temperature_C;
}

void send_temperature(float temperature){
  String msg = String((float)temperature);
  webSocket.broadcastTXT(msg);
}

void setup() {
  Serial.begin(9600);
  pinMode(D4, OUTPUT);
  dht_sensor.begin();
  systemSettings = {'a', 28, 5};
  delay(500);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  Serial.print("ESP8266 Server's IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {

  webSocket.loop();
  float temperature_C = get_temp();
  auto_mode(temperature_C);
  digitalWrite(D4, LEDstatus);
  send_temperature(temperature_C);

  delay(3000);
}
