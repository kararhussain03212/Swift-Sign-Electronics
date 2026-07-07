import React, { useState, useEffect } from 'react';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import Blogs from './components/Blogs';
import Cart from './components/Cart';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import './App.css';

const DEFAULT_PROJECTS = [
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

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [projectsList, setProjectsList] = useState(() => {
    const saved = localStorage.getItem('swift-sign-projects');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 1) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROJECTS;
  });

  const [draftsList, setDraftsList] = useState(() => {
    const saved = localStorage.getItem('swift-sign-drafts');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const handlePublishProject = (newProj) => {
    setProjectsList(prev => {
      const updated = [...prev, newProj];
      localStorage.setItem('swift-sign-projects', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveDraft = (draftProj) => {
    setDraftsList(prev => {
      const updated = [...prev, draftProj];
      localStorage.setItem('swift-sign-drafts', JSON.stringify(updated));
      return updated;
    });
  };

  // Sync back to localstorage if list changes
  useEffect(() => {
    localStorage.setItem('swift-sign-projects', JSON.stringify(projectsList));
  }, [projectsList]);

  useEffect(() => {
    localStorage.setItem('swift-sign-drafts', JSON.stringify(draftsList));
  }, [draftsList]);

  const [accountInitialIsLogin, setAccountInitialIsLogin] = useState(true);
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('swift-sign-user');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // URL Hash handling
  useEffect(() => {
    const handleUrlState = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view');

      if (view === 'add-project') {
        setActiveTab('add-project');
      } else if (hash === '#blogs' || hash === '#blogs-section' || hash === '#project-guides-section' || hash === '#featured-products-section') {
        setActiveTab('home');
        setSelectedBlog(null);
        setTimeout(() => {
          const targetId = hash === '#featured-products-section' ? 'featured-products-section' : 'project-guides-section';
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === '#preview') {
        const saved = localStorage.getItem('swift-sign-preview-project');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setActiveTab('home');
            setSelectedBlog(parsed);
          } catch (e) {
            console.error('Error loading preview', e);
          }
        }
      } else if (hash.startsWith('#project-')) {
        const projId = parseInt(hash.replace('#project-', ''), 10);
        const proj = projectsList.find(p => p.id === projId);
        if (proj) {
          setActiveTab('home');
          setSelectedBlog(proj);
        }
      }
    };

    handleUrlState();
    window.addEventListener('hashchange', handleUrlState);
    return () => window.removeEventListener('hashchange', handleUrlState);
  }, [projectsList]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('swift-sign-user', JSON.stringify(user));
    if (activeTab === 'account') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('swift-sign-user');
    setActiveTab('home');
  };

  const handleSetSelectedBlog = (blog) => {
    setSelectedBlog(blog);
    if (blog) {
      window.location.hash = `#project-${blog.id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
    }
  };

  // Cart actions
  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      }
      return [...prev, { ...item, price: item.price || 'Rs. 0', quantity: 1 }];
    });
    setWishlistItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      }
      return [...prev, { ...product, price: product.price || 'Rs. 0', quantity: 1 }];
    });
  };

  const handleAddToWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.filter(i => i.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'cart':
        return (
          <Cart 
            cartItems={cartItems} 
            onRemoveFromCart={handleRemoveFromCart}
            wishlistItems={wishlistItems}
            onMoveToCart={handleMoveToCart}
            onRemoveFromWishlist={handleRemoveFromWishlist}
          />
        );
      case 'account':
        return <Account onLoginSuccess={handleLoginSuccess} initialIsLogin={accountInitialIsLogin} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            onLoginSuccess={handleLoginSuccess} 
            drafts={draftsList}
            wishlistItems={wishlistItems}
          />
        );
      case 'add-project':
        return (
          <AddProject 
            currentUser={currentUser} 
            onRedirectToLogin={() => {
              setAccountInitialIsLogin(true);
              setActiveTab('account');
            }} 
            onAddProject={handlePublishProject}
            onSaveDraft={handleSaveDraft}
            onPreview={(proj) => {
              setActiveTab('home');
              handleSetSelectedBlog(proj);
            }}
          />
        );
      case 'home':
      default:
        return (
          <Blogs 
            currentUser={currentUser}
            selectedBlog={selectedBlog} 
            setSelectedBlog={handleSetSelectedBlog} 
            wishlistItems={wishlistItems}
            setWishlistItems={setWishlistItems}
            projects={projectsList}
            onTabChange={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
    }
  };

  return (
    <>
      <Preloader />
      <div className="app-container">
        {/* 1. Banner */}
        <Banner />

      {/* 2. Navbar */}
      <Navbar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === 'account-login') {
            setAccountInitialIsLogin(true);
            setActiveTab('account');
          } else if (tab === 'account-signup') {
            setAccountInitialIsLogin(false);
            setActiveTab('account');
          } else if (tab === 'blogs') {
            setActiveTab('home');
            setSelectedBlog(null);
            window.location.hash = '#project-guides-section';
            setTimeout(() => {
              document.getElementById('project-guides-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else if (tab === 'featured') {
            setActiveTab('home');
            setSelectedBlog(null);
            window.location.hash = '#featured-products-section';
            setTimeout(() => {
              document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            setActiveTab(tab);
            if (window.location.hash === '#blogs' || window.location.hash === '#blogs-section' || window.location.hash === '#project-guides-section' || window.location.hash === '#featured-products-section') {
              window.history.pushState("", document.title, window.location.pathname + window.location.search);
            }
            if (tab === 'home') {
              setSelectedBlog(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }} 
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={cartItems.length}
      />

      {/* 3. Hero Section Slider - Only show when not viewing details or other pages */}
      {activeTab === 'home' && !selectedBlog && <HeroSlider />}

      {/* 4. Core Page Content */}
      <main className="main-content-full">
        {renderContent()}
      </main>

      {/* 5. Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#84cc16] text-white shadow-[0_4px_14px_rgba(132,204,22,0.4)] hover:bg-[#65a30d] hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center border-2 border-white/20"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
    </>
  );
}

export default App;
