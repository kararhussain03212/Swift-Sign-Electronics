import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiHeart, FiShoppingCart, FiShare2,
  FiFileText, FiPlus, FiMinus, FiCheck, FiChevronDown, FiAlertCircle,
  FiMail, FiPhone, FiInfo, FiActivity
} from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import ProductGallery from '../components/Products/ProductGallery';
import ProductTabs from '../components/Products/ProductTabs';
import RelatedProducts from '../components/Products/RelatedProducts';
import Rating from '../components/Products/Rating';

export default function ProductDetails({ onQuickView }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);
  


  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState({});

  // 1. Fetch Product
  const product = useMemo(() => {
    return products.find((p) => p.slug === slug);
  }, [products, slug]);

  // Redirect if product not found
  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  // 2. Track Recently Viewed in LocalStorage
  useEffect(() => {
    if (!product) return;
    const recent = localStorage.getItem('electro_recent');
    let recentList = recent ? JSON.parse(recent) : [];
    
    // Add current product, remove duplicate, and slice to max 4 items
    recentList = [product.id, ...recentList.filter((id) => id !== product.id)].slice(0, 5);
    localStorage.setItem('electro_recent', JSON.stringify(recentList));

    // Convert IDs back to full products
    const fullRecentProducts = products.filter(
      (p) => recentList.includes(p.id) && p.id !== product.id
    );
    setRecentProducts(fullRecentProducts);
    
    // Reset page configurations
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product, products]);

  if (!product) return null;

  const isAlreadyInWishlist = isInWishlist(product.id);
  const isAlreadyInCompare = isInCompare(product.id);
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const isOutOfStock = product.stock <= 0;

  // Share link handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 min-h-screen space-y-16 text-left">
      
      {/* Breadcrumbs */}
      <div className="text-sm font-semibold text-slate-400">
        <Link to="/" className="hover:text-blue-500 transition-colors">Catalog</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-500">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-slate-700 text-slate-700 line-clamp-1 inline-block align-bottom max-w-xs">{product.name}</span>
      </div>

      {/* Main Details Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Product Image & Gallery (Span 6) */}
        <div className="lg:col-span-6 space-y-6">
          <ProductGallery images={product.images || [product.thumbnail]} />
        </div>

        {/* Right Side: Product Details info (Span 6) */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Tag/Brand Header */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-blue-55/80 text-blue-600 text-xs font-black px-3 py-1 rounded-none uppercase">
                {product.category}
              </span>
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                Brand: <strong className="text-slate-700">{product.brand}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-400 font-medium">
                SKU: <strong className="text-slate-700">{product.SKU}</strong>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
              {product.name}
            </h1>

            {/* Rating Summary link */}
            <div className="flex items-center gap-4">
              <Rating value={product.rating} reviewsCount={product.reviews} />
              <span className="text-slate-300">|</span>
              {isOutOfStock ? (
                <span className="bg-red-50 text-red-500 text-xs font-bold px-2.5 py-0.5 rounded-none">
                  Out of Stock
                </span>
              ) : (
                <span className="bg-emerald-55/80 bg-emerald-50 text-emerald-500 text-xs font-bold px-2.5 py-0.5 rounded-none flex items-center gap-1">
                  <FiCheck /> In Stock ({product.stock} items)
                </span>
              )}
            </div>

            {/* Price tag */}
            <div className="p-4 bg-slate-50 bg-slate-100/50 rounded-none flex items-center justify-between border border-slate-200/50 border-slate-200/40">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Unit Price</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-extrabold text-slate-800">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-base text-slate-450 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              {product.discount > 0 && (
                <span className="bg-red-500 text-white font-black text-xs px-3.5 py-1.5 rounded-none shadow-md">
                  SAVE {product.discount}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-slate-500 text-slate-600 text-sm md:text-base leading-relaxed">
              {product.description}
            </p>



          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 border-slate-200 space-y-4">
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Qty Selector */}
              {!isOutOfStock && (
                <div className="flex items-center bg-slate-100 p-1 rounded-none border border-slate-200/50 border-slate-200/40">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-slate-500 hover:text-slate-850 cursor-pointer"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-bold text-slate-700 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-1.5 text-slate-500 hover:text-slate-850 cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Add to Cart button */}
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className={`flex-1 min-w-[150px] flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-none shadow-md transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 shadow-blue-500/20'
                }`}
              >
                <FiShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

              {/* Buy Now button */}
              <button
                disabled={isOutOfStock}
                onClick={() => {
                  addToCart(product, quantity);
                  alert("Proceeding to simulated checkout with this item!");
                }}
                className={`px-5 py-2.5 text-sm font-bold rounded-none transition-all cursor-pointer border ${
                  isOutOfStock
                    ? 'border-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'border-blue-600 hover:bg-blue-50 text-blue-600'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Utility action links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-1.5 hover:text-red-500 cursor-pointer transition-colors ${
                  isAlreadyInWishlist ? 'text-red-500' : ''
                }`}
              >
                <FiHeart className={isAlreadyInWishlist ? 'fill-current' : ''} />
                {isAlreadyInWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>
              <span className="text-slate-300">|</span>

              {/* Compare */}
              <button
                onClick={() => toggleCompare(product)}
                className={`flex items-center gap-1.5 hover:text-orange-500 cursor-pointer transition-colors ${
                  isAlreadyInCompare ? 'text-orange-500' : ''
                }`}
              >
                <FiActivity />
                {isAlreadyInCompare ? 'Added in Compare' : 'Add to Compare'}
              </button>
              <span className="text-slate-300">|</span>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition-colors"
              >
                <FiShare2 />
                {copiedShare ? 'Copied Link!' : 'Share'}
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* Tabs description section */}
      <section className="bg-white bg-white border border-slate-200/80 border-slate-200/80 rounded-none p-6 md:p-10 shadow-xs">
        <ProductTabs product={product} />
      </section>



      {/* Accordion FAQ Area */}
      <section className="space-y-6">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 text-slate-800">
          Frequently Asked Questions
        </h3>
        
        <div className="border border-slate-200 border-slate-200 rounded-none overflow-hidden bg-white bg-white shadow-xs divide-y divide-slate-100">
          {[
            { q: "Is this component certified for industrial application?", a: "Yes, this component matches industrial performance targets and is fully ESD-safe (Electrostatic Discharge protected) where noted in the specifications sheet." },
            { q: "Where can I find drivers or software libraries for this device?", a: "You can find downloadable programming codes, MQTT server templates, and pinout datasheets under the 'Documents' tab on this page." },
            { q: "What is your warranty return policy on burnt components?", a: "We provide 30-day coverage on genuine defects. However, warranty coverage does not protect components burned by improper voltage settings, reversing polarity, or excessive solder thermal stress." }
          ].map((faq, idx) => (
            <div key={idx} className="p-5 space-y-2">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between font-bold text-slate-800 text-slate-700 hover:text-blue-500 text-sm md:text-base cursor-pointer text-left"
              >
                <span>{faq.q}</span>
                <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${faqOpen[idx] ? 'rotate-180 text-blue-500' : ''}`} />
              </button>
              {faqOpen[idx] && (
                <p className="text-sm text-slate-500 text-slate-600 leading-relaxed pt-1.5 border-t border-slate-100 border-slate-200/40">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* Related Products list */}
      <section className="pt-8 border-t border-slate-200 border-slate-200">
        <RelatedProducts
          relatedIds={product.relatedProducts}
          currentProductId={product.id}
          onQuickView={onQuickView}
        />
      </section>

    </div>
  );
}
