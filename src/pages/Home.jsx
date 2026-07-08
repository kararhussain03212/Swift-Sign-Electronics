import React, { useState, useRef } from 'react';
import MiniHero from '../components/Home/MiniHero';
import Categories, { BLOG_CATEGORIES } from '../components/Products/Categories';
import DiscoverSlider from '../components/Home/DiscoverSlider';
import FeaturedProductsSlider from '../components/Home/FeaturedProductsSlider';
import './CoverflowSlider.css';
import { 
  Search, 
  ChevronDown,
  Eye,
  MessageCircle,
  Heart,
  ArrowUpDown,
  Star,
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Download,
  Cpu,
  Terminal,
  BookOpen,
  ChevronLeft,
  ChevronRight
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
    originalPrice: "Rs. 7,999",
    rating: 4.8,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "f2",
    name: "DF15RMG High Torque Servo (20kg)",
    category: "Robotics & Motors",
    price: "Rs. 3,600",
    originalPrice: "Rs. 4,500",
    rating: 4.9,
    reviews: 98,
    image: "/hero4.png"
  },
  {
    id: "f3",
    name: "FireBeetle 2 ESP32-C5 Dual-Band WiFi 6",
    category: "Development Boards",
    price: "Rs. 1,950",
    originalPrice: "Rs. 2,400",
    rating: 4.7,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=600&auto=format&fit=crop&q=80"
  }
];

