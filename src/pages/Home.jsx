import React, { useState, useRef } from 'react';
import MiniHero from '../components/Home/MiniHero';
import Categories, { BLOG_CATEGORIES } from '../components/Products/Categories';
import DiscoverSlider from '../components/Home/DiscoverSlider';
import FeaturedProductsSlider from '../components/Home/FeaturedProductsSlider';
import { 
  Search, 
  ChevronDown,
  Eye,
  MessageCircle,
  Heart,
  ArrowUpDown,
  Star
} from 'lucide-react';
// Single project dummy data as requested
const ALL_PROJECTS = [
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
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80"
  }
];

const FEATURED_PRODUCTS_DUMMY = [
  {
    id: "f1",
    name: "Arduino Uno R4 WiFi Board",
    category: "Microcontrollers",
    price: "Rs. 6,800",
    rating: 4.8,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "f2",
    name: "DF15RMG High Torque Servo (20kg)",
    category: "Robotics & Motors",
    price: "Rs. 3,600",
    rating: 4.9,
    reviews: 98,
    image: "/hero4.png"
  },
  {
    id: "f3",
    name: "FireBeetle 2 ESP32-C5 Dual-Band WiFi 6",
    category: "Development Boards",
    price: "Rs. 1,950",
    rating: 4.7,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=600&auto=format&fit=crop&q=80"
  }
];

