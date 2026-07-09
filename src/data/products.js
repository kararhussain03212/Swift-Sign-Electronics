export const products = [
  {
    id: 1,
    name: "Professional Digital Soldering Station",
    slug: "professional-digital-soldering-station",
    category: "Tools",
    brand: "Weller",
    model: "WD-80",
    price: 189.99,
    discount: 15,
    rating: 4.8,
    reviews: 142,
    thumbnail: "/products/prod_1_soldering_1783336796232.png",
    images: [
      "/products/prod_1_soldering_1783336796232.png"
    ],
    description: "High-precision digital soldering station with temperature control, rapid heating, and an ergonomic heat-resistant handle.",
    introduction: {
      overview: "The Weller Digital Soldering Station is designed for professional technicians and hobbyists alike. It offers precise temperature regulation, dynamic heat recovery, and a digital LCD panel to display real-time telemetry. Its compact size ensures it fits neatly on any workbench.",
      purpose: "Provide highly stable and controllable thermal energy for delicate surface-mount components (SMD) and through-hole soldering tasks.",
      features: [
        "Digital LCD screen for precise temperature control and adjustment",
        "Fast heating element reaching 350°C in less than 30 seconds",
        "Automatic standby and sleep modes for energy efficiency and tip protection",
        "Password lock feature to lock custom temperature settings",
        "Heat-resistant silicon cable and ergonomic handpiece with soft grip"
      ],
      applications: [
        "SMD and through-hole electronic component repair",
        "PCB prototype assembly and modification",
        "Wire splicing and cable connector terminations",
        "Small metal crafts and jewelry repair"
      ],
      advantages: [
        "Accurate temperature control prevents heat damage to sensitive components",
        "Extremely quick heat-up reduces idle time on the workbench",
        "Includes auto-cooling and timeout features to increase safety",
        "Compatible with a wide range of official Weller soldering tips"
      ]
    },
    specifications: {
      "Operating Voltage": "230V AC / 50Hz",
      "Power Output": "80 Watts",
      "Temperature Range": "100°C to 480°C (212°F to 896°F)",
      "Temperature Accuracy": "± 2°C (± 4°F)",
      "Heating Element": "Premium Ceramic Core",
      "Dimensions": "150 x 125 x 90 mm",
      "Weight": "1.89 kg",
      "ESD Safe": "Yes",
      "Display Type": "Backlit LCD",
      "Tip-to-Ground Resistance": "< 2 Ohms",
      "Warranty": "2 Years Manufacturer Warranty",
      "Country of Origin": "Germany"
    },
    shippingList: [
      { name: "Digital Soldering Station Console", count: 1 },
      { name: "Ergonomic Soldering Iron Handpiece", count: 1 },
      { name: "Safety Iron Stand with Brass Sponge Holder", count: 1 },
      { name: "Premium Brass Sponge & Cleaning Sponge", count: 1 },
      { name: "Pre-installed Fine Chisel Tip (1.6mm)", count: 1 },
      { name: "Grounding Cable", count: 1 },
      { name: "Detailed User Manual", count: 1 }
    ],
    documents: [
      { title: "Datasheet & Spec Sheet", type: "PDF", size: "1.8 MB" },
      { title: "User Manual & Guide", type: "PDF", size: "3.2 MB" },
      { title: "Safety Instructions", type: "PDF", size: "850 KB" },
      { title: "Soldering Tip Guide", type: "PDF", size: "1.1 MB" }
    ],
    relatedProducts: [2, 3, 4],
    stock: 25,
    SKU: "WT-80-SOLDR",
    tags: ["soldering", "station", "weller", "precision", "esd-safe"],
    applications: ["PCB Assembly", "SMD Repair", "Hobbyist Circuits"]
  },
  {
    id: 2,
    name: "Precision Hot Air Rework Station",
    slug: "precision-hot-air-rework-station",
    category: "Tools",
    brand: "Quick",
    model: "Q-861DW",
    price: 249.99,
    discount: 10,
    rating: 4.7,
    reviews: 86,
    thumbnail: "/products/prod_2_hotair_1783336806044.png",
    images: [
      "/products/prod_2_hotair_1783336806044.png"
    ],
    description: "Professional closed-loop hot air station for desoldering QFP, SOP, PLCC, and BGA components safely.",
    introduction: {
      overview: "The Quick Precision Hot Air Rework Station uses an advanced brushless fan system to provide smooth, high-volume hot air flow. The closed-loop temperature control allows precise thermal adjustments, making it the perfect choice for professional surface mount component repair.",
      purpose: "Provide uniform, contact-free hot air stream to desolder and rework complex IC packages and small SMD parts.",
      features: [
        "Brushless vortex motor for super silent and uniform airflow",
        "Sensor closed loop temperature control with high power output",
        "Automatic cooling function to protect heating element lifespan",
        "Includes three specialized round nozzles (5mm, 6.4mm, 8mm)",
        "Digital readout display for precise airflow and temperature monitoring"
      ],
      applications: [
        "Desoldering BGA, QFP, SOP, PLCC and SOIC chips",
        "Thermal shrink tubing applications",
        "Plastic molding and warming test operations",
        "Glue removal and adhesive softening"
      ],
      advantages: [
        "No direct contact prevents scratching or moving adjacent tiny SMDs",
        "Closed loop sensors maintain exact temperature regardless of air speed",
        "Excellent build quality built for continuous industrial/lab usage"
      ]
    },
    specifications: {
      "Operating Voltage": "110V/220V AC selectable",
      "Power Output": "1000 Watts",
      "Temperature Range": "100°C to 500°C",
      "Airflow Capacity": "1 to 120 Liters/Minute",
      "Noise Level": "< 45 dB",
      "Dimensions": "188 x 245 x 135 mm",
      "Weight": "3.65 kg",
      "Display Type": "Large LED Digital Screen",
      "Warranty": "1 Year Manufacturer Warranty",
      "Country of Origin": "China"
    },
    shippingList: [
      { name: "Hot Air Station Unit", count: 1 },
      { name: "Hot Air Handpiece with Holder", count: 1 },
      { name: "Air Nozzles (5mm, 6.4mm, 8.5mm)", count: 3 },
      { name: "Power Cord", count: 1 },
      { name: "User Instruction Booklet", count: 1 }
    ],
    documents: [
      { title: "Product Catalog Sheet", type: "PDF", size: "1.2 MB" },
      { title: "User Manual", type: "PDF", size: "2.8 MB" }
    ],
    relatedProducts: [1, 3, 5],
    stock: 12,
    SKU: "Q-861DW-HAIR",
    tags: ["hot-air", "rework", "desoldering", "bga", "smd"],
    applications: ["BGA Rework", "SMD Desoldering", "Shrink Sleeves"]
  },
  {
    id: 3,
    name: "Ergonomic Flush Wire Cutters",
    slug: "ergonomic-flush-wire-cutters",
    category: "Tools",
    brand: "Knipex",
    model: "KNX-78-03",
    price: 29.99,
    discount: 0,
    rating: 4.9,
    reviews: 312,
    thumbnail: "/products/prod_3_cutters_1783336819821.png",
    images: [
      "/products/prod_3_cutters_1783336819821.png"
    ],
    description: "Ultra-sharp precision flush cutters for clean, close cutting on copper and soft wires. Crafted with high-grade carbon steel.",
    introduction: {
      overview: "Knipex Super Knips are professional-grade electronic wire cutters. With precision-ground cutting edges without bevel, they ensure smooth flush cutting on components and circuit boards. High-comfort handles reduce hand fatigue during long assembly sessions.",
      purpose: "Cut delicate copper, component leads, and soft wire flush to the board surface without transmitting shock to the solder joints.",
      features: [
        "Precision-ground blades with micro cutting-edge offset for extreme longevity",
        "Extremely smooth movement with friction-free return spring",
        "Constructed with hardened surgical steel with high corrosion resistance",
        "Two-component multi-grip sleeves for maximum hand ergonomics",
        "Includes wire lead catcher to prevent clippings from flying"
      ],
      applications: [
        "Cutting components leads on through-hole printed circuit boards",
        "Trimming copper wire up to 1.6mm diameter",
        "Trimming plastic components and cable ties",
        "Delicate model making and structural prototypes"
      ],
      advantages: [
        "No bevel design yields a perfectly flat cut right at the PCB surface",
        "Extremely long-lasting sharpness compared to standard hardware cutters",
        "Handy wire catcher keeps workspace neat and safe"
      ]
    },
    specifications: {
      "Material": "Special Tool Steel, Oil-hardened",
      "Cutting Capacity (Soft Wire)": "Ø 0.2 - 1.6 mm",
      "Cutting Capacity (Medium-Hard)": "Ø 1.2 mm",
      "Length": "125 mm",
      "Weight": "56 grams",
      "Handle Finish": "Multi-component Grips",
      "ESD Protection": "Yes (Conforms to DIN EN 61340-5-1)",
      "Warranty": "Lifetime Limited Warranty",
      "Country of Origin": "Germany"
    },
    shippingList: [
      { name: "Super Knips Flush Cutter (125mm)", count: 1 },
      { name: "Blade Guard Plastic Cover", count: 1 },
      { name: "Lead Catcher Attachment", count: 1 }
    ],
    documents: [
      { title: "Technical Data Sheet", type: "PDF", size: "640 KB" },
      { title: "Knipex Tool Care Guide", type: "PDF", size: "1.4 MB" }
    ],
    relatedProducts: [1, 4, 14],
    stock: 98,
    SKU: "KNX-7803-CUTR",
    tags: ["hand-tools", "cutters", "flush-cut", "knipex", "precision"],
    applications: ["PCB Assembly", "Wire Trimming", "Prototyping"]
  },
  {
    id: 4,
    name: "Auto-Ranging Digital Multimeter",
    slug: "auto-ranging-digital-multimeter",
    category: "Tools",
    brand: "Fluke",
    model: "FLK-115",
    price: 179.99,
    discount: 5,
    rating: 4.8,
    reviews: 215,
    thumbnail: "/products/prod_4_multimeter_1783336842806.png",
    images: [
      "/products/prod_4_multimeter_1783336842806.png"
    ],
    description: "Compact True-RMS multimeter for field service technicians, featuring auto-ranging, voltage detection, and backlit display.",
    introduction: {
      overview: "The Fluke 115 Digital Multimeter is the go-to testing companion for electrical and electronic troubleshooters. Featuring an intuitive interface, True-RMS AC measurements, and high safety certification, it delivers reliable readings every single time.",
      purpose: "Perform troubleshooting, testing, and measurements on AC/DC voltage, resistance, current, continuity, and capacitance.",
      features: [
        "True-RMS measurements for accurate readings on non-linear loads",
        "Large, highly visible white LED backlit display for dark areas",
        "Low input impedance (LoZ) to prevent false ghost readings",
        "Resistance, continuity, frequency, and capacitance measurements",
        "CAT III 600 V safety rated for commercial and industrial use"
      ],
      applications: [
        "Circuit troubleshooting and power supply verification",
        "Checking capacitor and resistor tolerances",
        "Continuity testing in cables, wires, and circuit traces",
        "Automotive electrical testing and appliance repairs"
      ],
      advantages: [
        "Rugged external holster shields against impacts and 2m drops",
        "Auto-ranging feature automatically selects the best measurement resolution",
        "True-RMS makes it accurate on modern complex wave forms"
      ]
    },
    specifications: {
      "DC Voltage Range": "600.0 mV to 600.0 V",
      "AC Voltage Range": "600.0 mV to 600.0 V (True-RMS)",
      "DC Amps Range": "6.000 A to 10.00 A",
      "Resistance Range": "600.0 Ohms to 40.00 M-Ohms",
      "Capacitance Range": "1000 nF to 9999 µF",
      "Frequency Range": "99.99 Hz to 50.00 kHz",
      "Safety Rating": "CAT III 600 V",
      "Battery Type": "9V Alkaline (400 hours typical)",
      "Dimensions": "167 x 84 x 46 mm",
      "Weight": "550 grams (including battery)",
      "Warranty": "3 Years Limited Warranty",
      "Country of Origin": "USA"
    },
    shippingList: [
      { name: "Fluke 115 Multimeter Console", count: 1 },
      { name: "Yellow Protective Rubber Holster", count: 1 },
      { name: "TL75 Hard Point Test Lead Set", count: 1 },
      { name: "Pre-installed 9V Battery", count: 1 },
      { name: "Certificate of Calibration", count: 1 },
      { name: "Quick Start Guide", count: 1 }
    ],
    documents: [
      { title: "Technical Specifications Sheet", type: "PDF", size: "1.4 MB" },
      { title: "User Manual (Multi-Language)", type: "PDF", size: "4.1 MB" },
      { title: "Calibration Manual", type: "PDF", size: "1.9 MB" }
    ],
    relatedProducts: [1, 3, 9],
    stock: 45,
    SKU: "FLK-115-DMM",
    tags: ["testing", "multimeter", "fluke", "measuring", "voltmeter"],
    applications: ["Circuit Diagnostics", "Power Supply Test", "Hobby Engineering"]
  },
  {
    id: 5,
    name: "Mixed Domain Digital Oscilloscope",
    slug: "mixed-domain-digital-oscilloscope",
    category: "Tools",
    brand: "Rigol",
    model: "DS1104Z",
    price: 399.99,
    discount: 8,
    rating: 4.8,
    reviews: 67,
    thumbnail: "/products/prod_5_oscilloscope_1783336873444.png",
    images: [
      "/products/prod_5_oscilloscope_1783336873444.png"
    ],
    description: "4-Channel 100MHz digital oscilloscope with large screen, built-in waveform generator, and serial decoding capabilities.",
    introduction: {
      overview: "The Rigol DS1104Z Plus is an extremely popular 4-channel digital oscilloscope. Boasting a 100MHz bandwidth and a deep memory depth, it provides detailed visualization of high-speed signals. Perfect for debugging microcontrollers, SPI/I2C buses, and analog circuits.",
      purpose: "Graphically display electrical voltage waveforms over time to analyze signal behavior, integrity, and noise.",
      features: [
        "4 analog channels with 100 MHz bandwidth",
        "1 GSa/s real-time sample rate on single channel",
        "Innovative UltraVision technology for intensity graded display",
        "Deep memory depth up to 24 Mpts for zooming into detail",
        "Free serial bus trigger and decode package (I2C, SPI, RS232, UART)"
      ],
      applications: [
        "Debugging serial communication protocols",
        "Measuring signal noise, rise/fall times and frequency jitter",
        "Analyzing analog filters and amplifier circuits",
        "Education labs and digital design prototyping"
      ],
      advantages: [
        "4 channels allow viewing input, output, and multiple communication lines simultaneously",
        "Large 7-inch TFT color display makes tracking multiple waveforms easy",
        "Rich trigger menu including edge, pulse, slope, video, and pattern options"
      ]
    },
    specifications: {
      "Bandwidth": "100 MHz",
      "Analog Channels": "4 Channels",
      "Real-time Sample Rate": "1.0 GSa/s (Max)",
      "Max Memory Depth": "24 Mpts (Standard)",
      "Waveform Capture Rate": "30,000 wfms/s",
      "Vertical Sensitivity": "1 mV/div to 10 V/div",
      "Vertical Resolution": "8 bits",
      "Interface": "USB Host, USB Device, LAN (LXI)",
      "Display": "7.0 inch WVGA (800x480) TFT Color LCD",
      "Dimensions": "313 x 160.8 x 122.4 mm",
      "Weight": "3.2 kg",
      "Warranty": "3 Years Manufacturer Warranty",
      "Country of Origin": "China"
    },
    shippingList: [
      { name: "Rigol DS1104Z Plus Oscilloscope Mainframe", count: 1 },
      { name: "PVP2200 200MHz Passive Probes (1x/10x)", count: 4 },
      { name: "USB Interface Cable", count: 1 },
      { name: "Power Cord (Regional)", count: 1 },
      { name: "Calibration Certificate", count: 1 },
      { name: "Quick Reference User Guide", count: 1 }
    ],
    documents: [
      { title: "Rigol DS1000Z Series Datasheet", type: "PDF", size: "3.8 MB" },
      { title: "Comprehensive User Manual", type: "PDF", size: "7.2 MB" },
      { title: "Programming Guide (SCPI Commands)", type: "PDF", size: "4.9 MB" }
    ],
    relatedProducts: [6, 7, 8],
    stock: 8,
    SKU: "RGL-DS1104Z",
    tags: ["measuring", "oscilloscope", "rigol", "signals", "diagnostics"],
    applications: ["SPI/I2C Debugging", "AC Signal Analysis", "Education Lab"]
  },
  {
    id: 6,
    name: "Linear Triple Output DC Power Supply",
    slug: "linear-triple-output-dc-power-supply",
    category: "Instruments",
    brand: "Rigol",
    model: "DP832",
    price: 349.99,
    discount: 12,
    rating: 4.6,
    reviews: 45,
    thumbnail: "/products/prod_6_power_supply_1783336885030.png",
    images: [
      "/products/prod_6_power_supply_1783336885030.png"
    ],
    description: "Highly stable, low ripple linear DC power supply with three independent channels, total 195W power, and programmable USB control.",
    introduction: {
      overview: "The DP832 is a triple-channel, high-performance programmable linear DC power supply. Featuring low ripple and noise, rapid transient response, and excellent line/load regulation, it is an essential instrument for powering sensitive circuits.",
      purpose: "Deliver clean, regulated, adjustable DC voltage and current to electronic projects and devices during testing.",
      features: [
        "3 isolated channels: 30V/3A, 30V/3A, and 5V/3A",
        "Extremely low ripple and noise: < 350 µVrms / 2 mVpp",
        "Fast transient response time: < 50 µs",
        "Built-in overvoltage (OVP) and overcurrent (OCP) safety limits",
        "USB, LAN, and digital IO interfaces for full remote control"
      ],
      applications: [
        "Powering op-amps, microcontrollers, and logic circuits",
        "Product stress testing and voltage sweeps",
        "Simulating fluctuating battery conditions",
        "General-purpose electronics bench testing"
      ],
      advantages: [
        "Linear topology ensures virtually zero high-frequency switching noise",
        "Independent isolation allows channels to be connected in series or parallel",
        "Bright 3.5 inch color display shows real-time V/A/W graphs"
      ]
    },
    specifications: {
      "Total Power": "195 Watts",
      "Output Channels": "3 (CH1: 0-30V/3A, CH2: 0-30V/3A, CH3: 0-5V/3A)",
      "Load Regulation": "Voltage: < 0.01% + 2mV, Current: < 0.01% + 250µA",
      "Line Regulation": "Voltage: < 0.01% + 2mV, Current: < 0.01% + 250µA",
      "Ripple and Noise": "< 350 µVrms / 2 mVpp (20Hz to 20MHz)",
      "Response Time": "< 50 µs (50% to 100% load change)",
      "Display Screen": "3.5\" TFT Color LCD",
      "Dimensions": "239 x 157 x 418 mm",
      "Weight": "10.5 kg",
      "Warranty": "3 Years Manufacturer Warranty",
      "Country of Origin": "China"
    },
    shippingList: [
      { name: "Rigol DP832 DC Power Supply Console", count: 1 },
      { name: "Heavy Duty Crocodile Clip Lead Set", count: 3 },
      { name: "USB Communications Cable", count: 1 },
      { name: "Fuse Spares (5A)", count: 2 },
      { name: "AC Power Lead", count: 1 },
      { name: "Product Safety Instructions Booklet", count: 1 }
    ],
    documents: [
      { title: "Rigol DP800 Series Datasheet", type: "PDF", size: "2.5 MB" },
      { title: "DP832 User Manual", type: "PDF", size: "5.4 MB" }
    ],
    relatedProducts: [5, 7, 8],
    stock: 6,
    SKU: "RGL-DP832-PWR",
    tags: ["power-supply", "instruments", "rigol", "bench-power", "linear"],
    applications: ["Bench Prototyping", "Sensor Testing", "Hardware Verification"]
  },
  {
    id: 7,
    name: "Dual-Channel Arbitrary Function Generator",
    slug: "dual-channel-arbitrary-function-generator",
    category: "Instruments",
    brand: "Siglent",
    model: "SDG1032X",
    price: 289.99,
    discount: 10,
    rating: 4.5,
    reviews: 32,
    thumbnail: "/products/prod_7_func_gen_1783336896544.png",
    images: [
      "/products/prod_7_func_gen_1783336896544.png"
    ],
    description: "30MHz DDS signal generator with dual output channels, 150MSa/s sample rate, and built-in standard and arbitrary waveforms.",
    introduction: {
      overview: "The Siglent SDG1032X is a dual-channel function/arbitrary waveform generator. Using innovative EasyPulse technology, it produces stable, low-jitter square waves and pulses up to 30MHz. Perfect for simulating sensor inputs, clock signals, and testing filters.",
      purpose: "Generate predictable, repeatable periodic electrical waveforms (sine, square, triangle, noise, etc.) to inject into a test circuit.",
      features: [
        "Dual independent channels with copy/tracking settings",
        "Maximum output frequency of 30 MHz",
        "150 MSa/s sampling rate with 14-bit vertical resolution",
        "EasyPulse technology preserves fast rise/fall edges even at low frequency",
        "Includes sweep, burst, and multiple modulation types (AM, FM, PM, PWM)"
      ],
      applications: [
        "Simulating complex sensor signals for microcontrollers",
        "Testing frequency response of amplifiers and passive filters",
        "Generating clock references for digital communication circuits",
        "Acoustic and vibration testing"
      ],
      advantages: [
        "Dual channels allow running two phase-aligned signals simultaneously",
        "Arbitrary shape editing software included to draw custom waves",
        "High frequency stability and low distortion output"
      ]
    },
    specifications: {
      "Max Frequency": "30 MHz",
      "Output Channels": "2 Channels",
      "Sampling Rate": "150 MSa/s",
      "Vertical Resolution": "14 bits",
      "Waveform Length": "16 kpts",
      "Standard Waveforms": "Sine, Square, Ramp, Pulse, Noise, DC, Arb",
      "Modulation Types": "AM, FM, PM, ASK, FSK, PSK, PWM, Sweep, Burst",
      "Display": "3.5 inch TFT Color Display",
      "Dimensions": "296 x 107 x 124 mm",
      "Weight": "3.4 kg",
      "Warranty": "3 Years Manufacturer Warranty",
      "Country of Origin": "China"
    },
    shippingList: [
      { name: "SDG1032X Waveform Generator Console", count: 1 },
      { name: "BNC-to-BNC Cable (1m)", count: 1 },
      { name: "BNC-to-Crocodile Clip Lead", count: 1 },
      { name: "USB Cable", count: 1 },
      { name: "AC Power Cord", count: 1 },
      { name: "Quick Start Guide & CD Software", count: 1 }
    ],
    documents: [
      { title: "SDG1000X Series Datasheet", type: "PDF", size: "2.1 MB" },
      { title: "User Operation Manual", type: "PDF", size: "4.8 MB" }
    ],
    relatedProducts: [5, 6, 8],
    stock: 9,
    SKU: "SIG-SDG1032X",
    tags: ["signal-generator", "instruments", "siglent", "waveforms", "dds"],
    applications: ["Signal Injection", "Filter Testing", "MCU Clock Source"]
  },
  {
    id: 8,
    name: "High-Speed 16-Channel Logic Analyzer",
    slug: "high-speed-16-channel-logic-analyzer",
    category: "Instruments",
    brand: "Saleae",
    model: "Logic-Pro-16",
    price: 499.99,
    discount: 0,
    rating: 4.9,
    reviews: 18,
    thumbnail: "/products/prod_8_logic_analyzer_1783336907806.png",
    images: [
      "/products/prod_8_logic_analyzer_1783336907806.png"
    ],
    description: "Premium USB-based 16-channel logic analyzer and mixed-signal recorder. Captures digital and analog signals with state-of-the-art software.",
    introduction: {
      overview: "The Saleae Logic Pro 16 is a USB-based digital diagnostic tool. Designed for embedded systems developers, it records digital lines and analog signals side-by-side. The cross-platform Saleae Logic software automatically decodes SPI, I2C, CAN, USB, and 20+ other communication protocols.",
      purpose: "Capture and debug high-speed digital state transactions and analog voltage levels on microchip interfaces.",
      features: [
        "16 digital channels plus 16 analog channels (shared inputs)",
        "Captures digital signals up to 500 MSa/s",
        "Captures analog signals up to 50 MSa/s with 12-bit ADC",
        "USB 3.0 SuperSpeed connection for streaming unlimited data to PC",
        "Aluminum enclosure for excellent shielding and durability"
      ],
      applications: [
        "Debugging firmware and communication registers",
        "Analyzing microsecond timing errors on SPI/I2C/CAN buses",
        "Monitoring analog voltages of ADC/DAC circuits",
        "Reverse engineering communication protocols"
      ],
      advantages: [
        "Extremely intuitive software makes searching millions of samples instant",
        "Compact pocket-sized design powered fully by USB",
        "Supports Windows, macOS, and Linux out of the box"
      ]
    },
    specifications: {
      "Digital Channels": "16 Channels",
      "Analog Channels": "16 Channels (Shared with digital)",
      "Max Digital Sample Rate": "500 MSa/s",
      "Max Analog Sample Rate": "50 MSa/s",
      "Analog Bandwidth": "5 MHz",
      "Voltage Range": "-10.00 V to +10.00 V",
      "PC Connection": "USB 3.0",
      "Enclosure Material": "Anodized Aluminum",
      "Supported OS": "Windows 10/11, macOS 10.14+, Linux Ubuntu",
      "Warranty": "2 Years Manufacturer Warranty",
      "Country of Origin": "USA"
    },
    shippingList: [
      { name: "Saleae Logic Pro 16 Unit", count: 1 },
      { name: "Test Lead Wire Harnesses (9-pin)", count: 2 },
      { name: "Micro Grabber Test Clips", count: 18 },
      { name: "USB 3.0 Connection Cable (1.5m)", count: 1 },
      { name: "Premium Neoprene Carrying Case", count: 1 }
    ],
    documents: [
      { title: "Saleae Logic Pro 16 Datasheet", type: "PDF", size: "2.3 MB" },
      { title: "Quick-Start Hookup Guide", type: "PDF", size: "980 KB" },
      { title: "SDK / Custom Scripting Documentation", type: "PDF", size: "3.5 MB" }
    ],
    relatedProducts: [5, 6, 7],
    stock: 5,
    SKU: "SAL-LOGIC-16",
    tags: ["logic-analyzer", "saleae", "debugging", "usb", "instruments"],
    applications: ["Embedded Systems", "Protocol Decoding", "Timing Analysis"]
  },
  {
    id: 9,
    name: "True-RMS AC/DC Clamp Meter",
    slug: "true-rms-ac-dc-clamp-meter",
    category: "Instruments",
    brand: "Fluke",
    model: "FLK-325",
    price: 219.99,
    discount: 0,
    rating: 4.7,
    reviews: 58,
    thumbnail: "/products/prod_9_clamp_meter_1783336917964.png",
    images: [
      "/products/prod_9_clamp_meter_1783336917964.png"
    ],
    description: "Rugged AC/DC clamp meter for commercial and residential electricians. Measures current up to 400A without breaking the circuit.",
    introduction: {
      overview: "The Fluke 325 is a True-RMS clamp meter designed for commercial and residential electricians. Featuring a slim jaw profile, it allows easy access in crowded cable panels and measures AC/DC current, voltage, frequency, and temperature.",
      purpose: "Safely measure high electrical currents in active conductors without physically breaking or cutting the wire loop.",
      features: [
        "AC/DC current measurement up to 400 A",
        "AC/DC voltage measurement up to 600 V",
        "True-RMS sensing for accurate readings on distorted waveforms",
        "Resistance measurement up to 40 k-Ohms with continuity test",
        "Large backlight display and Min/Max recording values"
      ],
      applications: [
        "Measuring motor load currents in HVAC systems",
        "Verifying distribution panel load balance",
        "Measuring charging currents on solar and battery banks",
        "Residential electrical troubleshooting"
      ],
      advantages: [
        "Jaw opening accommodates cables up to 30mm diameter",
        "Includes Type-K thermocouple for quick temperature checks",
        "Slim, compact body fits comfortably in pocket or tool pouch"
      ]
    },
    specifications: {
      "AC Current Range": "40.00 A / 400.0 A",
      "DC Current Range": "40.00 A / 400.0 A",
      "AC Voltage Range": "600.0 V (True-RMS)",
      "DC Voltage Range": "600.0 V",
      "Resistance": "400.0 Ohms to 40.00 k-Ohms",
      "Frequency Range": "5.0 Hz to 500.0 Hz",
      "Temperature Range": "-10.0°C to 400.0°C (with probe)",
      "Max Wire Diameter": "30 mm",
      "Safety Rating": "CAT III 600V / CAT IV 300V",
      "Warranty": "2 Years Manufacturer Warranty",
      "Country of Origin": "USA"
    },
    shippingList: [
      { name: "Fluke 325 Clamp Meter Console", count: 1 },
      { name: "TL75 Hard Point Test Leads", count: 1 },
      { name: "80BK-A Type-K Thermocouple Probe", count: 1 },
      { name: "Soft Zipper Carrying Pouch", count: 1 },
      { name: "AAA Batteries (Pre-installed)", count: 2 },
      { name: "User manual", count: 1 }
    ],
    documents: [
      { title: "Fluke 320 Series Datasheet", type: "PDF", size: "1.1 MB" },
      { title: "Instruction Sheet", type: "PDF", size: "2.3 MB" }
    ],
    relatedProducts: [4, 6],
    stock: 19,
    SKU: "FLK-325-CLAMP",
    tags: ["testing", "clamp-meter", "fluke", "current-clamp", "measuring"],
    applications: ["HVAC Diagnostics", "Panel Load Test", "Solar Maintenance"]
  },
  {
    id: 10,
    name: "Autonomous Arduino Robotics Starter Kit",
    slug: "autonomous-arduino-robotics-starter-kit",
    category: "Projects",
    brand: "Arduino",
    model: "ARD-2WD-KIT",
    price: 89.99,
    discount: 20,
    rating: 4.7,
    reviews: 184,
    thumbnail: "/products/prod_10_robot_kit_1783336926773.png",
    images: [
      "/products/prod_10_robot_kit_1783336926773.png"
    ],
    description: "Complete educational DIY robotics kit based on Arduino Uno. Build an obstacle-avoiding, Bluetooth-controlled 2WD vehicle.",
    introduction: {
      overview: "Unleash your inner robotics engineer with this comprehensive Arduino Robotics Starter Kit. It contains all the parts, sensors, and structural chassis components to build your own intelligent mobile robot. Step-by-step interactive lessons guide you through assembly and coding.",
      purpose: "Learn core concepts of firmware programming, sensor integration, motor speed control, and autonomous decision-making algorithms.",
      features: [
        "Includes Arduino Uno R3 compatible microcontroller board",
        "Laser-cut durable acrylic dual-deck chassis",
        "Ultrasonic distance sensor with micro servo mount for panning",
        "L298N Dual H-bridge motor driver module",
        "Bluetooth transceiver for smartphone application control"
      ],
      applications: [
        "STEM and high school educational projects",
        "Learning C++ Arduino programming language",
        "Hobby robotics experimentation",
        "Algorithmic maze solving and obstacle routing"
      ],
      advantages: [
        "No soldering required – uses clean plug-and-play breadboard wiring",
        "Fully open-source code templates provided",
        "Expandable chassis with mounting holes for custom add-on sensors"
      ]
    },
    specifications: {
      "Microcontroller": "ATmega328P (Arduino Uno)",
      "Operating Voltage": "7V to 12V DC (via battery holder)",
      "Motor Voltage": "3V - 9V DC Geared Motors",
      "Chassis Material": "Acrylic (3mm thickness)",
      "Communication": "Bluetooth HC-05 Module",
      "Sensors Included": "Ultrasonic, Infrared Obstacle, Photoresistor",
      "Programming Interface": "USB (Arduino IDE compatible)",
      "Difficulty Level": "Beginner to Intermediate",
      "Assembly Time": "2 to 3 Hours (Typical)",
      "Warranty": "6 Months Limited Warranty",
      "Country of Origin": "Italy"
    },
    shippingList: [
      { name: "Arduino Uno R3 Compatible Board", count: 1 },
      { name: "Acrylic Chassis Plates & Hardware", count: 2 },
      { name: "DC Geared Motors & Rubber Wheels", count: 2 },
      { name: "L298N Motor Driver Shield", count: 1 },
      { name: "Ultrasonic Distance Sensor HC-SR04", count: 1 },
      { name: "SG90 Micro Servo Motor", count: 1 },
      { name: "40-pin Jumper Wire Set (Male-Male/Male-Female)", count: 2 },
      { name: "4x AA Battery Holder", count: 1 },
      { name: "Assembly Screwdriver & Spanner", count: 1 }
    ],
    documents: [
      { title: "Robotics Assembly Manual", type: "PDF", size: "5.2 MB" },
      { title: "Arduino Code Templates & Libraries", type: "ZIP", size: "2.4 MB" },
      { title: "Wiring Schematics & Diagram", type: "PDF", size: "1.7 MB" }
    ],
    relatedProducts: [11, 12, 13],
    stock: 50,
    SKU: "ARD-ROB-KIT",
    tags: ["robotics", "arduino", "diy-kits", "education", "stem"],
    applications: ["STEM Education", "Obstacle Avoidance", "Mobile Apps"]
  },
  {
    id: 11,
    name: "Zigbee Smart Home IoT Learning Kit",
    slug: "zigbee-smart-home-iot-learning-kit",
    category: "Projects",
    brand: "SparkFun",
    model: "SF-IOT-32",
    price: 124.99,
    discount: 10,
    rating: 4.6,
    reviews: 56,
    thumbnail: "/products/prod_11_iot_kit_1783336935122.png",
    images: [
      "/products/prod_11_iot_kit_1783336935122.png"
    ],
    description: "Explore IoT (Internet of Things) with this ESP32 & Zigbee sensor development kit. Create custom smart home monitors and alerts.",
    introduction: {
      overview: "The Smart Home IoT Learning Kit lets you build and program real-world smart home systems. Featuring an ESP32 microchip with dual-core processor and wireless capabilities, it communicates with DHT22 temperature sensors, flame detectors, gas sensors, and relays. Hook it up to open-source Home Assistant or write custom MQTT servers.",
      purpose: "Learn to fetch real-world sensor data, transmit it wirelessly, and control appliances using relays and mobile apps.",
      features: [
        "ESP32-WROOM development board with built-in Wi-Fi & BLE",
        "Sensors for Temperature, Humidity, Soil Moisture, and Gas Leakage",
        "5V electromagnetic relay module to trigger high-voltage appliances safely",
        "Detailed tutorials for configuring MQTT, Home Assistant, and ESPHome",
        "1602 LCD character display with I2C interface"
      ],
      applications: [
        "Home automated greenhouse climate monitors",
        "Fire and gas leak detection warning systems",
        "Smart lighting triggers and automatic curtain timers",
        "College IoT research projects"
      ],
      advantages: [
        "Wi-Fi and Bluetooth allow direct smartphone connections without hubs",
        "Sensors use I2C/SPI pins keeping breadboard routing neat",
        "Comes with pre-configured dashboard webserver templates"
      ]
    },
    specifications: {
      "Core Microchip": "ESP32-D0WDQ6 Dual-Core 240MHz",
      "Wireless Protocol": "Wi-Fi 802.11 b/g/n, Bluetooth v4.2 BR/EDR & BLE",
      "Input Voltage": "5V USB or 3.7V LiPo Battery",
      "Display Module": "16x2 Character LCD (I2C interface, blue backlight)",
      "Relay Rating": "10A @ 250V AC / 10A @ 30V DC",
      "Programming support": "Arduino IDE, ESP-IDF, MicroPython, ESPHome",
      "Sensors Included": "DHT22 (Temp/Hum), MQ-2 (Gas/Smoke), Soil Moisture, LDR",
      "Warranty": "1 Year Manufacturer Warranty",
      "Country of Origin": "USA"
    },
    shippingList: [
      { name: "ESP32 Dev Board pre-soldered", count: 1 },
      { name: "DHT22 Precision Climate Sensor", count: 1 },
      { name: "MQ-2 Flammable Gas Sensor", count: 1 },
      { name: "Analog Soil Moisture probe", count: 1 },
      { name: "5V Isolated Relay Module", count: 1 },
      { name: "830 Tie-Point Breadboard", count: 1 },
      { name: "40-pin Dupont Male-to-Male jumper bundle", count: 1 },
      { name: "Micro USB Cable", count: 1 }
    ],
    documents: [
      { title: "ESP32 Smart Home Kit Guide", type: "PDF", size: "4.5 MB" },
      { title: "Schematic Wiring Layout", type: "PDF", size: "1.2 MB" },
      { title: "MQTT Dashboard Code Package", type: "ZIP", size: "1.8 MB" }
    ],
    relatedProducts: [10, 12, 13],
    stock: 32,
    SKU: "SF-IOT-HOME",
    tags: ["iot", "smart-home", "esp32", "sensors", "sparkfun"],
    applications: ["Home Automation", "Climate Logging", "Wireless Alerts"]
  },
  {
    id: 12,
    name: "Smart Line-Following Robot Kit",
    slug: "smart-line-following-robot-kit",
    category: "Projects",
    brand: "Adafruit",
    model: "ADA-RP2040-LF",
    price: 74.99,
    discount: 15,
    rating: 4.8,
    reviews: 74,
    thumbnail: "/products/prod_12_line_bot_1783336946432.png",
    images: [
      "/products/prod_12_line_bot_1783336946432.png"
    ],
    description: "An infrared sensor-based line tracker robot kit. Learn PID controller logic and calibration procedures.",
    introduction: {
      overview: "The Adafruit Line-Following Robot Kit is designed to teach PID (Proportional-Integral-Derivative) control systems. Featuring a multi-channel infrared sensor array and high-efficiency micro-metal gearmotors, it tracks complex tracks, intersecting curves, and sharp angles with high agility.",
      purpose: "Calibrate infrared sensors and implement a control loop to guide a robot vehicle along a dark track on a light surface.",
      features: [
        "5-Channel high-sensitivity IR sensor array for high-accuracy tracking",
        "TB6612FNG Dual DC Motor Driver for smooth speed control",
        "Compact circular chassis ideal for spinning on its center point",
        "Pre-written calibration script with autotuning options",
        "High-performance micro-metal gearmotors with metal shafts"
      ],
      applications: [
        "STEM school robotic competitions",
        "Learning feedback loops and control theory",
        "Micro-mouse maze routing experiments",
        "PID parameter optimization studies"
      ],
      advantages: [
        "Metal gearmotors offer significantly better torque and reliability than plastic equivalents",
        "Onboard power switch saves battery when downloading firmware",
        "Lightweight construction enables high-speed track navigation"
      ]
    },
    specifications: {
      "Controller Board": "Adafruit Feather RP2040",
      "Motor Driver": "TB6612FNG (Up to 1.2A continuous per channel)",
      "Sensors": "5x Reflective IR Phototransistor Array",
      "Motors": "2x Micro-Metal Gearmotors (150:1 gear ratio)",
      "Maximum Speed": "0.8 Meters/Second",
      "Power Source": "4x AAA Battery or 3.7V LiPo Battery",
      "Dimensions": "115 x 115 x 65 mm",
      "Weight": "190 grams (without batteries)",
      "Warranty": "90 Days Limited Warranty",
      "Country of Origin": "USA"
    },
    shippingList: [
      { name: "Feather RP2040 Microcontroller", count: 1 },
      { name: "Feather Motor Wing Shield", count: 1 },
      { name: "Anodized Aluminum Robot Chassis", count: 1 },
      { name: "5-Channel IR Line-Tracking Sensor Board", count: 1 },
      { name: "Micro-Metal Gearmotors & Rubber Tires", count: 2 },
      { name: "Front Nylon Castor Ball Wheel", count: 1 },
      { name: "LiPo Battery (3.7V, 500mAh)", count: 1 },
      { name: "Instruction sheet and track paper", count: 1 }
    ],
    documents: [
      { title: "PID Controller Calibration Manual", type: "PDF", size: "3.2 MB" },
      { title: "Feather RP2040 Pinout Diagram", type: "PDF", size: "1.1 MB" },
      { title: "Line Follower Arduino Library", type: "ZIP", size: "850 KB" }
    ],
    relatedProducts: [10, 11, 14],
    stock: 22,
    SKU: "ADA-LINE-ROB",
    tags: ["robotics", "adafruit", "line-follow", "pid-control", "diy-kits"],
    applications: ["PID Tuning Labs", "STEM Competitions", "Embedded C++"]
  },
  {
    id: 13,
    name: "ESP32 Weather Station & IoT Kit",
    slug: "esp32-weather-station-and-iot-kit",
    category: "Projects",
    brand: "SparkFun",
    model: "SF-WEATH-32",
    price: 94.99,
    discount: 5,
    rating: 4.7,
    reviews: 42,
    thumbnail: "/products/prod_13_weather_kit_1783336954845.png",
    images: [
      "/products/prod_13_weather_kit_1783336954845.png"
    ],
    description: "Build an internet-connected weather monitoring station with Barometric Pressure, Temp, Humidity, and OLED display.",
    introduction: {
      overview: "The SparkFun Weather Station & IoT Kit is a full sensor dashboard kit. It is centered around a powerful ESP32 board and features the BME280 environmental sensor. Capture atmospheric pressure, altitude, humidity, and temperature. Send data automatically to cloud services like ThingSpeak or Adafruit IO, and display local data on a bright 0.96 inch OLED.",
      purpose: "Acquire high-precision weather parameters and publish them to cloud IoT databases.",
      features: [
        "ESP32 IoT board with integrated LiPo charging circuit",
        "High-accuracy BME280 sensor (Temp, Humidity, Pressure, Altitude)",
        "0.96\" 128x64 pixels Blue OLED display (I2C)",
        "Pre-written code for cloud posting and energy-saving deep sleep",
        "SparkFun Qwiic connectors for solderless daisy-chain hookup"
      ],
      applications: [
        "Home microclimate and ambient weather loggers",
        "Greenhouse environmental monitoring",
        "IoT cloud telemetry and charting research",
        "Low-power solar weather nodes"
      ],
      advantages: [
        "Uses Qwiic connect system for absolute plug-and-play assembly",
        "Deep sleep programming code drops power consumption to under 15 µA",
        "Ready-made ThingSpeak dashboards with open API access templates"
      ]
    },
    specifications: {
      "Board Processor": "ESP32 (WROOM-32E module)",
      "Sensor Model": "Bosch BME280 (I2C/SPI)",
      "Temp Range / Accuracy": "-40°C to 85°C / ± 1°C",
      "Humidity Range / Accuracy": "0% to 100% RH / ± 3%",
      "Pressure Range / Accuracy": "300 hPa to 1100 hPa / ± 1 hPa",
      "Display Module": "0.96\" I2C OLED SSD1306",
      "Hookup System": "Qwiic Connector Cables (Included)",
      "Operating Voltage": "3.3V DC (USB or LiPo)",
      "Warranty": "1 Year Manufacturer Warranty",
      "Country of Origin": "USA"
    },
    shippingList: [
      { name: "SparkFun ESP32 Thing Plus Board", count: 1 },
      { name: "SparkFun BME280 Environmental Sensor breakout", count: 1 },
      { name: "0.96\" I2C OLED Display Module", count: 1 },
      { name: "Qwiic Connect Cables (50mm)", count: 2 },
      { name: "Breadboard & Rubber Feet", count: 1 },
      { name: "Jumper Cable Pack", count: 1 },
      { name: "Micro USB Cable (1m)", count: 1 }
    ],
    documents: [
      { title: "SparkFun Weather Station Assembly Guide", type: "PDF", size: "3.5 MB" },
      { title: "Bosch BME280 Datasheet", type: "PDF", size: "1.8 MB" },
      { title: "ThingSpeak API Hookup Manual", type: "PDF", size: "1.4 MB" }
    ],
    relatedProducts: [10, 11, 12],
    stock: 15,
    SKU: "SF-WTHR-ESP32",
    tags: ["iot", "weather-station", "esp32", "sensors", "sparkfun", "bme280"],
    applications: ["Weather Logging", "Greenhouse Monitoring", "ThingSpeak Cloud"]
  },
  {
    id: 14,
    name: "DIY FM Radio Soldering PCB Kit",
    slug: "diy-fm-radio-soldering-pcb-kit",
    category: "Projects",
    brand: "Adafruit",
    model: "ADA-FM-RDA",
    price: 19.99,
    discount: 0,
    rating: 4.8,
    reviews: 152,
    thumbnail: "/products/prod_14_radio_kit_1783336964305.png",
    images: [
      "/products/prod_14_radio_kit_1783336964305.png"
    ],
    description: "Start your soldering journey! Assemble a portable, functional FM radio tuner with digital search and speaker output.",
    introduction: {
      overview: "The DIY FM Radio Soldering PCB Kit is the ultimate project for learning how to solder. The circuit features an RDA5807 FM radio receiver chip, a power amplifier, and tact buttons for scan/volume control. All components are through-hole, making soldering straightforward.",
      purpose: "Practice through-hole soldering techniques and build a working analog/digital radio.",
      features: [
        "High quality silkscreened PCB with clear component mapping outlines",
        "RDA5807 FM radio receiver chip with auto search scan",
        "Built-in LM386 low voltage audio power amplifier",
        "Includes miniature 8-ohm 0.5W speaker",
        "Powered by standard 2x AA batteries"
      ],
      applications: [
        "Soldering training and introduction courses",
        "DIY electronic hobby crafts",
        "Learning basic audio amplifier stages",
        "Hands-on electronics assembly kits"
      ],
      advantages: [
        "Extremely detailed soldering manual with photographic steps",
        "Wide pads and tracing lines prevents accidental solder bridges",
        "Gives you a fully operational radio to listen to after completion"
      ]
    },
    specifications: {
      "Radio Chipset": "RDA5807 (FM tuner)",
      "FM Frequency Range": "76 MHz to 108 MHz",
      "Amplifier Chip": "LM386 Audio Amp",
      "Speaker Specification": "8 Ohms, 0.5W (Diameter 40mm)",
      "Input Power": "3V DC (2x AA Batteries)",
      "Current Draw": "About 40 mA",
      "PCB dimensions": "82 x 65 mm",
      "PCB Material": "FR-4 Fiber Glass",
      "Difficulty Level": "Absolute Beginner",
      "Warranty": "30 Days Return Warranty",
      "Country of Origin": "USA"
    },
    shippingList: [
      { name: "Unassembled FM Radio FR-4 PCB", count: 1 },
      { name: "Pre-programmed RDA5807 IC DIP-8", count: 1 },
      { name: "LM386 Audio Amplifier IC DIP-8", count: 1 },
      { name: "Resistors, Capacitors & Inductor Pack", count: 1 },
      { name: "Tactile Press Buttons", count: 5 },
      { name: "Telescopic Radio Antenna", count: 1 },
      { name: "8 Ohm Speaker & Battery Case", count: 1 },
      { name: "Detailed Assembly Instructions Booklet", count: 1 }
    ],
    documents: [
      { title: "Soldering & Tuning Manual", type: "PDF", size: "2.8 MB" },
      { title: "Circuit Schematic Diagram", type: "PDF", size: "750 KB" }
    ],
    relatedProducts: [1, 3, 10],
    stock: 120,
    SKU: "ADA-FM-RADIO",
    tags: ["soldering-kit", "diy-kits", "adafruit", "fm-radio", "beginners"],
    applications: ["Soldering Practice", "Basic Audio Circuit", "Hobby Project"]
  }
,
  {
    "id": 15,
    "name": "Precision Screwdriver Set Pro",
    "slug": "precision-screwdriver-set-pro",
    "category": "Tools",
    "brand": "Weller",
    "model": "WEL-TOOL-32",
    "price": 45.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_tool.png",
    "images": [
      "/products/new_tool.png"
    ],
    "description": "High quality professional tools for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Precision Screwdriver Set Pro",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-16",
    "tags": [
      "tools"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 16,
    "name": "Ceramic Tweezers",
    "slug": "ceramic-tweezers",
    "category": "Tools",
    "brand": "Hakko",
    "price": 15.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_tool.png",
    "images": [
      "/products/new_tool.png"
    ],
    "description": "High quality professional tools for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Ceramic Tweezers",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-17",
    "tags": [
      "tools"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 17,
    "name": "Wire Stripper Ergonomic",
    "slug": "wire-stripper-ergonomic",
    "category": "Tools",
    "brand": "Knipex",
    "price": 35.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_tool.png",
    "images": [
      "/products/new_tool.png"
    ],
    "description": "High quality professional tools for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Wire Stripper Ergonomic",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-18",
    "tags": [
      "tools"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 18,
    "name": "Crimping Pliers",
    "slug": "crimping-pliers",
    "category": "Tools",
    "brand": "Engineer",
    "price": 55.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_tool.png",
    "images": [
      "/products/new_tool.png"
    ],
    "description": "High quality professional tools for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Crimping Pliers",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-19",
    "tags": [
      "tools"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 19,
    "name": "Desoldering Pump Heavy Duty",
    "slug": "desoldering-pump-heavy-duty",
    "category": "Tools",
    "brand": "Pro'sKit",
    "price": 25.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_tool.png",
    "images": [
      "/products/new_tool.png"
    ],
    "description": "High quality professional tools for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Desoldering Pump Heavy Duty",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-20",
    "tags": [
      "tools"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 20,
    "name": "Bench Multimeter Elite",
    "slug": "bench-multimeter-elite",
    "category": "Instruments",
    "brand": "Fluke",
    "price": 450.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_instrument.png",
    "images": [
      "/products/new_instrument.png"
    ],
    "description": "High quality professional instruments for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Bench Multimeter Elite",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-21",
    "tags": [
      "instruments"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 21,
    "name": "Digital Spectrum Analyzer",
    "slug": "digital-spectrum-analyzer",
    "category": "Instruments",
    "brand": "Rigol",
    "price": 899.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_instrument.png",
    "images": [
      "/products/new_instrument.png"
    ],
    "description": "High quality professional instruments for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Digital Spectrum Analyzer",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-22",
    "tags": [
      "instruments"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 22,
    "name": "Bench Power Supply 60V",
    "slug": "bench-power-supply-60v",
    "category": "Instruments",
    "brand": "Siglent",
    "price": 250.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_instrument.png",
    "images": [
      "/products/new_instrument.png"
    ],
    "description": "High quality professional instruments for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Bench Power Supply 60V",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-23",
    "tags": [
      "instruments"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 23,
    "name": "Logic Analyzer Pro 8",
    "slug": "logic-analyzer-pro-8",
    "category": "Instruments",
    "brand": "Saleae",
    "price": 299.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_instrument.png",
    "images": [
      "/products/new_instrument.png"
    ],
    "description": "High quality professional instruments for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Logic Analyzer Pro 8",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-24",
    "tags": [
      "instruments"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 24,
    "name": "Handheld LCR Meter",
    "slug": "handheld-lcr-meter",
    "category": "Instruments",
    "brand": "Keysight",
    "price": 399.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_instrument.png",
    "images": [
      "/products/new_instrument.png"
    ],
    "description": "High quality professional instruments for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Handheld LCR Meter",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-25",
    "tags": [
      "instruments"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 25,
    "name": "Smart Greenhouse Kit",
    "slug": "smart-greenhouse-kit",
    "category": "Projects",
    "brand": "Arduino",
    "price": 65.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_project.png",
    "images": [
      "/products/new_project.png"
    ],
    "description": "High quality professional projects for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Smart Greenhouse Kit",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-26",
    "tags": [
      "projects"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 26,
    "name": "Weather Station IoT Kit",
    "slug": "weather-station-iot-kit",
    "category": "Projects",
    "brand": "SparkFun",
    "price": 85.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_project.png",
    "images": [
      "/products/new_project.png"
    ],
    "description": "High quality professional projects for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Weather Station IoT Kit",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-27",
    "tags": [
      "projects"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 27,
    "name": "Neopixel Light Display Kit",
    "slug": "neopixel-light-display-kit",
    "category": "Projects",
    "brand": "Adafruit",
    "price": 45.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_project.png",
    "images": [
      "/products/new_project.png"
    ],
    "description": "High quality professional projects for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Neopixel Light Display Kit",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-28",
    "tags": [
      "projects"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 28,
    "name": "Retro Gaming Arcade Kit",
    "slug": "retro-gaming-arcade-kit",
    "category": "Projects",
    "brand": "Raspberry Pi",
    "price": 120.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_project.png",
    "images": [
      "/products/new_project.png"
    ],
    "description": "High quality professional projects for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "Retro Gaming Arcade Kit",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-29",
    "tags": [
      "projects"
    ],
    "applications": [
      "Electronics"
    ]
  },
  {
    "id": 29,
    "name": "AI Camera Recognition Kit",
    "slug": "ai-camera-recognition-kit",
    "category": "Projects",
    "brand": "DFRobot",
    "price": 95.99,
    "discount": 5,
    "rating": 4.8,
    "reviews": 42,
    "thumbnail": "/products/new_project.png",
    "images": [
      "/products/new_project.png"
    ],
    "description": "High quality professional projects for electronic projects.",
    "introduction": {
      "overview": "A great addition to your workspace.",
      "purpose": "To assist with electronic builds.",
      "features": [
        "High durability",
        "Professional grade",
        "Easy to use"
      ],
      "applications": [
        "DIY projects",
        "Professional use"
      ],
      "advantages": [
        "Reliable",
        "Cost-effective"
      ]
    },
    "specifications": {
      "Weight": "500g",
      "Warranty": "1 Year"
    },
    "shippingList": [
      {
        "name": "AI Camera Recognition Kit",
        "count": 1
      }
    ],
    "documents": [],
    "relatedProducts": [
      1,
      2,
      3
    ],
    "stock": 50,
    "SKU": "NEW-30",
    "tags": [
      "projects"
    ],
    "applications": [
      "Electronics"
    ]
  }
];
