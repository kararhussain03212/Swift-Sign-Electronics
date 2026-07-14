import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProductList from "./pages/product/ProductList";
import ProductForm from "./pages/product/ProductForm";
import BlogList from "./pages/blog/BlogList";
import BlogForm from "./pages/blog/BlogForm";
import BlogCategoryList from "./pages/blogCategory/BlogCategoryList";
import BlogCategoryForm from "./pages/blogCategory/BlogCategoryForm";

import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import SliderList from "./pages/slider/SliderList";
import SliderForm from "./pages/slider/SliderForm";
import CategoryList from "./pages/category/CategoryList";
import CategoryForm from "./pages/category/CategoryForm";
import SectionBannerList from "./pages/sections/SectionBannerList";
import SectionBannerForm from "./pages/sections/SectionBannerForm";
import OrderList from "./pages/orders/OrderList";
import SiteSettings from "./pages/settings/SiteSettings";
import UserManagement from "./pages/users/UserManagement";
import ContactMessages from "./pages/contact/ContactMessages";
import ContactPageSettings from "./pages/contact/ContactPageSettings";
import CustomerAddresses from "./pages/addresses/CustomerAddresses";
import SiteContentSettings from "./pages/site/SiteContentSettings";
import FooterManager from "./pages/site/FooterManager";
import SocialLinkManager from "./pages/site/SocialLinkManager";
import { useAuth } from "./context/useAuth";

function Forbidden403() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 text-4xl">
        🔒
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">403 — Forbidden</h1>
        <p className="mt-2 max-w-sm text-white/60">
          You don't have permission to access this page. Contact your administrator to request access.
        </p>
      </div>
    </div>
  );
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function PermissionPage({ permission, children }) {
  const { can } = useAuth();
  if (!can(permission)) {
    return (
      <ProtectedPage>
        <Forbidden403 />
      </ProtectedPage>
    );
  }
  return <>{children}</>;
}

export default function App() {
  const basename =
    typeof window !== "undefined"
      ? (() => {
          const { pathname } = window.location;
          const adminIndex = pathname.indexOf("/admin");
          if (adminIndex === -1) return undefined;
          return pathname.slice(0, adminIndex + "/admin".length);
        })()
      : undefined;

  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
          <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />

          <Route path="/products" element={<ProtectedPage><ProductList /></ProtectedPage>} />
          <Route path="/products/new" element={<ProtectedPage><ProductForm /></ProtectedPage>} />
          <Route path="/products/edit/:id" element={<ProtectedPage><ProductForm /></ProtectedPage>} />

          <Route path="/categories" element={<ProtectedPage><CategoryList /></ProtectedPage>} />
          <Route path="/categories/new" element={<ProtectedPage><CategoryForm /></ProtectedPage>} />
          <Route path="/categories/edit/:id" element={<ProtectedPage><CategoryForm /></ProtectedPage>} />

          <Route path="/section-banners" element={<ProtectedPage><SectionBannerList /></ProtectedPage>} />
          <Route path="/section-banners/new" element={<ProtectedPage><SectionBannerForm /></ProtectedPage>} />
          <Route path="/section-banners/edit/:id" element={<ProtectedPage><SectionBannerForm /></ProtectedPage>} />

          <Route path="/orders" element={<ProtectedPage><OrderList /></ProtectedPage>} />

          <Route path="/sliders" element={<ProtectedPage><SliderList /></ProtectedPage>} />
          <Route path="/sliders/new" element={<ProtectedPage><SliderForm /></ProtectedPage>} />
          <Route path="/sliders/edit/:id" element={<ProtectedPage><SliderForm /></ProtectedPage>} />

          <Route path="/blogs" element={<ProtectedPage><BlogList /></ProtectedPage>} />
          <Route path="/blogs/new" element={<ProtectedPage><BlogForm /></ProtectedPage>} />
          <Route path="/blogs/edit/:id" element={<ProtectedPage><BlogForm /></ProtectedPage>} />

          <Route path="/blog-categories" element={<ProtectedPage><BlogCategoryList /></ProtectedPage>} />
          <Route path="/blog-categories/new" element={<ProtectedPage><BlogCategoryForm /></ProtectedPage>} />
          <Route path="/blog-categories/edit/:id" element={<ProtectedPage><BlogCategoryForm /></ProtectedPage>} />

          <Route path="/profile" element={<ProtectedPage><Admin /></ProtectedPage>} />

          <Route
            path="/settings"
            element={
              <ProtectedPage>
                <Navigate to="/settings/site-content" replace />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/site-content"
            element={
              <ProtectedPage>
                <SiteContentSettings />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/nav-links"
            element={
              <ProtectedPage>
                <Navigate to="/settings/site-content" replace />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/footer-links"
            element={
              <ProtectedPage>
                <FooterManager />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/social-links"
            element={
              <ProtectedPage>
                <SocialLinkManager />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/contact"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="contact" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/blog"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="blog" />
              </ProtectedPage>
            }
          />

          <Route path="/contact-messages" element={<ProtectedPage><ContactMessages /></ProtectedPage>} />
          <Route path="/contact-settings" element={<ProtectedPage><ContactPageSettings /></ProtectedPage>} />

          <Route
            path="/users"
            element={
              <PermissionPage permission="manage_users">
                <ProtectedPage>
                  <UserManagement />
                </ProtectedPage>
              </PermissionPage>
            }
          />

          <Route path="/addresses" element={<ProtectedPage><CustomerAddresses /></ProtectedPage>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