const ScrollProgressBar = () => {
  const [scrollPercentage, setScrollPercentage] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalScrollableHeight = scrollHeight - clientHeight;
      setScrollPercentage(
        totalScrollableHeight > 0 ? (scrollTop / totalScrollableHeight) * 100 : 0
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-gray-100">
      <div
        className="h-full bg-[#0fafb8] transition-all duration-100 ease-linear"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
};

const ProjectCoverflowSlider = ({ 
  projects, 
  onProjectSelect, 
  wishlistItems, 
  handleProjectWishlistToggle, 
  handleEyeHover, 
  viewsCount, 
  respectsCount, 
  commentsMap,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Heart
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  if (!projects || projects.length === 0) return null;

  return (
    <div className="project-coverflow-wrapper">
      <div className="project-coverflow-container">
        {projects.map((proj, idx) => {
          let position = "inactive";
          if (idx === activeIndex) {
            position = "active";
          } else if (idx === (activeIndex - 1 + projects.length) % projects.length) {
            position = "left";
          } else if (idx === (activeIndex + 1) % projects.length) {
            position = "right";
          }

          const isProjectWishlisted = wishlistItems.some(i => i.id === proj.id);
          const pViews = proj.id === 1 ? viewsCount : (proj.views || 0);
          const pLikes = proj.id === 1 ? respectsCount : ((proj.likes || 0) + (isProjectWishlisted ? 1 : 0));
          const pComments = commentsMap[proj.id]?.length || 0;

          return (
            <div
              key={proj.id}
              className={`project-coverflow-card ${position}`}
              onClick={() => {
                if (position === "active") {
                  onProjectSelect?.(proj);
                } else {
                  setActiveIndex(idx);
                }
              }}
            >
              {/* Background Image */}
              <div 
                className="coverflow-card-bg"
                style={{ backgroundImage: `url(${proj.image})` }}
              />
              <div className="coverflow-card-overlay" />

              {/* Card Details */}
              <div className="coverflow-card-content">
                <span className="coverflow-card-category">{proj.category || "Tutorial"}</span>
                <h3 className="coverflow-card-title">{proj.title}</h3>
                
                <div className="coverflow-card-meta">
                  <span className="coverflow-author">By {proj.author}</span>
                  <div className="coverflow-stats">
                    <span 
                      className="stat-item flex items-center gap-1"
                      onMouseEnter={() => proj.id === 1 && handleEyeHover()}
                    >
                      <Eye size={12} /> {pViews.toLocaleString()}
                    </span>
                    <span className="stat-item flex items-center gap-1">
                      <MessageCircle size={12} /> {pComments}
                    </span>
                    <span className="stat-item flex items-center gap-1">
                      <Heart size={12} /> {pLikes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wishlist Heart Button */}
              {position === "active" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectWishlistToggle(e, proj);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm border shadow-sm transition hover:scale-110 cursor-pointer ${
                    isProjectWishlisted ? "bg-[#0042d7] border-[#0042d7] text-white" : "bg-white/80 border-gray-200 text-gray-600 hover:text-[#0042d7]"
                  }`}
                >
                  <Heart size={14} className={isProjectWishlisted ? "fill-white text-white" : ""} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons below */}
      <div className="project-coverflow-nav">
        <button onClick={handlePrev} className="coverflow-nav-btn" aria-label="Previous Project">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={handleNext} className="coverflow-nav-btn" aria-label="Next Project">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

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

    // Estimating readTime based on content length
    const wordsCount = ((selectedBlog.intro || "") + (selectedBlog.description || "") + (selectedBlog.code || "")).split(/\s+/).length;
    const readTimeVal = Math.max(3, Math.ceil(wordsCount / 200)) + " min read";

    // Related projects recommendations
    const relatedProjects = (projects || [])
      .filter((p) => p.id !== selectedBlog.id)
      .slice(0, 3);

    return (
      <div className="font-sans bg-white pb-1 relative text-black">
        {/* Scroll Progress Bar at the top */}
        <ScrollProgressBar />

        {/* Wishlist Toast Notification */}
        {wishlistNotification && (
          <div className="fixed top-24 right-6 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl font-bold z-50 animate-bounce text-sm">
            {wishlistNotification}
          </div>
        )}

        {/* 1. Header Banner Area */}
        <section
          className="relative overflow-hidden text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(7, 59, 69, 0.85), rgba(15, 175, 184, 0.85)), url(${selectedBlog.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "clamp(64px, 12vw, 120px) 0 clamp(48px, 9vw, 100px)",
          }}
        >
          {/* Background Shapes */}
          <div
            className="pointer-events-none absolute"
            style={{
              right: "-80px",
              top: "-80px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="pointer-events-none absolute"
            style={{
              right: "60px",
              top: "40px",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          />

          <div className="max-w-[1280px] mx-auto px-5 relative z-10">
            {/* Back Navigation */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white mb-6 font-semibold transition-colors bg-transparent border-none cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to projects list
            </button>

            {/* Category Badge */}
            <div className="mb-4">
              <span
                className="inline-flex items-center text-[11px] font-bold text-white bg-[#0fafb8] px-3.5 py-1.5 rounded-full shadow-sm"
              >
                {selectedBlog.category}
              </span>
            </div>

            {/* Article Title */}
            <h1
              className="font-extrabold text-white mb-6 max-w-4xl"
              style={{ fontSize: "clamp(24px, 4vw, 42px)", lineHeight: 1.2 }}
            >
              {selectedBlog.title}
            </h1>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0fafb8] border-2 border-white/30 flex items-center justify-center font-bold text-white text-sm">
                  {selectedBlog.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-[13px] leading-none">
                    {selectedBlog.author}
                  </p>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    Maker Contributor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/70 text-[12px] border-l border-white/20 pl-5">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {selectedBlog.date}
                </span>
                <span className="flex items-center gap-1.5 cursor-help" onMouseEnter={() => selectedBlog.id === 1 && handleEyeHover()}>
                  <Eye size={13} /> {blogViews.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {readTimeVal}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Core Article Layout Column */}
        <div className="max-w-3xl mx-auto px-5 mb-16 mt-10">
          
          {/* Floating details row */}
          <div className="border border-gray-100 rounded-2xl px-5 py-3.5 mb-8 shadow-card bg-white">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-1.5 text-gray-655">
                  <Clock size={14} className="text-[#0fafb8] flex-shrink-0" />
                  <span className="text-[12px] sm:text-[13px] font-semibold">
                    {readTimeVal}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-gray-655">
                  <BookOpen size={14} className="text-[#0fafb8] flex-shrink-0" />
                  <span className="text-[12px] sm:text-[13px] font-semibold">
                    {selectedBlog.type || "Tutorial"}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-200" />
                <span className="text-[12px] sm:text-[13px] font-semibold text-gray-500 truncate max-w-[120px]">
                  {selectedBlog.category}
                </span>
              </div>

              {/* Likes/Respects Button */}
              <button
                onClick={(e) => handleProjectWishlistToggle(e, selectedBlog)}
                className={`flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold px-4 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isBlogWishlisted
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"
                }`}
              >
                <Heart size={13} className={isBlogWishlisted ? "fill-red-500 text-red-500" : ""} />
                <span>{blogRespects}</span>
              </button>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="prose-article space-y-6">
            
            {/* Introduction paragraph */}
            {(selectedBlog.intro || selectedBlog.tagline) && (
              <p
                className="text-base sm:text-lg leading-[1.85] text-gray-805 font-medium border-l-4 pl-5 mb-8"
                style={{ borderColor: "#0042d7" }}
              >
                {selectedBlog.intro || selectedBlog.tagline}
              </p>
            )}

            {/* Devices & Components section */}
            {selectedBlog.devices && selectedBlog.devices.length > 0 && (
              <div className="my-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-base">
                  <Cpu className="text-[#0042d7] w-5 h-5" /> Devices & Components
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBlog.devices.map((device, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                      <CheckCircle className="text-[#0042d7] w-4 h-4 flex-shrink-0" /> {device}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Software & Tools section */}
            {selectedBlog.software && selectedBlog.software.length > 0 && (
              <div className="my-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-base">
                  <Terminal className="text-[#0042d7] w-5 h-5" /> Software & Tools
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBlog.software.map((sw, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                      <CheckCircle className="text-[#0042d7] w-4 h-4 flex-shrink-0" /> {sw}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project description section */}
            {selectedBlog.description && (
              <div className="my-8">
                <h3 className="font-bold text-gray-900 mb-3 text-base">Project Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{selectedBlog.description}</p>
              </div>
            )}

            {/* Code section */}
            {selectedBlog.code && (
              <div className="my-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900 text-base">Source Code</h3>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedBlog.code);
                      showNotification("Code copied to clipboard!");
                    }}
                    className="text-xs text-[#0042d7] hover:underline font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto text-xs font-mono border border-slate-800 shadow-inner max-h-96">
                  <code>{selectedBlog.code}</code>
                </pre>
              </div>
            )}

            {/* Arduino App Lab section */}
            {selectedBlog.appLab && selectedBlog.appLab !== "No app provided" && (
              <div className="my-8 p-5 bg-teal-50/50 border border-teal-150 rounded-2xl">
                <h3 className="font-bold text-teal-900 mb-2 text-sm uppercase tracking-wider">Arduino App Lab</h3>
                <p className="text-teal-800 text-xs sm:text-sm font-semibold leading-relaxed">
                  {selectedBlog.appLab}
                </p>
              </div>
            )}

            {/* Downloadable files section */}
            {selectedBlog.files && selectedBlog.files.length > 0 && (
              <div className="my-10">
                <h3 className="font-bold text-gray-900 mb-3 text-base">Downloadable Files</h3>
                <div className="space-y-2">
                  {selectedBlog.files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <Download className="text-[#0042d7] w-4 h-4 flex-shrink-0" />
                      <a 
                        href="#download" 
                        onClick={(e) => {
                          e.preventDefault();
                          showNotification(`Downloading ${file.split(' ')[0]}...`);
                        }}
                        className="text-sm font-semibold text-slate-700 hover:text-[#0042d7] hover:underline"
                      >
                        {file}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({blogComments.length})
            </h2>

            {/* Comments List */}
            <div className="space-y-6 mb-8">
              {blogComments.map(comment => (
                <div key={comment.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
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
                  className="w-full rounded-xl border border-gray-300 p-4 text-sm text-gray-700 outline-none transition focus:border-[#0042d7] focus:ring-1 focus:ring-[#0042d7]/20 bg-white"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#0042d7] hover:bg-[#0033a8] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                Submit Comment
              </button>
            </form>
          </div>

        </div>

        {/* Related Recommendations footer */}
        {relatedProjects.length > 0 && (
          <section className="bg-slate-50/70 border-t border-slate-100 py-14">
            <div className="max-w-[1280px] mx-auto px-5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[11px] font-bold text-[#0042d7] uppercase tracking-wider mb-1">
                    Keep Reading
                  </p>
                  <h2 className="font-extrabold text-gray-900 text-xl sm:text-2xl">
                    More Guides & Tutorials
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="flex items-center gap-1.5 text-[#0042d7] hover:text-[#0033a8] font-semibold text-xs sm:text-sm border border-[#0042d7] hover:bg-[#0042d7] hover:text-white rounded-full px-5 py-2 transition-all duration-200 cursor-pointer bg-transparent"
                >
                  View All Guides <ArrowRight size={14} />
                </button>
              </div>

              {/* Related Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((p) => (
                  <article 
                    key={p.id}
                    onClick={() => setSelectedBlog(p)}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col cursor-pointer"
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute top-3 left-3 text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#0042d7" }}
                      >
                        {p.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                          <Calendar size={10} /> {p.date}
                        </p>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
                          {p.title}
                        </h3>
                      </div>
                      <span className="flex items-center gap-1 text-[#0042d7] font-bold text-[11px] mt-3">
                        Read Guide <ArrowRight size={11} />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
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
      <div className="mt-6 mb-6">
        {/* Banner with hero4.png as background cover */}
        <div 
          className="relative rounded-2xl overflow-hidden mb-4 shadow-sm min-h-[280px] flex items-center bg-cover bg-center"
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

        {/* Second Banner with hero3.png as background cover below Featured Products */}
        <div 
          className="relative rounded-2xl overflow-hidden mt-6 mb-4 shadow-sm min-h-[280px] flex items-center bg-cover bg-center"
          style={{ backgroundImage: "url('/hero3.png')" }}
        >
          {/* Black light opaque overlay for text readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          
          <div className="relative z-10 p-8 md:p-10 w-full text-white">
            <span className="bg-white/25 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-4 inline-block">
              Diagnostic & Lab Spotlight
            </span>
            <h3 className="text-xl md:text-3xl font-extrabold mb-3 leading-tight text-white">
              Precision Diagnostic & Measuring Gear
            </h3>
            <p className="text-xs md:text-sm text-gray-250 mb-5 font-semibold leading-relaxed max-w-xl">
              Equip your electronics workbench with premium oscilloscopes, safe global transit soldering kits, and active simulator testing diagnostics. Batch consultancy open for July.
            </p>
            <button 
              onClick={() => onTabChange?.('products')}
              className="px-5 py-2.5 bg-black hover:bg-black/90 text-white transition font-extrabold rounded-lg shadow-sm inline-flex items-center gap-2 cursor-pointer text-xs"
            >
              Shop Diagnostic Tools
            </button>
          </div>
        </div>
      </div>

      {/* Grid rendering list of filtered projects */}
      <div className="discover-slider-section" style={{ marginTop: '0', marginBottom: '0.5rem' }}>
        <h2 id="project-guides-section" className="discover-slider-heading">Project Guides & Tutorials</h2>
      </div>
      {sortedProjects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-xl max-w-2xl mx-auto">
          <p className="font-bold text-gray-600 text-base">No projects found matching these filters</p>
          <p className="text-xs text-gray-400 mt-1.5">Try changing your dropdown options or clearing the search text box.</p>
        </div>
      ) : (
        <ProjectCoverflowSlider 
          projects={sortedProjects}
          onProjectSelect={setSelectedBlog}
          wishlistItems={wishlistItems}
          handleProjectWishlistToggle={handleProjectWishlistToggle}
          handleEyeHover={handleEyeHover}
          viewsCount={viewsCount}
          respectsCount={respectsCount}
          commentsMap={commentsMap}
          ChevronLeft={ChevronLeft}
          ChevronRight={ChevronRight}
          Eye={Eye}
          MessageCircle={MessageCircle}
          Heart={Heart}
        />
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