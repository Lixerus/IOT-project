## IOT-smart-cooler

### Description
Smart Cooler System is a project that aims to showcase the IoT technology. It consists of sensors, NodeMCU ESP8266-12E microcontroller and web server. The user can monitor the temperature in the target room. Activate and deactivate cooler which in projects case is a simple LED pin. It is also possible to set the target temperature for the automatic cooling mode.
___________________________
## Component list
Project consists of the following components:

`NodeMCU ESP8266-12E` - microcontroller
`DHT11` (3 pins) - temperature and humidity sensor.
Some wires.
_______________________
## Web Cilent

Web client is connected to the microcontroller through local wifi network and uses websocket connection to recieve real-time information.

Client can activate or deactivate cooler or enable automatic mode with target temperature.
_______________________
## Preview
![iot-preview](https://github.com/Lixerus/IOT-project/assets/61562096/6cbc556b-4cdb-4d03-b490-a85dc5c83e4d)
