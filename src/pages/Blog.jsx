import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ArrowRight,
  Inbox
} from "lucide-react";
import { BLOG_ARTICLES, BLOG_CATEGORIES } from "../data/blogData";
import "./Blog.css";

// Single Blog Card Component (similar to Lu in the original site)
const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blog/${blog.slug}`} className="block group h-full">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Cover Image Wrapper */}
        <div className="relative overflow-hidden aspect-video">
          <img
            src={blog.cover}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Category Badge */}
          <span
            className="absolute top-3 left-3 text-[11px] font-bold text-white px-3 py-1 rounded-full shadow-sm"
            style={{ backgroundColor: blog.categoryColor }}
          >
            {blog.category}
          </span>
          {/* Read Time Badge */}
          <span className="absolute top-3 right-3 flex items-center gap-1.5 text-[11px] font-medium text-white bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Clock size={11} /> {blog.readTime}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2.5 text-gray-400">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Calendar size={12} /> {blog.date}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 text-base lg:text-lg line-clamp-2 leading-snug mb-2 group-hover:text-[#0042d7] transition-colors">
              {blog.title}
            </h3>
            <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
              {blog.excerpt}
            </p>
          </div>

          {/* Card Footer: Author + Read More */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-7 h-7 rounded-full border border-gray-200 object-cover"
              />
              <span className="text-[12px] font-medium text-gray-700 truncate max-w-[120px]">
                {blog.author.name}
              </span>
            </div>
            <span className="flex items-center gap-1 text-[#0042d7] font-semibold text-[12px] group-hover:gap-2 transition-all duration-200">
              Read More <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  // Compute category counts
  const categoryCounts = BLOG_CATEGORIES.map((cat) => {
    return {
      name: cat,
      count:
        cat === "All"
          ? BLOG_ARTICLES.length
          : BLOG_ARTICLES.filter((article) => article.category === cat).length,
    };
  });

  // Extract featured post
  const featuredArticle = BLOG_ARTICLES.find((article) => article.featured);

  // Filter remaining articles (excluding featured article)
  const filteredArticles = BLOG_ARTICLES.filter(
    (article) => !article.featured
  )
    .filter(
      (article) =>
        selectedCategory === "All" || article.category === selectedCategory
    )
    .filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <main className="bg-slate-50/50 min-h-screen pb-16 font-sans">
      {/* 1. Gradient Hero Header Banner */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: "linear-gradient(135deg, #f7931e 0%, #0042d7 100%)",
          padding: "clamp(60px, 10vw, 100px) 0 clamp(48px, 8vw, 80px)",
        }}
      >
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
          style={{ backgroundImage: "url('/hero4.png')" }}
        />
        {/* Background shapes */}
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
        <div
          className="pointer-events-none absolute"
          style={{
            left: "-30px",
            top: "50%",
            width: "120px",
            height: "40px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.04)",
            transform: "rotate(-20deg)",
          }}
        />

        {/* Header Content */}
        <div className="max-w-[1280px] mx-auto px-5 text-center relative z-10">
          <h1
            className="font-extrabold mb-3 leading-tight"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 1.15 }}
          >
            Tech Articles &{" "}
            <span style={{ color: "#EAFBFC" }}>Electronics Guides</span>
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Expert-written guides on microcontrollers, firmware development, robotics, IoT, and custom PCB routing design.
          </p>

          {/* Header Search Input */}
          <div
            className="flex items-center bg-white rounded-full shadow-lg mx-auto overflow-hidden px-4"
            style={{ maxWidth: "480px", height: "48px" }}
          >
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 px-3 text-sm text-gray-700 outline-none bg-transparent min-w-0"
            />
          </div>
        </div>
      </section>

      {/* 2. Sticky Category Filter Row */}
      <div
        className="bg-white sticky z-30 border-b border-gray-200/80 py-3 shadow-sm"
        style={{
          top: "var(--navbar-height, 100px)", // Fallback style. AppLayout sets top position dynamically based on header heights
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-5">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(6); // Reset visible pagination count
                }}
                className={`flex-shrink-0 rounded-full px-5 py-1.5 text-xs sm:text-sm font-semibold border transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0042d7] text-white border-[#0042d7] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0042d7] hover:text-[#0042d7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Featured Article Card Section */}
      {featuredArticle && selectedCategory === "All" && searchQuery === "" && (
        <div className="max-w-[1280px] mx-auto px-5 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-[#0042d7] uppercase tracking-wider">
              Featured Guide
            </span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>

          <Link to={`/blog/${featuredArticle.slug}`} className="block group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 border border-gray-100 transition-all duration-300 bg-white">
              {/* Image Section */}
              <div className="relative overflow-hidden min-h-[260px] aspect-video lg:aspect-auto lg:h-full">
                <img
                  src={featuredArticle.cover}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-550"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                <span
                  className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: featuredArticle.categoryColor }}
                >
                  {featuredArticle.category}
                </span>
              </div>

              {/* Text Info Section */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {featuredArticle.date}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> {featuredArticle.readTime}
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 mb-3 text-lg md:text-xl lg:text-2xl leading-snug group-hover:text-[#0042d7] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Author + Action */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800 leading-none">
                        {featuredArticle.author.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {featuredArticle.author.role}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 bg-[#0042d7] hover:bg-[#0033a8] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full transition-all shadow-sm">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* 4. Main Listing Content: Two Column Grid */}
      <div className="max-w-[1280px] mx-auto px-5 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          
          {/* Left Column - Article Grid */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-bold text-[#0042d7] uppercase tracking-wider">
                {selectedCategory === "All" ? "All Guides" : selectedCategory}
              </span>
              <span className="text-xs text-gray-400">
                ({filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"} found)
              </span>
              <div className="flex-1 h-[1px] bg-gray-200" />
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <Inbox size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-600 text-lg">No articles found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different category or search query.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredArticles.slice(0, visibleCount).map((article) => (
                    <BlogCard key={article.id} blog={article} />
                  ))}
                </div>

                {/* Pagination Load More Button */}
                {visibleCount < filteredArticles.length && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="inline-flex items-center gap-2 border-2 border-[#0042d7] text-[#0042d7] hover:bg-[#0042d7] hover:text-white font-bold rounded-full px-8 py-3 text-sm transition-all cursor-pointer shadow-sm btn-pulse"
                    >
                      Load More Articles <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Sidebar Widgets */}
          <aside className="space-y-6">
            
            {/* Widget A: Categories count */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <h3 className="font-bold text-gray-900 text-sm md:text-base border-b border-gray-100 pb-3 mb-4">
                Categories
              </h3>
              <ul className="space-y-1">
                {categoryCounts.map((cat) => (
                  <li key={cat.name}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setVisibleCount(6);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                        selectedCategory === cat.name
                          ? "bg-[#0042d7] text-white"
                          : "text-gray-600 hover:bg-slate-50 hover:text-[#0042d7]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                        {cat.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedCategory === cat.name
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget B: Popular Posts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <h3 className="font-bold text-gray-900 text-sm md:text-base border-b border-gray-100 pb-3 mb-4">
                Popular Guides
              </h3>
              <div className="space-y-4">
                {BLOG_ARTICLES.slice(0, 4).map((article) => (
                  <Link
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={article.cover}
                        alt={article.title}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#0042d7] transition-colors">
                        {article.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {article.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
          </aside>

        </div>
      </div>
    </main>
  );
}
