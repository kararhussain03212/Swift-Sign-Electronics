import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import fallbackLogo from "../assets/images/web_logo.png";
import { getBackendRoot } from "../api/runtimeApi";
import { getSettings } from "../api/settingApi";

const NAV = [
  // Overview
  { path: "/dashboard",         label: "Dashboard" },

  // Shop Management
  { path: "/products",          label: "Products" },
  { path: "/categories",        label: "Categories" },
  { path: "/orders",            label: "Orders" },

  // Content & Display
  { path: "/sliders",           label: "Hero Slides" },
  { path: "/section-banners",   label: "Section Banners" },

  // Blog Management
  { path: "/blogs",             label: "Blogs" },
  { path: "/blog-categories",   label: "Blog Categories" },
  { path: "/settings/blog",     label: "Blog Page" },

  // Pages & Messages
  { path: "/contact-settings",  label: "Contact Page" },
  { path: "/contact-messages",  label: "Contact Messages" },

  // Site Configuration
  { path: "/settings/site-content", label: "Navbar" },
  { path: "/settings/footer-links", label: "Footer Manager" },
  { path: "/settings/social-links", label: "Social Links" },

  // User Management
  { path: "/users",             label: "User Management", adminOnly: true },
];

const PAGE_TITLES = {
  "/":                               "Dashboard",
  "/dashboard":                      "Dashboard",
  "/orders":                         "Orders",
  "/sliders":                        "Hero Slides",
  "/sliders/new":                    "Add Hero Slide",
  "/products":                       "Products",
  "/products/new":                   "Add Product",
  "/categories":                     "Categories",
  "/categories/new":                 "Add Category",
  "/section-banners":                "Section Banners",
  "/section-banners/new":            "Add Section Banner",
  "/blogs":                          "Blogs",
  "/blogs/new":                      "Add Blog",
  "/blog-categories":                "Blog Categories",
  "/blog-categories/new":            "Add Blog Category",
  "/contact-messages":               "Contact Messages",
  "/contact-settings":               "Contact Page Settings",
  "/settings/site-content":          "Navbar",
  "/settings/footer-links":          "Footer Manager",
  "/settings/social-links":          "Social Links Manager",
  "/settings/blog":                  "Blog Page Settings",
  "/profile":                        "Admin Profile",
  "/users":                          "User Management",
  "/addresses":                      "Customer Addresses",
};

/* nav-link class helpers */
const cls = {
  link: (active) =>
    `mb-0.5 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
      active
        ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] font-semibold text-[var(--admin-accent)]"
        : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
    }`,
  child: (active) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
      active
        ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] font-semibold text-[var(--admin-accent)]"
        : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
    }`,
  drop: (active) =>
    `flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
      active
        ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] font-semibold text-[var(--admin-accent)]"
        : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
    }`,
};

export default function Layout({ children }) {
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [logoutOpen,       setLogoutOpen]        = useState(false);
  const [siteLogo,         setSiteLogo]          = useState(fallbackLogo);

  const { user, logout } = useAuth();
  const isAdmin  = user?.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  /* ── fetch logo from site settings once ── */
  useEffect(() => {
    getSettings()
      .then((res) => {
        const s = res?.data?.data ?? res?.data ?? {};
        const logo = s.navbar_logo || s.nav_logo || "";
        if (logo && /^https?:\/\//i.test(logo)) setSiteLogo(logo);
      })
      .catch(() => {});
  }, []);

  /* ── body scroll lock on mobile overlay ── */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  /* ── Escape key closes logout dialog ── */
  useEffect(() => {
    if (!logoutOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setLogoutOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [logoutOpen]);

  const pageTitle = useMemo(() => {
    if (PAGE_TITLES[location.pathname]) return PAGE_TITLES[location.pathname];
    if (location.pathname.startsWith("/sliders/edit"))         return "Edit Hero Slide";
    if (location.pathname.startsWith("/products/edit"))        return "Edit Product";
    if (location.pathname.startsWith("/categories/edit"))      return "Edit Category";
    if (location.pathname.startsWith("/section-banners/edit")) return "Edit Section Banner";
    if (location.pathname.startsWith("/blogs/edit"))           return "Edit Blog";
    if (location.pathname.startsWith("/blog-categories/edit")) return "Edit Blog Category";
    return "Dashboard";
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/dashboard"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const closeSidebar = () => setSidebarOpen(false);

  const resolvePhoto = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const root = getBackendRoot();
    return raw.startsWith("/") ? `${root}${raw}` : `${root}/uploads/${raw}`;
  };

  const photoUrl = resolvePhoto(user?.profile_photo);

  return (
    <div className="admin-theme flex min-h-screen w-full bg-[var(--admin-bg)] text-white">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[100] flex w-64 max-w-[85vw] flex-col
          border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Brand logo */}
        <div className="flex items-center gap-2 border-b border-[var(--admin-border)] px-3 py-3.5">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2.5 transition-all hover:border-[var(--admin-border-amber)] hover:shadow-[0_0_16px_rgba(224,184,92,0.15)]"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-deep)] shadow-[0_4px_14px_rgba(73,99,72,0.5)]">
              <img
                src={siteLogo}
                alt="Swift Sign Electronics"
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = fallbackLogo; }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[var(--admin-muted)]">Admin Panel</p>
              <p className="truncate text-sm font-bold text-white transition-colors group-hover:text-[var(--admin-accent)]">
                Swift Sign Electronics
              </p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeSidebar}
            className="flex-shrink-0 rounded-lg p-1.5 text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <span className="pi pi-times" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2.5 pb-4">
          <p className="mb-1 mt-2 px-3 text-[9px] font-bold uppercase tracking-widest text-[var(--admin-muted)]">
            Main
          </p>

          {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            <Link key={item.path} to={item.path} onClick={closeSidebar} className={cls.link(isActive(item.path))}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--admin-border)] p-2.5">
          <Link
            to="/profile"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--admin-sidebar-hover)]"
          >
            {photoUrl ? (
              <img src={photoUrl} alt={user?.name} className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-[var(--admin-border-amber)]" />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-accent)] text-xs font-bold ring-2 ring-[var(--admin-border-amber)]">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name || "Admin"}</p>
              <p className="text-xs capitalize text-[var(--admin-muted)]">{user?.role || "user"}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLogoutOpen(true); }}
              className="flex-shrink-0 rounded-lg p-1.5 text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
              aria-label="Logout"
            >
              <span className="pi pi-sign-out text-sm" />
            </button>
          </Link>
        </div>
      </aside>

      {/* ══ MAIN AREA ════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex min-h-14 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-card)]/90 px-4 py-2.5 backdrop-blur-lg sm:min-h-16 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex-shrink-0 rounded-lg p-2 text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-sidebar-hover)] hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <span className="pi pi-bars text-base" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-white sm:text-lg">{pageTitle}</h1>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--admin-primary-strong)]"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-6">{children}</main>
      </div>

      {/* ══ LOGOUT DIALOG ════════════════════════════════════ */}
      {logoutOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--admin-border-amber)] bg-[var(--admin-card)] p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-primary-light)]">
                <span className="pi pi-sign-out text-[var(--admin-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--admin-ink)]">Logout</h3>
                <p className="text-xs text-[var(--admin-muted)]">You will be returned to the login page.</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="rounded-lg border border-[var(--admin-border)] px-4 py-2 text-sm font-semibold text-[var(--admin-ink)] hover:bg-[var(--admin-card-elevated)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { setLogoutOpen(false); logout(); navigate("/login"); }}
                className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--admin-primary-strong)]"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