export default function Home({ currentUser, selectedBlog, setSelectedBlog, wishlistItems = [], setWishlistItems, projects = [], onTabChange }) {
  const [activeCat, setActiveCat] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive States for Project 1
  const [viewsCount, setViewsCount] = useState(1237);
  const isWishlisted = wishlistItems.some(item => item.id === 1);
  const respectsCount = 3 + (isWishlisted ? 1 : 0);

  const [wishlistNotification, setWishlistNotification] = useState("");
  const [commentInput, setCommentInput] = useState("");
  
  // Project-Specific Comments State Map
  const [commentsMap, setCommentsMap] = useState({
    1: [
      {
        id: 1,
        author: "wonderfulviking",
        date: "Jun 27, 2026",
        text: "Outstanding project! Build process was incredibly smooth and natural language response works offline."
      }
    ]
  });

  // Dropdown States
  const [selectedProduct, setSelectedProduct] = useState("All products");
  const [selectedType, setSelectedType] = useState("Any type");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Any difficulty");
  const [sortBy, setSortBy] = useState("Trending");

  // Dropdown Open States
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [diffDropdownOpen, setDiffDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Detailed page table of contents active section state
  const [activeSection, setActiveSection] = useState("Intro");

  // Refs for scrolling to sections
  const sectionRefs = {
    "Intro": useRef(null),
    "Devices & Components": useRef(null),
    "Software & Tools": useRef(null),
    "Project description": useRef(null),
    "Code": useRef(null),
    "Arduino App Lab": useRef(null),
    "Downloadable files": useRef(null)
  };

  const handleCatSelect = (idx) => {
    setActiveCat(idx);
  };

  const handleSectionClick = (sectionName) => {
    setActiveSection(sectionName);
    sectionRefs[sectionName]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Hover eye logic: increases views count
  const handleEyeHover = () => {
    setViewsCount(prev => prev + 1);
  };

  // Wishlist logic: toggles and shows notification
  const handleProjectWishlistToggle = (e, project) => {
    e?.stopPropagation(); // Prevent opening blog when clicking heart in grid card
    const isProjectWishlisted = wishlistItems.some(i => i.id === project.id);
    if (isProjectWishlisted) {
      setWishlistItems(prev => prev.filter(i => i.id !== project.id));
      showNotification("Removed from wishlist!");
    } else {
      setWishlistItems(prev => [...prev, {
        id: project.id,
        title: project.title,
        category: project.category,
        price: 'Free Guide',
        image: project.image
      }]);
      showNotification("Added to wishlist!");
    }
  };

  const showNotification = (msg) => {
    setWishlistNotification(msg);
    setTimeout(() => {
      setWishlistNotification("");
    }, 3000);
  };

  // Submit comment logic
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() === "") return;
    const newComment = {
      id: Date.now(),
      author: "Guest Maker",
      date: "Just now",
      text: commentInput.trim()
    };
    setCommentsMap(prev => ({
      ...prev,
      [selectedBlog.id]: [...(prev[selectedBlog.id] || []), newComment]
    }));
    setCommentInput("");
  };

  // Filtering projects database
  const safeProjects = Array.isArray(projects) ? projects : [];
  const filteredProjects = safeProjects.filter(project => {
    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      if (!project.title.toLowerCase().includes(query) && 
          !project.tagline.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // 2. Category
    if (activeCat !== 0) {
      const catLabel = BLOG_CATEGORIES[activeCat].label.toLowerCase();
      if (project.category.toLowerCase() !== catLabel) {
        return false;
      }
    }
    
    // 3. Product Dropdown
    if (selectedProduct !== "All products") {
      if (project.product !== selectedProduct) {
        return false;
      }
    }
    
    // 4. Type Dropdown
    if (selectedType !== "Any type") {
      if (project.type !== selectedType) {
        return false;
      }
    }
    
    // 5. Difficulty Dropdown
    if (selectedDifficulty !== "Any difficulty") {
      if (project.difficulty !== selectedDifficulty) {
        return false;
      }
    }
    
    return true;
  });

  // Sorting projects database
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "Most Liked") {
      const likesA = a.id === 1 ? respectsCount : a.likes;
      const likesB = b.id === 1 ? respectsCount : b.likes;
      return likesB - likesA;
    }
    if (sortBy === "Newest") {
      return new Date(b.date) - new Date(a.date);
    }
    // Trending
    const viewsA = a.id === 1 ? viewsCount : a.views;
    const viewsB = b.id === 1 ? viewsCount : b.views;
    return viewsB - viewsA;
  });

  // Render detailed view if selected
  if (selectedBlog) {
    const isBlogWishlisted = wishlistItems.some(i => i.id === selectedBlog.id);
    const blogViews = selectedBlog.id === 1 ? viewsCount : (selectedBlog.views || 0);
    const blogRespects = selectedBlog.id === 1 ? respectsCount : ((selectedBlog.likes || 0) + (isBlogWishlisted ? 1 : 0));
    const blogComments = commentsMap[selectedBlog.id] || [];

    return (
      <div className="w-full pb-8 pt-0 font-sans bg-white text-black">
        
        {/* Mini Hero */}
        <MiniHero 
          title="Project Tutorial" 
          subtitle="Explore hands-on guides, schematics, source code, and developer walkthroughs."
        />

        <div className="max-w-7xl mx-auto px-4 mt-8">
          {/* Wishlist Toast Notification */}
          {wishlistNotification && (
            <div className="fixed top-24 right-6 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl font-bold z-50 animate-bounce">
              {wishlistNotification}
            </div>
          )}

          {/* Back Button */}
          <button 
            onClick={() => setSelectedBlog(null)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-black hover:underline cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> 
            <span className="font-bold">Back to projects list</span>
          </button>

          {/* Two-column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Article Content) */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl border border-gray-200/80 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-extrabold text-black leading-tight mb-4">
              {selectedBlog.title}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
              {selectedBlog.tagline}
            </p>

            {/* Metadata and Share Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6 text-xs text-gray-400 font-semibold">
              <div className="flex items-center gap-2">
                <span>{selectedBlog.date}</span>
                <span>•</span>
                <span 
                  className="cursor-help flex items-center gap-1 hover:text-[#84cc16] transition"
                  onMouseEnter={() => selectedBlog.id === 1 && handleEyeHover()}
                  title={selectedBlog.id === 1 ? "Hover to increase views!" : ""}
                >
                  <Eye className="h-3.5 w-3.5" /> {blogViews.toLocaleString()} views
                </span>
                <span>•</span>
                <span>{blogRespects} respects</span>
                <span>•</span>
                <span className="uppercase">{selectedBlog.license}</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="hover:text-[#84cc16] transition cursor-pointer" aria-label="Share on Facebook">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                </button>
                <button className="hover:text-[#84cc16] transition cursor-pointer" aria-label="Share on LinkedIn">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </button>
                <button className="hover:text-[#84cc16] transition cursor-pointer" aria-label="Share on X">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button className="hover:text-[#84cc16] transition cursor-pointer" aria-label="Copy Link">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </button>
                <span className="text-gray-300">|</span>
                <button className="hover:text-red-500 transition cursor-pointer" aria-label="Report">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21v8h-6l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedBlog.badges.map((badge, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded border border-gray-200/60">
                  {badge}
                </span>
              ))}
            </div>

            {/* Main Project Image */}
            <div className="rounded-xl overflow-hidden border border-gray-200 mb-8 aspect-[16/10]">
              <img 
                src={selectedBlog.image} 
                alt={selectedBlog.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Document Content Sections (TOC targets) */}
            <div className="space-y-8 text-gray-700 leading-relaxed text-sm md:text-base mb-12">
              
              <section ref={sectionRefs["Intro"]} className="scroll-mt-10 p-5 bg-slate-50 border-l-4 border-blue-500 rounded-r-xl">
                <h2 className="text-xl font-extrabold text-black border-b border-gray-200 pb-2 mb-3">Introduction</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedBlog.intro || "This project demonstrates running a local LLM or speech module on device to interpret natural language commands and actuate hardware directly without any cloud dependence. We utilize specialized embedded weights mapped to standard microcontroller ports."}
                </p>
              </section>

              <section ref={sectionRefs["Devices & Components"]} className="scroll-mt-10 p-5 bg-white border border-gray-200 border-l-4 border-l-amber-500 rounded-r-xl shadow-sm">
                <h2 className="text-xl font-extrabold text-black border-b border-gray-100 pb-2 mb-3">Devices & Components</h2>
                <ul className="list-disc list-inside space-y-2 pl-2 text-gray-800 text-sm font-semibold">
                  {selectedBlog.devices && selectedBlog.devices.length > 0 ? (
                    selectedBlog.devices.map((d, i) => <li key={i}>{d}</li>)
                  ) : (
                    <>
                      <li>UNO microcontroller board</li>
                      <li>Solderless connection hookup cables</li>
                      <li>RGB Status Indicator LEDs</li>
                      <li>Rotary Analog potentiometer</li>
                    </>
                  )}
                </ul>
              </section>

              <section ref={sectionRefs["Software & Tools"]} className="scroll-mt-10 p-5 bg-white border border-gray-200 border-l-4 border-l-purple-500 rounded-r-xl shadow-sm">
                <h2 className="text-xl font-extrabold text-black border-b border-gray-100 pb-2 mb-3">Software & Tools</h2>
                <ul className="list-disc list-inside space-y-2 pl-2 text-gray-800 text-sm font-semibold">
                  {selectedBlog.software && selectedBlog.software.length > 0 ? (
                    selectedBlog.software.map((s, i) => <li key={i}>{s}</li>)
                  ) : (
                    <>
                      <li>Arduino IDE</li>
                      <li>Custom firmware libraries compilation environments</li>
                    </>
                  )}
                </ul>
              </section>

              <section ref={sectionRefs["Project description"]} className="scroll-mt-10 p-5 bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-r-xl shadow-sm">
                <h2 className="text-xl font-extrabold text-black border-b border-gray-100 pb-2 mb-3">Project Description</h2>
                <p className="text-gray-800 text-sm leading-relaxed font-semibold">
                  {selectedBlog.description || "The complete system parses standard user input strings entirely offline. The local inference engine executes on the board within 40ms, triggering pin output voltage modulation dynamically."}
                </p>
              </section>

              <section ref={sectionRefs["Code"]} className="scroll-mt-10 p-5 bg-white border border-gray-200 border-l-4 border-l-gray-700 rounded-r-xl shadow-sm">
                <h2 className="text-xl font-extrabold text-black border-b border-gray-100 pb-2 mb-3">Code</h2>
                <pre className="bg-gray-100 text-black p-4 rounded-lg overflow-x-auto text-xs font-mono border border-gray-200">
                  {selectedBlog.code || `#include <ArduinoAppLab.h>\n\nLocalAgent agent;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n  agent.begin();\n}\n\nvoid loop() {\n  if (agent.available()) {\n    String cmd = agent.readCommand();\n    agent.executeOnDevice(cmd);\n  }\n}`}
                </pre>
              </section>

              <section ref={sectionRefs["Arduino App Lab"]} className="scroll-mt-10 p-5 bg-white border border-gray-200 border-l-4 border-l-[#84cc16] rounded-r-xl shadow-sm">
                <h2 className="text-xl font-extrabold text-black border-b border-gray-100 pb-2 mb-3">Arduino App Lab</h2>
                <p className="text-gray-800 text-sm leading-relaxed font-semibold">
                  {selectedBlog.appLab || "Configure the desktop controller by binding the correct USB/COM port. Ensure model weights are fully loaded prior to active deployment loops."}
                </p>
              </section>

              <section ref={sectionRefs["Downloadable files"]} className="scroll-mt-10 p-5 bg-white border border-gray-200 border-l-4 border-l-teal-500 rounded-r-xl shadow-sm">
                <h2 className="text-xl font-extrabold text-black border-b border-gray-100 pb-2 mb-3">Downloadable Files</h2>
                <div className="space-y-2">
                  {selectedBlog.files && selectedBlog.files.length > 0 ? (
                    selectedBlog.files.map((file, i) => (
                      <p key={i} className="text-teal-600 hover:underline cursor-pointer font-bold text-sm">
                        {file}
                      </p>
                    ))
                  ) : (
                    <p className="text-teal-600 hover:underline cursor-pointer font-bold text-sm">
                      local_inference_firmware_v1.zip (2.4 MB)
                    </p>
                  )}
                </div>
              </section>

            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <h2 className="text-2xl font-bold text-black mb-6">
                Comments ({blogComments.length})
              </h2>

              {/* Comments List */}
              <div className="space-y-6 mb-8">
                {blogComments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-800">{comment.author}</span>
                      <span className="text-xs text-gray-400 font-medium">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-2">
                    Write a comment...
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Enter your comment related to this project blog..."
                    className="w-full rounded-xl border border-gray-300 p-4 text-sm text-gray-700 outline-none transition focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]/20"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#f7b500] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                >
                  Submit Comment
                </button>
              </form>
            </div>

          </div>

          {/* Right Column (Sidebar details) */}
          <div className="space-y-6">
            
            {/* Author Profile Box */}
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {selectedBlog.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-black">{selectedBlog.author}</h3>
                  <p className="text-xs text-gray-400 font-bold">2 Followers • 1 Projects</p>
                </div>
              </div>
              <button className="text-xs font-bold text-teal-600 border border-teal-200 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition cursor-pointer">
                FOLLOW
              </button>
            </div>

            {/* Table of contents Container */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="bg-teal-500/80 text-white px-4 py-3 font-extrabold text-sm">
                Table of contents
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                {Object.keys(sectionRefs).map((name) => {
                  const isActive = activeSection === name;
                  return (
                    <button
                      key={name}
                      onClick={() => handleSectionClick(name)}
                      className={`w-full text-left px-4 py-3 transition cursor-pointer font-bold ${isActive ? "bg-gray-100 text-black border-l-4 border-[#84cc16] font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Stats Panel */}
            <div className="bg-white p-3 rounded-full border border-gray-200/80 shadow-sm flex items-center justify-around max-w-[280px] mx-auto text-xs text-gray-500">
              <button className="flex items-center gap-1.5 hover:text-[#84cc16] cursor-pointer font-bold">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg> {blogRespects}
              </button>
              <span className="text-gray-300">|</span>
              <button className="flex items-center gap-1.5 hover:text-[#84cc16] cursor-pointer font-bold">
                <MessageCircle className="h-4 w-4" /> {blogComments.length}
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={(e) => handleProjectWishlistToggle(e, selectedBlog)}
                className={`flex items-center gap-1.5 cursor-pointer transition ${isBlogWishlisted ? 'text-[#84cc16]' : 'hover:text-teal-600'}`}
                aria-label="Wishlist"
              >
                <Heart className={`h-4 w-4 ${isBlogWishlisted ? 'fill-[#84cc16] text-[#84cc16]' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </div>
      </div>
    );
  }

  return (
    <div id="blogs-section" className="max-w-7xl mx-auto px-4 pb-8 pt-0 font-sans bg-white text-black">
      
      {/* Category Strip */}
      <Categories activeCat={activeCat} onCatSelect={handleCatSelect} />

      {/* Search + filter row */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to make?"
            className="w-full rounded border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition focus:border-black focus:ring-1 focus:ring-black/20 font-bold"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2">
          {/* Product Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setProductDropdownOpen(!productDropdownOpen);
                setTypeDropdownOpen(false);
                setDiffDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="inline-flex items-center justify-between gap-8 rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 transition hover:border-black cursor-pointer min-w-[120px] font-bold"
            >
              <span>{selectedProduct}</span> <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>
            {productDropdownOpen && (
              <div className="absolute left-0 mt-1 w-40 rounded border border-gray-200 bg-white shadow-md z-50 py-1">
                {["All products", "FYP Projects", "Electronic Items", "Tools"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedProduct(item);
                      setProductDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition font-bold"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setTypeDropdownOpen(!typeDropdownOpen);
                setProductDropdownOpen(false);
                setDiffDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="inline-flex items-center justify-between gap-8 rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 transition hover:border-black cursor-pointer min-w-[120px] font-bold"
            >
              <span>{selectedType}</span> <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>
            {typeDropdownOpen && (
              <div className="absolute left-0 mt-1 w-40 rounded border border-gray-200 bg-white shadow-md z-50 py-1">
                {["Any type", "Tutorial", "Build Guide", "Case Study"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedType(item);
                      setTypeDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition font-bold"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setDiffDropdownOpen(!diffDropdownOpen);
                setProductDropdownOpen(false);
                setTypeDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="inline-flex items-center justify-between gap-8 rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 transition hover:border-black cursor-pointer min-w-[120px] font-bold"
            >
              <span>{selectedDifficulty}</span> <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>
            {diffDropdownOpen && (
              <div className="absolute left-0 mt-1 w-40 rounded border border-gray-200 bg-white shadow-md z-50 py-1">
                {["Any difficulty", "Easy", "Medium", "Hard"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedDifficulty(item);
                      setDiffDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition font-bold"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total and Sorting */}
        <div className="ml-auto flex items-center gap-3 text-xs text-gray-500 font-bold">
          <span className="font-bold">
            <span className="font-bold text-gray-700">{sortedProjects.length}</span> {sortedProjects.length === 1 ? 'project' : 'projects'}
          </span>
          <span>•</span>
          <div className="relative">
            <button
              onClick={() => {
                setSortDropdownOpen(!sortDropdownOpen);
                setProductDropdownOpen(false);
                setTypeDropdownOpen(false);
                setDiffDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1 text-gray-700 font-extrabold hover:text-black transition cursor-pointer"
            >
              <ArrowUpDown className="h-3.5 w-3.5" /> {sortBy}
            </button>
            {sortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded border border-gray-200 bg-white shadow-md z-50 py-1">
                {["Trending", "Most Liked", "Newest"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSortBy(item);
                      setSortDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition font-bold"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discover Projects Slider */}
      {filteredProjects.length > 0 && (
        <DiscoverSlider projects={filteredProjects} onProjectSelect={setSelectedBlog} />
      )}
      
      {/* Featured Products Section */}
      <div className="mt-12 mb-12">
        {/* Banner with hero4.png as background cover */}
        <div 
          className="relative rounded-2xl overflow-hidden mb-8 shadow-sm min-h-[280px] flex items-center bg-cover bg-center"
          style={{ backgroundImage: "url('/hero4.png')" }}
        >
          {/* Black light opaque overlay for text readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          
          <div className="relative z-10 p-8 md:p-10 w-full text-white">
            <span className="bg-white/25 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-4 inline-block">
              Maker Kit Spotlight
            </span>
            <h3 className="text-xl md:text-3xl font-extrabold mb-3 leading-tight text-white">
              Swift Sign Custom Development Sets
            </h3>
            <p className="text-xs md:text-sm text-gray-250 mb-5 font-semibold leading-relaxed max-w-xl">
              Equip your workbench with our signature double-jointed robotic servo hardware assemblies and custom WiFi development kits. Pre-flashed and optimized for final year installations.
            </p>
            <button 
              onClick={() => onTabChange?.('cart')}
              className="px-5 py-2.5 bg-black hover:bg-black/90 text-white transition font-extrabold rounded-lg shadow-sm inline-flex items-center gap-2 cursor-pointer text-xs"
            >
              Shop Maker Kits
            </button>
          </div>
        </div>

        {/* Featured Products Slider */}
        <FeaturedProductsSlider products={FEATURED_PRODUCTS_DUMMY} onBuyNow={() => onTabChange?.('cart')} />
      </div>

      {/* Grid rendering list of filtered projects */}
      <div className="discover-slider-section" style={{ marginTop: '0', marginBottom: '2.5rem' }}>
        <h2 id="project-guides-section" className="discover-slider-heading">Project Guides & Tutorials</h2>
      </div>
      {sortedProjects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-xl max-w-2xl mx-auto">
          <p className="font-bold text-gray-600 text-base">No projects found matching these filters</p>
          <p className="text-xs text-gray-400 mt-1.5">Try changing your dropdown options or clearing the search text box.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map(project => {
            const isProjectWishlisted = wishlistItems.some(i => i.id === project.id);
            const pViews = project.id === 1 ? viewsCount : (project.views || 0);
            const pLikes = project.id === 1 ? respectsCount : ((project.likes || 0) + (isProjectWishlisted ? 1 : 0));
            const pComments = commentsMap[project.id]?.length || 0;
            return (
              <article 
                key={project.id}
                onClick={() => setSelectedBlog(project)}
                className="premium-card border border-slate-150 rounded-2xl group"
              >
                <div className="premium-card-info">
                  <span className="discover-card-category text-[#94a3b8] font-bold">{project.category || 'Tutorial'} • by {project.author}</span>
                  <h3 className="discover-card-title group-hover:text-[#84cc16] transition-colors">{project.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <span 
                      className="flex items-center gap-1 hover:text-black transition cursor-help"
                      onMouseEnter={() => project.id === 1 && handleEyeHover()}
                    >
                      <Eye className="h-4 w-4 text-gray-400" /> {pViews.toLocaleString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-gray-400" /> {pComments}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-gray-400" /> {pLikes}
                    </span>
                  </div>
                </div>
                <div className="premium-card-image-wrapper">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="premium-card-image"
                  />
                  <button 
                    onClick={(e) => handleProjectWishlistToggle(e, project)}
                    className={`absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border shadow-sm transition hover:scale-110 ${isProjectWishlisted ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                  >
                    <Heart className={`h-4 w-4 ${isProjectWishlisted ? 'fill-black text-black' : ''}`} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Wishlist Toast Notification */}
      {wishlistNotification && (
        <div className="fixed top-24 right-6 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl font-bold z-50 animate-bounce">
          {wishlistNotification}
        </div>
      )}
    </div>
  );
}