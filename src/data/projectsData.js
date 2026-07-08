export const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "Talk to Your Arduino: Build an On-Device AI Agent in Arduino App Lab",
    tagline: "Type plain English, and a language model running on the board itself controls real hardware. No cloud, no API keys, fully offline.",
    author: "hardik_chadda",
    category: "Home automation",
    product: "FYP Projects",
    type: "Tutorial",
    difficulty: "Medium",
    views: 1237,
    comments: 0,
    likes: 3,
    date: "Jun 26, 2026",
    license: "MIT",
    respects: 3,
    badges: ["Dragonwing Robotics", "Home Automation"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
    intro: "This project demonstrates running a local LLM or speech module on device to interpret natural language commands and actuate hardware directly without any cloud dependence. We utilize specialized embedded weights mapped to standard microcontroller ports.",
    devices: [
      "UNO microcontroller board",
      "Solderless connection hookup cables",
      "RGB Status Indicator LEDs",
      "Rotary Analog potentiometer"
    ],
    software: [
      "Arduino IDE",
      "Custom firmware libraries compilation environments"
    ],
    description: "The complete system parses standard user input strings entirely offline. The local inference engine executes on the board within 40ms, triggering pin output voltage modulation dynamically.",
    code: `#include <ArduinoAppLab.h>\n\nLocalAgent agent;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n  agent.begin();\n}\n\nvoid loop() {\n  if (agent.available()) {\n    String cmd = agent.readCommand();\n    agent.executeOnDevice(cmd);\n  }\n}`,
    appLab: "Configure the desktop controller by binding the correct USB/COM port. Ensure model weights are fully loaded prior to active deployment loops.",
    files: [
      "local_inference_firmware_v1.zip (2.4 MB)"
    ]
  },
  {
    id: 2,
    title: "DF15RMG Tilt Kit (20kg): Multi-Axis Servo Control",
    tagline: "High-torque multi-joint robotic arm kinematics control using basic PWM feedback signals and direct Arduino driver connections.",
    author: "kararhussain03212",
    category: "Robotics",
    product: "FYP Projects",
    type: "Tutorial",
    difficulty: "Hard",
    views: 842,
    comments: 0,
    likes: 12,
    date: "Jun 28, 2026",
    license: "MIT",
    respects: 12,
    badges: ["Robotics", "Servo Control"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80",
    intro: "Learn how to control high-torque DF15RMG tilt kits for multi-axis robot joints, tracking precise angular steps using advanced kinematic equations and direct board pins.",
    devices: [
      "DF15RMG Tilt Kit (20kg)",
      "High Current DC step-down regulator",
      "Robotic metal brackets chassis",
      "Arduino Mega 2560 board"
    ],
    software: [
      "Arduino Servo Library",
      "MATLAB Kinematics simulation solver"
    ],
    description: "Set up the high-torque servo motor and link it to the PWM channels. Power is routed from an external 7.4V battery source. Code tracks smooth velocity transitions.",
    code: `#include <Servo.h>\n\nServo armJoint;\n\nvoid setup() {\n  armJoint.attach(9);\n  armJoint.write(90); // Center position\n}\n\nvoid loop() {\n  // Sweep joint smoothly\n  for (int pos = 0; pos <= 180; pos += 1) {\n    armJoint.write(pos);\n    delay(15);\n  }\n}`,
    appLab: "Directly connect a high-amp power lead to the servo rails. Do not power the 20kg servo directly from the Arduino 5V regulator rail.",
    files: [
      "robotic_arm_calibration.zip (1.8 MB)"
    ]
  },
  {
    id: 3,
    title: "FireBeetle 2 ESP32-C5 IoT Development Board (2.4 / 5GHz Wi-Fi 6, Solar Powered)",
    tagline: "Build a wireless solar-powered weather station leveraging low-power deep sleep cycles and direct Wi-Fi 6 cloud data uploads.",
    author: "kisa_0",
    category: "Internet of things",
    product: "FYP Projects",
    type: "Tutorial",
    difficulty: "Easy",
    views: 294,
    comments: 0,
    likes: 8,
    date: "Jun 29, 2026",
    license: "GPL-3.0",
    respects: 8,
    badges: ["IoT", "ESP32", "Solar Weather"],
    image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=1000&auto=format&fit=crop&q=80",
    intro: "Learn to configure the new FireBeetle 2 ESP32-C5 board to read analog solar charge controller inputs and upload DHT22 weather statistics over Wi-Fi 6 protocols.",
    devices: [
      "FireBeetle 2 ESP32-C5 board",
      "5V Solar panel array",
      "Lithium battery pack (3.7V)",
      "DHT22 temperature sensor"
    ],
    software: [
      "Espressif ESP32 Core compiler",
      "DHT sensor library"
    ],
    description: "The ESP32 reads battery charging status from the solar controller, queries weather conditions, sends telemetry packets, and enters deep sleep for 10 minutes to save power.",
    code: `#include <WiFi.h>\n#include <DHT.h>\n\n#define DHTPIN 4\nDHT dht(DHTPIN, DHT22);\n\nvoid setup() {\n  dht.begin();\n  WiFi.begin("SSID", "PASS");\n  // Code to transmit data goes here...\n  ESP.deepSleep(600e6); // Deep sleep 10 mins\n}\n\nvoid loop() {}`,
    appLab: "Bind the solar controller pin to the ESP32-C5 analog ADC converter pin (GPIO 3) to accurately track solar statistics.",
    files: [
      "solar_iot_weather_station.zip (1.1 MB)"
    ]
  },
  {
    id: 4,
    title: "Gravity: LED Button for Arduino / micro:bit (Green)",
    tagline: "Design an interactive green LED button installation with custom input debouncing and physical pulse-width indicator fades.",
    author: "hardik_chadda",
    category: "Installations",
    product: "FYP Projects",
    type: "Tutorial",
    difficulty: "Easy",
    views: 412,
    comments: 0,
    likes: 5,
    date: "Jun 30, 2026",
    license: "MIT",
    respects: 5,
    badges: ["Sensors", "Arduino", "LED Button"],
    image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=1000&auto=format&fit=crop&q=80",
    intro: "Configure the Gravity Green LED button module to toggle LED light states on click, utilizing solid hardware interrupt states and debounced timing handlers.",
    devices: [
      "Gravity: LED Button (Green)",
      "Arduino Uno board",
      "Double ended hookup jumper cables"
    ],
    software: [
      "Arduino IDE console"
    ],
    description: "This setup wires the Gravity LED button module to digital input pins. Tapping the button triggers a pin interrupt state that toggles the button's internal green LED status.",
    code: `const int btnPin = 2;\nconst int ledPin = 13;\nvolatile bool state = false;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n  pinMode(btnPin, INPUT_PULLUP);\n  attachInterrupt(digitalPinToInterrupt(btnPin), toggle, FALLING);\n}\n\nvoid loop() {\n  digitalWrite(ledPin, state);\n}\n\nvoid toggle() {\n  state = !state;\n}`,
    appLab: "Make sure you connect the three Gravity pin lines (Signal, Power, Ground) correctly to the microcontroller headers.",
    files: [
      "gravity_led_debouncing.zip (0.4 MB)"
    ]
  }
];
