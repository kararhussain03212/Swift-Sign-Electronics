export const BLOG_CATEGORIES = [
  "All",
  "IoT",
  "Robotics",
  "Artificial Intelligence",
  "Hardware Design",
  "Firmware Development"
];

export const BLOG_ARTICLES = [
  {
    id: 1,
    slug: "esp32-c5-solar-weather-station",
    title: "Build a Solar-Powered Wi-Fi 6 Weather Station with ESP32-C5",
    excerpt: "Learn how to build a fully wireless, solar-powered environmental logger using deep sleep cycles, solar cells, and Wi-Fi 6 telemetry.",
    body: "Designing smart sensors for the outdoors requires balancing power consumption with wireless range and reliability. With the release of the FireBeetle 2 ESP32-C5—Espressif's first dual-band Wi-Fi 6 microcontroller—designing low-power outdoor stations has become significantly easier and more efficient. Wi-Fi 6 introduces Target Wake Time (TWT), which enables sensors to negotiate wake schedules with the router, keeping the radio powered off for longer periods and drastically extending battery life.\n\nTo build this system, we interface a DHT22 temperature and humidity sensor and a BMP280 barometric pressure sensor to the ESP32-C5. The system is powered by a 3.7V Lithium-ion battery recharged by a 5V solar panel via a TP4056 solar charge controller. Connecting the analog battery pin to the microcontroller's ADC pin (GPIO 3) allows us to monitor the battery health in real-time alongside weather telemetry.\n\nFirmware architecture is critical here. Instead of leaving the radio connected, we establish connection, query the DHT22/BMP280, transmit telemetry packages to our cloud endpoint, and immediately enter deep sleep. In deep sleep, the ESP32-C5 consumes less than 15µA, allowing the small solar cell to charge the battery even on overcast days.\n\nFor optimal results, ensure the solar panel is positioned at a tilt angle matching your local latitude. Additionally, mount the temperature sensor inside a Stevenson screen (a louvered enclosure) to protect it from direct sunlight and rain while permitting natural air circulation for accurate readings.",
    cover: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=800&auto=format&fit=crop&q=80",
    category: "IoT",
    categoryColor: "#0042d7",
    author: {
      name: "Dr. Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      role: "Senior IoT Architect"
    },
    date: "June 26, 2026",
    readTime: "8 min read",
    tags: ["IoT", "ESP32", "Solar Power", "Weather Station"],
    featured: true
  },
  {
    id: 2,
    slug: "tinyml-neural-networks-microcontrollers",
    title: "The Rise of TinyML: Running Neural Networks on $5 Microcontrollers",
    excerpt: "Embedded AI is transforming hardware. Discover how to compile and run TensorFlow Lite models directly on microcontrollers like the ESP32.",
    body: "Running machine learning models historically required cloud servers or high-end GPUs. TinyML is changing that paradigm by enabling inference directly on edge devices—specifically microcontrollers with fractions of a megabyte of RAM. By processing data locally, TinyML eliminates internet latency, respects user privacy, and reduces power consumption to milliwatts.\n\nThe magic behind TinyML lies in model quantization. When compiling neural networks for embedded systems using TensorFlow Lite Micro, weights and biases are converted from 32-bit floating-point numbers (float32) to 8-bit integers (int8). This reduces the model size by roughly 75% and enables microcontrollers to perform calculations using faster integer arithmetic instead of slow floating-point operations.\n\nPractical applications are vast: wake-word detection (like 'Hey Google' or 'Alexa'), predictive maintenance (analyzing motor vibrations for wear), and anomaly detection. In our lab, we compiled a classification model to identify specific hand gestures using data from a 3-axis accelerometer and mapped the output to control robotic joints in real-time.\n\nWhen designing your first TinyML model, start with high-quality datasets and keep your network architecture simple. Every additional layer increases flash storage requirements. Platforms like Edge Impulse provide incredible workflows to collect sensor data, train models, and export optimized C++ source code packages for Arduino IDE.",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    category: "Artificial Intelligence",
    categoryColor: "#84cc16",
    author: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      role: "Embedded AI Researcher"
    },
    date: "June 28, 2026",
    readTime: "9 min read",
    tags: ["TinyML", "AI", "ESP32", "Edge Computing"],
    featured: false
  },
  {
    id: 3,
    slug: "robotic-kinematics-high-torque-servos",
    title: "Robotic Kinematics: Controlling High-Torque Servos for Multi-Joint Arms",
    excerpt: "Master the physics and math behind forward and inverse kinematics to program smooth, natural movements for multi-axis robotic arms.",
    body: "Programming a robotic arm requires translating coordinate points in 3D space into angular rotations for individual joint motors. This spatial math is divided into two primary disciplines: Forward Kinematics (calculating end-effector position based on joint angles) and Inverse Kinematics (calculating the required joint angles to place the end-effector at a specific point).\n\nFor heavy lifting, robotic joints use high-torque servos like the DF15RMG. These servos can generate up to 20kg-cm of torque, enabling them to lift mechanical loads and hold positions steady. However, powering these high-torque assemblies directly from the microcontroller's 5V regulator is a recipe for system crashes due to voltage sags. Always route servo power through an external 7.4V battery pack or high-amp step-down buck regulator.\n\nTo ensure smooth transitions, avoid sending raw angular steps directly. Moving a joint from 0° to 90° in a single execution step causes jerky, damaging vibrations. Instead, implement velocity profiling. Use cosine interpolation or small incremental sweep loops inside your firmware to accelerate and decelerate joints gently.\n\nInverse kinematics can be solved algebraically or numerically. For a simple 3-axis robotic arm, trigonometric equations are sufficient to determine joint angles. For 6-axis configurations, engineers rely on Denavit-Hartenberg (D-H) parameters and matrix solvers in MATLAB or Python to compute coordinate transforms.",
    cover: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    category: "Robotics",
    categoryColor: "#ea580c",
    author: {
      name: "Marcus Sterling",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
      role: "Robotics Engineer"
    },
    date: "June 30, 2026",
    readTime: "11 min read",
    tags: ["Robotics", "Servos", "Kinematics", "Arduino"],
    featured: false
  },
  {
    id: 4,
    slug: "wi-fi-6-smart-home-automation",
    title: "Why Wi-Fi 6 is a Game Changer for Smart Home Automation",
    excerpt: "Explore the advantages of Wi-Fi 6 (802.11ax) in dense IoT networks, including Target Wake Time (TWT) for battery-powered smart sensors.",
    body: "Smart homes contain dozens of connected devices—smart plugs, light bulbs, security cameras, and environmental sensors. Under older Wi-Fi standards, routers struggled to communicate with many devices simultaneously, leading to network congestion, high latency, and rapid battery drainage for wireless sensors. Wi-Fi 6 (802.11ax) addresses these issues directly.\n\nThe most important technological breakthrough in Wi-Fi 6 for smart homes is Orthogonal Frequency-Division Multiple Access (OFDMA). OFDMA splits wireless channels into smaller sub-carriers, allowing the router to bundle transmissions to multiple devices in a single transmit cycle. Instead of waiting in queue, smart plugs and bulbs communicate concurrently, reducing latency.\n\nFurthermore, Wi-Fi 6 introduces Target Wake Time (TWT). Using TWT, microcontrollers like the ESP32-C5 negotiate specific schedules with the router to wake up and transfer data. Outside of these microsecond-level windows, the device's radio module enters deep sleep, decreasing overall idle power consumption by up to 80%.\n\nIf you are planning to upgrade your home automation system or build custom smart sensors, investing in a Wi-Fi 6 router is highly recommended. It creates a robust backbone for dense local networks, ensuring seamless data feeds from custom microcontrollers and commercially manufactured appliances alike.",
    cover: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    category: "Smart Home",
    categoryColor: "#a855f7",
    author: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80",
      role: "Smart Home Specialist"
    },
    date: "July 2, 2026",
    readTime: "7 min read",
    tags: ["Smart Home", "Wi-Fi 6", "IoT", "Networking"],
    featured: false
  },
  {
    id: 5,
    slug: "pcb-design-common-layout-mistakes",
    title: "Printed Circuit Board Design: Common Layout Mistakes to Avoid",
    excerpt: "Designing your first PCB? Avoid critical routing mistakes, ground loops, and impedance mismatching with these essential design tips.",
    body: "Transitioning a project from a solderless breadboard to a professional Printed Circuit Board (PCB) is an exciting milestone. However, transferring a schematic to a layout board comes with challenges. Even with a correct schematic, improper PCB trace routing can lead to electrical noise, signal degradation, or catastrophic component failure.\n\nThe first mistake beginners make is neglecting trace width. High-power traces carrying currents for motors or heating elements must be wider than low-power signal lines. If a trace is too narrow, it acts like a resistor, heating up and potentially burning out the board. Use online trace width calculators to ensure your power lines can handle the load.\n\nAnother critical issue is ground routing. Avoid routing ground return lines in long, winding paths. This creates ground loops, introducing electromagnetic noise into sensitive analog sensors. The best practice is to design a dedicated, continuous ground plane—typically on the bottom layer of a two-layer board—and connect ground terminals to it using short vias.\n\nFinally, pay close attention to decoupling capacitor placement. Decoupling capacitors act as local energy reservoirs, smoothing out minor voltage fluctuations. For these capacitors to do their job, they must be positioned physically close to the power pin of the IC (integrated circuit) they protect. Placing them far away renders them ineffective, leading to erratic chip resets.",
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    category: "Hardware Design",
    categoryColor: "#ec4899",
    author: {
      name: "Hiroshi Tanaka",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80",
      role: "Lead Hardware Designer"
    },
    date: "July 5, 2026",
    readTime: "10 min read",
    tags: ["PCB", "Hardware", "Electronics", "PCB Design"],
    featured: false
  },
  {
    id: 6,
    slug: "introduction-to-rtos-multitasking",
    title: "Introduction to RTOS: When to Move Beyond the Arduino void loop()",
    excerpt: "Struggling with multitasking in your firmware? Learn how a Real-Time Operating System like FreeRTOS can simplify complex task scheduling.",
    body: "Most beginner firmware utilizes the classic Arduino structure: a setup function followed by a single, continuous void loop(). While this works well for simple scripts, it falls short when building complex systems. If your program needs to read temperature sensors, process GPS data, refresh an OLED display, and listen for incoming Wi-Fi messages, a single sequential loop will introduce lag and miss critical sensor events.\n\nThis is where a Real-Time Operating System (RTOS) like FreeRTOS is essential. An RTOS divides your firmware into independent, concurrent tasks, each with its own memory stack and priority level. The RTOS scheduler manages these tasks, rapidly swapping execution between them (preemption) based on priorities, giving the illusion of true parallel multitasking.\n\nFor example, you can create a high-priority task for reading motor encoders (which must not be missed) and a low-priority task for updating the user display. If the encoder task needs to execute, the RTOS will instantly pause the display task, run the encoder calculations, and resume the display task. This guarantees deterministic behavior for critical operations.\n\nMoving to an RTOS does require adjusting your programming style. You must learn to use thread-safe synchronization tools like Mutexes (to prevent tasks from accessing shared pins simultaneously) and Queues (to safely pass data packets between tasks). However, the resulting code is highly modular, robust, and scalable.",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80",
    category: "Firmware Development",
    categoryColor: "#3b82f6",
    author: {
      name: "Linda Wu",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      role: "Firmware Architect"
    },
    date: "July 7, 2026",
    readTime: "8 min read",
    tags: ["RTOS", "Firmware", "FreeRTOS", "Embedded Systems"],
    featured: false
  }
];
