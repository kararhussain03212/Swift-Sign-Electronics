import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { DEFAULT_PROJECTS } from '../data/projectsData';

export function useAppState() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart: shopCart, 
    wishlist: shopWishlist, 
    addToCart: shopAddToCart, 
    removeFromCart: shopRemoveFromCart, 
    toggleWishlist: shopToggleWishlist 
  } = useShop();

  const [activeTab, setActiveTab] = useState('home');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top only on route/pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [projectsList, setProjectsList] = useState(() => {
    const saved = localStorage.getItem('swift-sign-projects');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 1) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROJECTS;
  });

  const [draftsList, setDraftsList] = useState(() => {
    const saved = localStorage.getItem('swift-sign-drafts');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const handlePublishProject = (newProj) => {
    setProjectsList(prev => {
      const updated = [...prev, newProj];
      localStorage.setItem('swift-sign-projects', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveDraft = (draftProj) => {
    setDraftsList(prev => {
      const updated = [...prev, draftProj];
      localStorage.setItem('swift-sign-drafts', JSON.stringify(updated));
      return updated;
    });
  };

  // Sync back to localstorage if list changes
  useEffect(() => {
    localStorage.setItem('swift-sign-projects', JSON.stringify(projectsList));
  }, [projectsList]);

  useEffect(() => {
    localStorage.setItem('swift-sign-drafts', JSON.stringify(draftsList));
  }, [draftsList]);

  const [accountInitialIsLogin, setAccountInitialIsLogin] = useState(true);
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('swift-sign-user');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('swift-sign-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('swift-sign-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('swift-sign-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('swift-sign-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Compute unified cart and wishlist from both portal and shop context
  const portalCartMapped = cartItems.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    quantity: item.quantity || 1,
    isPortal: true
  }));

  const shopCartMapped = (shopCart || []).map(item => ({
    id: `shop-${item.product.id}`,
    title: item.product.name,
    price: `Rs. ${(item.product.price * (1 - (item.product.discount || 0) / 100)).toLocaleString()}`,
    image: item.product.thumbnail,
    category: item.product.category,
    quantity: item.quantity,
    isPortal: false,
    shopId: item.product.id
  }));

  const unifiedCart = [...portalCartMapped, ...shopCartMapped];

  const portalWishlistMapped = wishlistItems.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    isPortal: true
  }));

  const shopWishlistMapped = (shopWishlist || []).map(item => ({
    id: `shop-${item.id}`,
    title: item.name,
    price: `Rs. ${(item.price * (1 - (item.discount || 0) / 100)).toLocaleString()}`,
    image: item.thumbnail,
    category: item.category,
    isPortal: false,
    shopId: item.id
  }));

  const unifiedWishlist = [...portalWishlistMapped, ...shopWishlistMapped];

  // URL Hash handling
  useEffect(() => {
    const handleUrlState = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view');

      if (view === 'add-project') {
        setActiveTab('add-project');
      } else if (hash === '#blogs' || hash === '#blogs-section' || hash === '#project-guides-section' || hash === '#featured-products-section') {
        setActiveTab('home');
        setSelectedBlog(null);
        setTimeout(() => {
          const targetId = hash === '#featured-products-section' ? 'featured-products-section' : 'project-guides-section';
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === '#preview') {
        const saved = localStorage.getItem('swift-sign-preview-project');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setActiveTab('home');
            setSelectedBlog(parsed);
          } catch (e) {
            console.error('Error loading preview', e);
          }
        }
      } else if (hash.startsWith('#project-')) {
        const projId = parseInt(hash.replace('#project-', ''), 10);
        const proj = projectsList.find(p => p.id === projId);
        if (proj) {
          setActiveTab('home');
          setSelectedBlog(proj);
        }
      }
    };

    handleUrlState();
    window.addEventListener('hashchange', handleUrlState);
    return () => window.removeEventListener('hashchange', handleUrlState);
  }, [projectsList]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('swift-sign-user', JSON.stringify(user));
    if (activeTab === 'account') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('swift-sign-user');
    setActiveTab('home');
  };

  const handleSetSelectedBlog = (blog) => {
    setSelectedBlog(blog);
    if (blog) {
      window.location.hash = `#project-${blog.id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
    }
  };

  // Cart actions
  const handleRemoveFromCart = (id) => {
    if (typeof id === 'string' && id.startsWith('shop-')) {
      const shopId = parseInt(id.replace('shop-', ''), 10);
      shopRemoveFromCart(shopId);
    } else {
      setCartItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleMoveToCart = (item) => {
    if (item.id && typeof item.id === 'string' && item.id.startsWith('shop-')) {
      const shopId = parseInt(item.id.replace('shop-', ''), 10);
      const prod = shopWishlist.find(p => p.id === shopId);
      if (prod) {
        shopAddToCart(prod);
        shopToggleWishlist(prod);
      }
    } else {
      setCartItems(prev => {
        const exists = prev.find(i => i.id === item.id);
        if (exists) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
        }
        return [...prev, { ...item, price: item.price || 'Rs. 0', quantity: 1 }];
      });
      setWishlistItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleRemoveFromWishlist = (id) => {
    if (typeof id === 'string' && id.startsWith('shop-')) {
      const shopId = parseInt(id.replace('shop-', ''), 10);
      const prod = shopWishlist.find(p => p.id === shopId);
      if (prod) {
        shopToggleWishlist(prod);
      }
    } else {
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      }
      return [...prev, { ...product, price: product.price || 'Rs. 0', quantity: 1 }];
    });
  };

  const handleAddToWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.filter(i => i.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Sync router path changes back to tab state
  useEffect(() => {
    if (location.pathname === '/products') {
      setActiveTab('products');
    } else if (location.pathname.startsWith('/product/')) {
      setActiveTab('product-details');
    } else if (location.pathname === '/contact') {
      setActiveTab('contact');
    } else if (location.pathname === '/checkout') {
      setActiveTab('checkout');
    } else if (location.pathname === '/checkout/details') {
      setActiveTab('checkout-details');
    } else if (location.pathname === '/blog' || location.pathname.startsWith('/blog/')) {
      setActiveTab('blogs');
    } else if (
      location.pathname === '/privacy-policy' ||
      location.pathname === '/return-policy' ||
      location.pathname === '/shipping-policy' ||
      location.pathname === '/terms-and-conditions'
    ) {
      setActiveTab('policies');
    } else if (location.pathname === '/') {
      // Keep active tab as is (e.g. home, dashboard, account, add-project)
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    if (tab === "products") {
      navigate("/products");
    } else if (tab === "contact") {
      navigate("/contact");
    } else if (tab === "cart") {
      navigate("/checkout");
    } else if (tab === "blogs") {
      navigate("/blog");
    } else {
      setActiveTab(tab);
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    navigate,
    location,
    activeTab,
    setActiveTab,
    selectedBlog,
    setSelectedBlog,
    showScrollTop,
    quickViewProduct,
    setQuickViewProduct,
    projectsList,
    currentUser,
    handleLogout,
    unifiedCart,
    wishlistItems,
    setWishlistItems,
    handleSetSelectedBlog,
    handleTabChange
  };
}
