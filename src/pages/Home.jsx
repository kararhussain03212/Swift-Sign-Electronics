import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Clock, Calendar, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import CartDrawer from '../components/Cart/CartDrawer';
import ProductCard from '../components/Products/ProductCard';
import {
  BiGridAlt,
  BiVolumeFull,
  BiNetworkChart,
  BiBuildingHouse,
  BiHomeAlt,
  BiPaperPlane,
  BiTestTube,
  BiLeaf,
  BiBot,
  BiJoystick,
  BiBulb,
  BiDesktop
} from 'react-icons/bi';
import { FiWatch } from 'react-icons/fi';

const THEME_COLOR = '#0fafb8';

const SWIPER_STYLE = {
  "--swiper-pagination-color": THEME_COLOR,
  "--swiper-navigation-color": THEME_COLOR,
  "--swiper-navigation-size": "28px"
};

// Featured Categories
const FEATURED_CATEGORIES = [
  { id: 'all', name: 'All categories', icon: BiGridAlt },
  { id: 'audio', name: 'Audio and sound', icon: BiVolumeFull },
  { id: 'iot', name: 'Internet of things', icon: BiNetworkChart },
  { id: 'installations', name: 'Installations', icon: BiBuildingHouse },
  { id: 'home', name: 'Home automation', icon: BiHomeAlt },
  { id: 'flying', name: 'Flying things', icon: BiPaperPlane },
  { id: 'lab', name: 'Lab tools', icon: BiTestTube },
  { id: 'env', name: 'Environment monitoring', icon: BiLeaf },
  { id: 'robotics', name: 'Robotics', icon: BiBot },
  { id: 'games', name: 'Interactive games', icon: BiJoystick },
  { id: 'lighting', name: 'Smart lighting', icon: BiBulb },
  { id: 'displays', name: 'Displays', icon: BiDesktop },
  { id: 'wearables', name: 'Wearables', icon: FiWatch }
];

// Hero Slider Data — static fallback used until the API-backed slides load
const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    title: 'Premium Electronics',
    subtitle: 'Explore our curated collection of quality components',
    image: '/image.png',
  },
  {
    id: 2,
    title: 'Latest Development Boards',
    subtitle: 'Powerful boards for your next project',
    image: '/image copy.png',
  },
  {
    id: 3,
    title: 'Expert Tools & Accessories',
    subtitle: 'Everything you need for electronics projects',
    image: '/image copy 2.png',
  }
];

const DEFAULT_SECTION_BANNERS = [
  {
    sectionKey: 'tools',
    category: 'Tools',
    sectionTitle: 'Tools',
    kicker: 'Tools Essentials',
    title: 'Professional-Grade Tools',
    subtitle: 'Essential tools for electronics projects',
    description: 'Precision hand tools and workstations for soldering, cutting, and assembly.',
    bgImage: '/image.png',
  },
  {
    sectionKey: 'instruments',
    category: 'Instruments',
    sectionTitle: 'Instruments',
    kicker: 'Instruments Essentials',
    title: 'Precision Test Instruments',
    subtitle: 'Precision measurement and diagnostic devices',
    description: 'Multimeters, oscilloscopes, and power supplies for accurate diagnostics.',
    bgImage: '/image copy.png',
  },
  {
    sectionKey: 'projects',
    category: 'Projects',
    sectionTitle: 'Projects',
    kicker: 'Projects Essentials',
    title: 'Complete Project Kits',
    subtitle: 'Complete project kits and components',
    description: 'Everything you need to build, learn, and prototype your next project.',
    bgImage: '/image copy 2.png',
  },
];

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getCartCount, sectionBannersList } = useShop();

  const banners = sectionBannersList.length ? sectionBannersList : DEFAULT_SECTION_BANNERS;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* 1. HERO SLIDER SECTION */}
      <HeroSliderSection />

      {/* 2. FEATURED CATEGORIES SECTION */}
      <FeaturedCategoriesSection />

      {/* 6. DISCOVER ALL PRODUCTS SLIDER */}
      <DiscoverSection />

      {/* 3-5. DYNAMIC CATEGORY SLIDERS — one per active section banner */}
      {banners.map((banner) => (
        <CategorySliderSection
          key={banner.sectionKey}
          sectionName={banner.sectionTitle || banner.category}
          banner={banner}
        />
      ))}

      {/* 8. BLOG SECTION */}
      <BlogSection />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex items-center bg-white rounded-lg shadow-lg z-50">
        {/* Wishlist Button */}
        <Link
          to="/wishlist"
          className="flex items-center justify-center w-16 h-16 text-red-500 hover:bg-gray-50 rounded-l-lg transition-all duration-200"
          title="View Wishlist"
        >
          <Heart className="w-8 h-8 fill-current" />
        </Link>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-200"></div>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center justify-center w-16 h-16 text-blue-600 hover:bg-gray-50 rounded-r-lg transition-all duration-200"
          title="Open Cart"
        >
          <ShoppingCart className="w-8 h-8" />
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
              {getCartCount()}
            </span>
          )}
        </button>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

