import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import Banner from "./Banner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CompareDrawer from "../Products/CompareDrawer";
import QuickViewModal from "../Products/QuickViewModal";
import ScrollToTopButton from "./ScrollToTopButton";
import CartDrawer from "../Cart/CartDrawer";

const AppLayout = ({
  children,
  activeTab,
  setActiveTab,
  navigate,
  location,
  selectedBlog,
  setSelectedBlog,
  currentUser,
  handleLogout,
  unifiedCart,
  showScrollTop,
  quickViewProduct,
  setQuickViewProduct,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = (unifiedCart || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      {/* 1. Banner */}
      <Banner />

      {/* 2. Navbar - Sticky Header */}
      <div className="sticky top-0 z-40 bg-white">
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "blogs") {
            navigate("/blog");
          } else if (tab === "featured") {
            setActiveTab("home");
            setSelectedBlog(null);
            navigate("/");
            setTimeout(() => {
              document
                .getElementById("featured-products-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else if (tab === "products") {
            navigate("/products");
          } else if (tab === "contact") {
            navigate("/contact");
          } else if (tab === "cart") {
            navigate("/checkout");
          } else {
            setActiveTab(tab);
            navigate("/");
            if (
              window.location.hash === "#blogs" ||
              window.location.hash === "#blogs-section" ||
              window.location.hash === "#project-guides-section" ||
              window.location.hash === "#featured-products-section"
            ) {
              window.history.pushState(
                "",
                document.title,
                window.location.pathname + window.location.search,
              );
            }
            if (tab === "home") {
              setSelectedBlog(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={unifiedCart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      </div>

      {/* 3. Core Page Content */}
      <main className="main-content-full">{children}</main>

      {/* 5. Footer */}
      <Footer />

      {/* Bottom compare widgets */}
      <CompareDrawer />

      {/* Global Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Scroll to Top Button */}
      <ScrollToTopButton showScrollTop={showScrollTop} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex items-center bg-white rounded-full shadow-xl z-50 border border-gray-100 p-1.5 gap-1">
        {/* Wishlist Button */}
        <Link
          to="/wishlist"
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 text-red-500 hover:bg-gray-50 rounded-full transition-all duration-200"
          title="View Wishlist"
        >
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        </Link>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="icon relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 text-blue-600 hover:bg-gray-50 rounded-full transition-all duration-200 cursor-pointer animate-none"
          title="Open Cart"
        >
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default AppLayout;
