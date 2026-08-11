import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiHeart, FiShoppingCart, FiShare2,
  FiFileText, FiPlus, FiMinus, FiCheck, FiChevronDown, FiAlertCircle,
  FiMail, FiPhone, FiInfo, FiActivity, FiEdit2, FiTrash2, FiX
} from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import ProductGallery from '../components/Products/ProductGallery';
import ProductTabs from '../components/Products/ProductTabs';
import RelatedProducts from '../components/Products/RelatedProducts';
import Rating from '../components/Products/Rating';
import {
  fetchProductComments,
  submitProductComment,
  updateProductComment,
  deleteProductComment,
} from '../api/shopApi';

const COMMENT_TOKENS_KEY = 'electro_comment_tokens';

const loadCommentTokens = () => {
  try {
    return JSON.parse(localStorage.getItem(COMMENT_TOKENS_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveCommentToken = (commentId, token) => {
  const tokens = loadCommentTokens();
  tokens[commentId] = token;
  localStorage.setItem(COMMENT_TOKENS_KEY, JSON.stringify(tokens));
};

const removeCommentToken = (commentId) => {
  const tokens = loadCommentTokens();
  delete tokens[commentId];
  localStorage.setItem(COMMENT_TOKENS_KEY, JSON.stringify(tokens));
};

export default function ProductDetails({ onQuickView }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    products,
    productsLoaded,
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

  // Comments State
  const [comments, setComments] = useState([]);
  const [commentTokens, setCommentTokens] = useState(loadCommentTokens);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [commentActionError, setCommentActionError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim() || !commentEmail.trim() || !product) return;

    setCommentSubmitting(true);
    setCommentError('');
    try {
      const saved = await submitProductComment(product.id, {
        name: commentName.trim(),
        email: commentEmail.trim(),
        comment: newComment.trim(),
      });
      saveCommentToken(saved.id, saved.edit_token);
      setCommentTokens(loadCommentTokens());
      setComments((prev) => [
        { id: saved.id, product_id: saved.product_id, name: saved.name, comment: saved.comment, created_at: saved.created_at, updated_at: saved.updated_at },
        ...prev,
      ]);
      setNewComment('');
      setCommentName('');
      setCommentEmail('');
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment. Please try again.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const startEditComment = (comment) => {
    setCommentActionError('');
    setEditingCommentId(comment.id);
    setEditingText(comment.comment);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const saveEditComment = async (commentId) => {
    const token = commentTokens[commentId];
    if (!token || !editingText.trim()) return;
    setCommentActionError('');
    try {
      const updated = await updateProductComment(commentId, {
        edit_token: token,
        comment: editingText.trim(),
      });
      setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, comment: updated.comment, updated_at: updated.updated_at } : c)));
      setEditingCommentId(null);
      setEditingText('');
    } catch (err) {
      setCommentActionError(err.message || 'Failed to update comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = commentTokens[commentId];
    if (!token) return;
    if (!window.confirm('Delete this comment?')) return;
    setCommentActionError('');
    try {
      await deleteProductComment(commentId, token);
      removeCommentToken(commentId);
      setCommentTokens(loadCommentTokens());
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setCommentActionError(err.message || 'Failed to delete comment.');
    }
  };

  // 1. Fetch Product
  const product = useMemo(() => {
    return products.find((p) => p.slug === slug);
  }, [products, slug]);

  // Redirect if product not found (only after the product list has finished loading,
  // otherwise this fires on the very first render while products is still [] and
  // incorrectly bounces every direct/deep link to the home page).
  useEffect(() => {
    if (productsLoaded && !product) {
      navigate('/');
    }
  }, [product, productsLoaded, navigate]);

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

  // 3. Fetch comments for this product
  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    fetchProductComments(product.id)
      .then((rows) => { if (!cancelled) setComments(rows); })
      .catch((err) => console.error('[ProductDetails] failed to load comments:', err));
    return () => { cancelled = true; };
  }, [product]);

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
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-5 sm:py-8 md:py-10 min-h-screen space-y-8 sm:space-y-12 md:space-y-16 text-left">
      
      {/* Breadcrumbs */}
      <div className="text-xs sm:text-sm font-semibold text-slate-400">
        <Link to="/" className="hover:text-blue-500 transition-colors">Catalog</Link>
        <span className="mx-1.5 sm:mx-2">/</span>
        <span className="text-slate-500">{product.category}</span>
        <span className="mx-1.5 sm:mx-2">/</span>
        <span className="text-slate-700 line-clamp-1 inline-block align-bottom max-w-[140px] sm:max-w-xs md:max-w-sm">{product.name}</span>
      </div>

      {/* Main Details Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        
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
                Model: <strong className="text-slate-700">{product.model}</strong>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
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
          <div className="pt-4 sm:pt-6 border-t border-slate-200 space-y-3 sm:space-y-4">

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
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

      {/* Tabs section */}
      <section className="bg-white border border-slate-200/80 rounded-none p-4 sm:p-6 md:p-10 shadow-xs">
        <ProductTabs product={product} />
      </section>



      {/* Accordion FAQ Area */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl md:text-2xl font-black text-slate-800 text-slate-800">
            Frequently Asked Questions
          </h3>

          <div className="border border-slate-200 border-slate-200 rounded-none overflow-hidden bg-white bg-white shadow-xs divide-y divide-slate-100">
            {product.faqs.map((faq, idx) => (
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
      )}

      {/* Comments / Reviews Section */}
      <section className="bg-white border border-slate-200 p-6 md:p-10 shadow-sm mt-8">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-6">Comments & Reviews</h3>

        {commentActionError && (
          <p className="text-xs text-red-500 font-semibold mb-4">{commentActionError}</p>
        )}

        {/* Comments List */}
        <div className="space-y-6 mb-10">
          {comments.length === 0 ? (
            <p className="text-slate-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map(comment => {
              const isOwner = Boolean(commentTokens[comment.id]);
              const isEditing = editingCommentId === comment.id;
              const displayDate = comment.updated_at || comment.created_at;

              return (
                <div key={comment.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2 gap-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {comment.name}
                        {isOwner && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">You</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-slate-400 mt-0.5">
                        {displayDate ? String(displayDate).split(' ')[0] : ''}
                      </span>
                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditComment(comment)}
                            className="text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                            title="Edit comment"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete comment"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        className="w-full border border-slate-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[80px]"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditComment}
                          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded cursor-pointer"
                        >
                          <FiX className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={() => saveEditComment(comment.id)}
                          className="flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded cursor-pointer"
                        >
                          <FiCheck className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">{comment.comment}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment Form */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-4">Leave a Comment</h4>
          {commentError && (
            <p className="text-xs text-red-500 font-semibold mb-3">{commentError}</p>
          )}
          <form onSubmit={handleAddComment} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                className="w-full border border-slate-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Your Name *"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
              />
              <input
                type="email"
                className="w-full border border-slate-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Your Email *"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                required
              />
            </div>
            <textarea
              className="w-full border border-slate-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px]"
              placeholder="Write your review or comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commentSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
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
