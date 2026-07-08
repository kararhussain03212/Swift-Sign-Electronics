import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Heart, 
  BookOpen, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { BLOG_ARTICLES } from "../data/blogData";
import "./Blog.css";

// Sticky Horizontal Scroll Progress Bar
const ScrollProgressBar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
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
        className="h-full bg-[#0042d7] transition-all duration-100 ease-linear"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
};

// Main Blog Details Component
export default function BlogDetails() {
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showNotification, setShowNotification] = useState("");

  const article = BLOG_ARTICLES.find((art) => art.slug === slug);

  // Scroll to top on page mount or slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Set random starting likes once when article is loaded
  useEffect(() => {
    if (article) {
      setLikesCount(Math.floor(Math.random() * 80) + 30);
      setLiked(false);
    }
  }, [slug, article]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5 font-sans bg-slate-50">
        <AlertCircle size={56} className="text-red-400 mb-4" />
        <h1 className="font-bold text-gray-800 text-2xl mb-2">Article Not Found</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-sm">
          The technical guide you are looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/blog"
          className="flex items-center gap-2 bg-[#0042d7] hover:bg-[#0033a8] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Blog List
        </Link>
      </div>
    );
  }

  // Toggle Like Action
  const handleLikeToggle = () => {
    if (liked) {
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setLiked(true);
      
      // Toast notification trigger
      setShowNotification("Added to favorites! ❤️");
      setTimeout(() => {
        setShowNotification("");
      }, 2500);
    }
  };

  // Split content body paragraphs
  const paragraphs = article.body.split("\n\n");

  // Related recommendations
  const relatedArticles = BLOG_ARTICLES.filter((art) => art.slug !== slug).slice(0, 3);

  return (
    <div className="font-sans bg-white pb-1">
      {/* Scroll Progress Bar at the top */}
      <ScrollProgressBar />

      {/* Floating Wishlist Toast Notification */}
      {showNotification && (
        <div className="fixed top-24 right-6 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl font-bold z-50 animate-bounce text-sm">
          {showNotification}
        </div>
      )}

      {/* 1. Header Banner Area */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(7, 59, 69, 0.85), rgba(15, 175, 184, 0.85)), url(${article.cover})`,
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
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white mb-6 font-semibold transition-colors"
          >
            <ArrowLeft size={14} /> Back to blogs
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span
              className="inline-flex items-center text-[11px] font-bold text-white px-3.5 py-1.5 rounded-full shadow-sm"
              style={{ backgroundColor: article.categoryColor }}
            >
              {article.category}
            </span>
          </div>

          {/* Article Title */}
          <h1
            className="font-extrabold text-white mb-6 max-w-4xl"
            style={{ fontSize: "clamp(24px, 4vw, 42px)", lineHeight: 1.2 }}
          >
            {article.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2.5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-9 h-9 rounded-full border-2 border-white/30 object-cover"
              />
              <div>
                <p className="text-white font-semibold text-[13px] leading-none">
                  {article.author.name}
                </p>
                <p className="text-white/60 text-[11px] mt-0.5">
                  {article.author.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/70 text-[12px] border-l border-white/20 pl-5">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {article.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Article Layout Column */}
      <div className="max-w-3xl mx-auto px-5 mb-16 mt-10">
        
        {/* Floating details row (Readtime, type, like button) */}
        <div className="border border-gray-100 rounded-2xl px-5 py-3.5 mb-8 shadow-card bg-white">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock size={14} className="text-[#0042d7] flex-shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-semibold">
                  {article.readTime}
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-1.5 text-gray-600">
                <BookOpen size={14} className="text-[#0042d7] flex-shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-semibold">
                  Technical Guide
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-200" />
              <span className="text-[12px] sm:text-[13px] font-semibold text-gray-500 truncate max-w-[120px]">
                {article.category}
              </span>
            </div>

            {/* Favorite Like Button */}
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold px-4 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                liked
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"
              }`}
            >
              <Heart size={13} className={liked ? "fill-red-500 text-red-500" : ""} />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="prose-article space-y-6">
          {paragraphs.map((pText, index) => {
            // First paragraph styling: Bold lead paragraph with left border colored by categoryColor
            if (index === 0) {
              return (
                <p
                  key={index}
                  className="text-base sm:text-lg leading-[1.85] text-gray-800 font-medium border-l-4 pl-5"
                  style={{ borderColor: article.categoryColor }}
                >
                  {pText}
                </p>
              );
            }
            
            // Blockquote styling on index 2 (just like the original site blockquote structure)
            if (index === 2) {
              return (
                <div key={index}>
                  <p className="text-gray-700">{pText}</p>
                  <blockquote
                    className="relative border-l-4 rounded-r-3xl px-8 py-5 my-8 shadow-sm bg-gradient-to-r from-slate-50 to-transparent"
                    style={{ borderColor: article.categoryColor }}
                  >
                    <p className="text-[17px] leading-[1.8] font-semibold italic text-gray-800 mb-0">
                      “{pText.split(".")[0]}.”
                    </p>
                  </blockquote>
                </div>
              );
            }

            return (
              <p key={index} className="text-gray-700">
                {pText}
              </p>
            );
          })}
        </div>
      </div>

      {/* 3. Related Articles Recommendations Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-slate-50/70 border-t border-slate-100 py-14">
          <div className="max-w-[1280px] mx-auto px-5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] font-bold text-[#0042d7] uppercase tracking-wider mb-1">
                  Keep Reading
                </p>
                <h2 className="font-extrabold text-gray-900 text-xl sm:text-2xl">
                  More Tech Articles
                </h2>
              </div>
              <Link
                to="/blog"
                className="flex items-center gap-1.5 text-[#0042d7] hover:text-[#0033a8] font-semibold text-xs sm:text-sm border border-[#0042d7] hover:bg-[#0042d7] hover:text-white rounded-full px-5 py-2 transition-all duration-200"
              >
                View All Guides <ArrowLeft className="rotate-180" size={14} />
              </Link>
            </div>

            {/* Related Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((art) => (
                <Link key={art.id} to={`/blog/${art.slug}`} className="block group">
                  <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={art.cover}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span
                        className="absolute top-3 left-3 text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: art.categoryColor }}
                      >
                        {art.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                          <Calendar size={10} /> {art.date}
                        </p>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-[#0042d7] transition-colors">
                          {art.title}
                        </h3>
                      </div>
                      <span className="flex items-center gap-1 text-[#0042d7] font-bold text-[11px] mt-3 group-hover:gap-1.5 transition-all">
                        Read Guide <ArrowRight size={11} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