function HeroSliderSection() {
  const { heroSlides } = useShop();
  const slides = heroSlides?.length ? heroSlides : DEFAULT_HERO_SLIDES;

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full"
        style={SWIPER_STYLE}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative w-full h-[500px] md:h-[650px] flex items-center justify-center overflow-hidden bg-cover bg-center`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              {/* Subtle black gradient to ensure text readability without solid colors */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-between relative z-10">
                {/* Text Content */}
                <div className="flex-1 text-white pr-8">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg drop-shadow-md font-medium">
                    {slide.subtitle}
                  </p>
                  {/* <button className="bg-white text-gray-900 hover:bg-gray-100 font-extrabold px-8 py-3 rounded-lg transition shadow-lg cursor-pointer">
                    {slide.cta}
                  </button> */}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function FeaturedCategoriesSection() {
  const [activeCat, setActiveCat] = useState('all');

  return (
    <div className="w-full my-12 md:my-16">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto no-scrollbar gap-8 items-end h-[80px]">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex flex-col items-center justify-end min-w-max gap-2 px-2 pb-3 border-b-2 transition-all cursor-pointer h-full ${
                  isActive
                    ? `border-[${THEME_COLOR}] text-[${THEME_COLOR}]`
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
                style={isActive ? { borderColor: THEME_COLOR, color: THEME_COLOR } : undefined}
              >
                <Icon className="text-[26px]" />
                <span className="text-[12px] font-bold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CategorySliderSection({ sectionName, banner }) {
  const { products } = useShop();
  const activeCategory = banner.category || sectionName;
  const categoryProducts = products.filter(p => p.category === activeCategory).slice(0, 8);

  return (
    <div className="w-full py-16 md:py-20 border-t border-gray-200 bg-gray-50">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{banner.sectionTitle || sectionName}</h2>
        <p className="text-gray-600 text-lg">{banner.subtitle}</p>
      </div>

      {banner && (
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div
            className="rounded-lg overflow-hidden relative bg-blue-600 bg-cover bg-center"
            style={banner.bgImage ? { backgroundImage: `url('${banner.bgImage}')` } : {}}
          >
            {banner.bgImage && <div className="absolute inset-0 bg-black/60 z-0" />}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14 relative z-10">
              <div className="flex-1 text-white max-w-3xl">
                {banner.kicker && (
                  <div className="mb-2 text-sm font-bold text-blue-200 uppercase tracking-wider">
                    {banner.kicker}
                  </div>
                )}
                <h3 className="text-3xl md:text-4xl font-bold mb-4">{banner.title}</h3>
                <p className="text-blue-100 text-lg mb-6 line-clamp-3">{banner.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8">
        {categoryProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products available in this category</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1536: { slidesPerView: 5 }
            }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            className="w-full"
            style={SWIPER_STYLE}
          >
            {categoryProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

function DiscoverSection() {
  const { products } = useShop();
  return (
    <div className="w-full py-16 md:py-20 border-t border-gray-200 bg-gray-50">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Discover</h2>
        <p className="text-gray-600 text-lg">Explore our complete collection of electronics</p>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products available</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1536: { slidesPerView: 5 }
            }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            className="w-full"
            style={SWIPER_STYLE}
          >
            {products.slice(0, 12).map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

function BlogSection() {
  const { blogs } = useShop();
  const recentBlogs = blogs.slice(0, 3);

  return (
    <div className="w-full py-16 md:py-20 border-t border-gray-200 bg-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest Blog Articles</h2>
            <p className="text-gray-600 text-lg">Stay updated with the latest electronics and IoT tutorials</p>
          </div>
          <Link
            to="/blog"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all whitespace-nowrap"
          >
            View All Articles
          </Link>
        </div>

        {recentBlogs.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            autoplay={{ delay: 6000, disableOnInteraction: true }}
            className="w-full"
            style={SWIPER_STYLE}
          >
            {recentBlogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <BlogCard blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog.slug}`} className="block group h-full">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={blog.cover}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&auto=format&fit=crop&q=80";
            }}
          />
          <span
            className="absolute top-3 left-3 text-xs font-bold text-white px-3 py-1 rounded-full"
            style={{ backgroundColor: blog.categoryColor }}
          >
            {blog.category}
          </span>
          <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-white bg-black/50 px-2.5 py-1 rounded-full">
            <Clock size={12} /> {blog.readTime}
          </span>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
            <Calendar size={14} />
            <span>{blog.date}</span>
          </div>

          <h3 className="text-base font-bold text-gray-900 line-clamp-2 transition mb-2" style={{ color: 'inherit' }}>
            {blog.title}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 mb-4 flex-grow">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center gap-2">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80";
                }}
              />
              <span className="text-xs font-medium text-gray-700 truncate">
                {blog.author.name}
              </span>
            </div>
            <span className="flex items-center gap-1 font-bold text-xs group-hover:gap-2 transition-all" style={{ color: THEME_COLOR }}>
              Read <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

