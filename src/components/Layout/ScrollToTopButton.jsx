import React from "react";

const ScrollToTopButton = ({ showScrollTop }) => {
  if (!showScrollTop) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#0fafb8] text-white shadow-[0_4px_14px_rgba(15,175,184,0.4)] hover:bg-[#0a7981] hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center border-2 border-white/20"
      aria-label="Scroll to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
