import React from "react";
import Banner from "./Banner";
import Navbar from "./Navbar";
import HeroSlider from "../Home/HeroSlider";
import Footer from "./Footer";
import CompareDrawer from "../Products/CompareDrawer";
import QuickViewModal from "../Products/QuickViewModal";
import ScrollToTopButton from "./ScrollToTopButton";

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
  return (
    <div className="app-container">
      {/* 1. Banner */}
      <Banner />

      {/* 2. Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "blogs") {
            setActiveTab("home");
            setSelectedBlog(null);
            navigate("/");
            setTimeout(() => {
              document
                .getElementById("project-guides-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 100);
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

      {/* 3. Hero Section Slider - Only show on home page and home tab when not viewing details */}
      {location.pathname === "/" && activeTab === "home" && !selectedBlog && (
        <HeroSlider />
      )}

      {/* 4. Core Page Content */}
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
    </div>
  );
};

export default AppLayout;
