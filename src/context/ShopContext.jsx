import React, { createContext, useContext, useState, useEffect } from 'react';
import { BLOG_ARTICLES as staticBlogs } from '../data/blogData';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_NAV_LINKS,
  DEFAULT_FOOTER_LINK_GROUPS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_BLOG_PAGE_SETTINGS,
  DEFAULT_BLOG_CATEGORIES,
} from '../data/siteContent';
import {
  fetchProducts,
  fetchBlogs,
  fetchSiteSettings,
  fetchNavLinks,
  fetchFooterLinkGroups,
  fetchSocialLinks,
  fetchHeroSlides,
  fetchSectionBanners,
  fetchContactPage,
  fetchBlogCategories,
  fetchBlogPageSettings,
  fetchCategories,
} from '../api/shopApi';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  // Catalog data — products come directly from the database (no static fallback)
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState(staticBlogs);

  // Site content (navbar/footer) — served from the API, fallback defaults if unreachable
  const [siteSettings, setSiteSettings] = useState(null);
  const [navLinks, setNavLinks] = useState(DEFAULT_NAV_LINKS);
  const [footerLinkGroups, setFooterLinkGroups] = useState(DEFAULT_FOOTER_LINK_GROUPS);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [heroSlides, setHeroSlides] = useState([]);
  const [sectionBanners, setSectionBanners] = useState({});
  const [sectionBannersList, setSectionBannersList] = useState([]);
  const [contactPage, setContactPage] = useState(DEFAULT_CONTACT_PAGE);
  const [blogPageSettings, setBlogPageSettings] = useState(DEFAULT_BLOG_PAGE_SETTINGS);
  const [blogCategories, setBlogCategories] = useState(DEFAULT_BLOG_CATEGORIES);
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((list) => {
        console.log('[ShopContext] Fetched products:', Array.isArray(list) ? list.length : 'not array');
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error('[ShopContext] Failed to fetch products:', err);
      });
    fetchBlogs()
      .then((list) => { if (list.length) setBlogs(list); })
      .catch(() => {});
    fetchSiteSettings()
      .then((data) => { if (data && Object.keys(data).length) setSiteSettings((prev) => ({ ...prev, ...data })); })
      .catch(() => {});
    fetchNavLinks()
      .then((list) => { if (list.length) setNavLinks(list); })
      .catch(() => {});
    fetchFooterLinkGroups()
      .then((list) => { if (list.length) setFooterLinkGroups(list); })
      .catch(() => {});
    fetchSocialLinks()
      .then((list) => { if (list.length) setSocialLinks(list); })
      .catch(() => {});
    fetchHeroSlides()
      .then((list) => { if (list.length) setHeroSlides(list); })
      .catch(() => {});
    fetchContactPage()
      .then((data) => { if (data && Object.keys(data).length) setContactPage((prev) => ({ ...prev, ...data })); })
      .catch(() => {});
    fetchBlogPageSettings()
      .then((data) => { if (data && Object.keys(data).length) setBlogPageSettings((prev) => ({ ...prev, ...data })); })
      .catch(() => {});
    fetchBlogCategories()
      .then((list) => { if (list.length) setBlogCategories(list); })
      .catch(() => {});
    fetchCategories()
      .then((list) => { if (list.length) setProductCategories(list); })
      .catch(() => {});
    fetchSectionBanners()
      .then((list) => {
        setSectionBannersList(Array.isArray(list) ? list : []);
        setSectionBanners((prev) => {
          const byKey = { ...prev };
          (list || []).forEach((banner) => { byKey[banner.sectionKey] = banner; });
          return byKey;
        });
      })
      .catch(() => {});
  }, []);

  // Cart State
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('electro_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('electro_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Compare State
  const [compareList, setCompareList] = useState(() => {
    const savedCompare = localStorage.getItem('electro_compare');
    return savedCompare ? JSON.parse(savedCompare) : [];
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Sync to Local Storage and DOM
  useEffect(() => {
    localStorage.setItem('electro_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('electro_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('electro_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('electro_theme', darkMode ? 'dark' : 'light');
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.price * (1 - (item.product.discount || 0) / 100);
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const isAlreadyIn = prevWishlist.some((item) => item.id === product.id);
      if (isAlreadyIn) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Compare Functions
  const toggleCompare = (product) => {
    setCompareList((prevCompare) => {
      const isAlreadyIn = prevCompare.some((item) => item.id === product.id);
      if (isAlreadyIn) {
        return prevCompare.filter((item) => item.id !== product.id);
      }
      if (prevCompare.length >= 4) {
        alert("You can compare a maximum of 4 products at a time.");
        return prevCompare;
      }
      return [...prevCompare, product];
    });
  };

  const isInCompare = (productId) => {
    return compareList.some((item) => item.id === productId);
  };

  const removeFromCompare = (productId) => {
    setCompareList((prevCompare) => prevCompare.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ShopContext.Provider
      value={{
        products,
        blogs,
        siteSettings,
        navLinks,
        footerLinkGroups,
        socialLinks,
        heroSlides,
        sectionBanners,
        sectionBannersList,
        contactPage,
        blogPageSettings,
        blogCategories,
        productCategories,
        cart,
        wishlist,
        compareList,
        darkMode,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        clearCompare,
        toggleTheme,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
