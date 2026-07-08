import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { DUMMY_ELECTRONICS } from '../data/dummyElectronics';
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

// Hero Slider Data
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Premium Electronics',
    subtitle: 'Explore our curated collection of quality components',
    image: '/hero1.png',
    bgColor: 'from-blue-600 to-blue-800',
    cta: 'Shop Now'
  },
  {
    id: 2,
    title: 'Latest Development Boards',
    subtitle: 'Powerful boards for your next project',
    image: '/hero2.png',
    bgColor: 'from-purple-600 to-purple-800',
    cta: 'Explore'
  },
  {
    id: 3,
    title: 'Expert Tools & Accessories',
    subtitle: 'Everything you need for electronics projects',
    image: '/hero3.png',
    bgColor: 'from-teal-600 to-teal-800',
    cta: 'View Collection'
  }
];

export default function Home({ onTabChange }) {
  return (
    <div className="w-full bg-gray-50">
      {/* 1. HERO SLIDER SECTION */}
      <HeroSliderSection />

      {/* 2. FEATURED CATEGORIES SECTION */}
      <FeaturedCategoriesSection />

      {/* 3. DISCOVER SECTION WITH BANNER & SLIDER */}
      <SectionWithBanner
        title="Discover"
        subtitle="Browse our collection"
        bannerColor="from-blue-600 to-blue-800"
        bannerImage="/hero1.png"
        bannerTitle="New in Discover"
        bannerSubtitle="Latest electronics products"
      />

      {/* 4. NEW ARRIVALS SECTION */}
      <SectionWithBanner
        title="New Arrivals"
        subtitle="Recently added products"
        bannerColor="from-purple-600 to-purple-800"
        bannerImage="/hero2.png"
        bannerTitle="Fresh Stock"
        bannerSubtitle="Discover what's new"
      />

      {/* 5. FEATURED SECTION */}
      <SectionWithBanner
        title="Featured"
        subtitle="Handpicked products"
        bannerColor="from-green-600 to-green-800"
        bannerImage="/hero3.png"
        bannerTitle="Best Sellers"
        bannerSubtitle="Most popular items"
      />

      {/* 6. MICROCONTROLLER SECTION */}
      <SectionWithBanner
        title="Microcontrollers"
        subtitle="Arduino, ESP32, and more"
        bannerColor="from-indigo-600 to-indigo-800"
        bannerImage="/hero1.png"
        bannerTitle="Arduino Boards"
        bannerSubtitle="Open-source electronics"
      />

      {/* 7. DEVELOPMENT BOARDS SECTION */}
      <SectionWithBanner
        title="Development Boards"
        subtitle="Single board computers"
        bannerColor="from-red-600 to-red-800"
        bannerImage="/hero2.png"
        bannerTitle="Single Board Computer"
        bannerSubtitle="Powerful computing solutions"
      />

      {/* 8. SENSORS & MODULES SECTION */}
      <SectionWithBanner
        title="Sensors & Modules"
        subtitle="IoT components"
        bannerColor="from-yellow-600 to-yellow-800"
        bannerImage="/hero3.png"
        bannerTitle="Smart Sensors"
        bannerSubtitle="IoT technology"
      />

      {/* 9. ACCESSORIES SECTION */}
      <PromotionalBanner
        title="Premium Accessories"
        subtitle="Complete your project with quality accessories and components"
        bgColor="from-pink-600 to-pink-800"
        ctaText="Shop Accessories"
      />

      {/* 10. BESTSELLERS SECTION */}
      <ProductShowcaseSection
        title="Bestsellers"
        subtitle="Most purchased products"
      />
    </div>
  );
}

function HeroSliderSection() {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full"
        style={{
          "--swiper-pagination-color": "#0fafb8",
          "--swiper-navigation-color": "#0fafb8",
          "--swiper-navigation-size": "28px"
        }}
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className={`relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-cover bg-center`}
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
                  <button className="bg-white text-gray-900 hover:bg-gray-100 font-extrabold px-8 py-3 rounded-lg transition shadow-lg cursor-pointer">
                    {slide.cta}
                  </button>
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
    <div className="w-full border-b border-gray-200 bg-white my-12 md:my-16">
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
                    ? 'border-[#0fafb8] text-[#0fafb8]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon className="text-[26px]" />
                <span className="text-[12px] font-bold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

function ProductShowcaseSection({ title, subtitle }) {
  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-t border-gray-200">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 }
        }}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
        style={{
          "--swiper-navigation-color": "#0fafb8",
          "--swiper-pagination-color": "#0fafb8"
        }}
      >
        {DUMMY_ELECTRONICS.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group h-full flex flex-col">
              {/* Product Image */}
              <div className="aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[70%] h-[70%] object-contain group-hover:scale-110 transition"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute top-3 right-3 bg-[#ff6b00] text-white px-3 py-1 rounded-full text-xs font-bold">
                  New
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#0fafb8] transition mb-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4">{product.category}</p>

                <div className="flex items-center gap-1 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">(42)</span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-[#ff6b00]">{product.price}</span>
                  <button className="bg-[#0fafb8] hover:bg-[#0a8d95] text-white px-4 py-2 rounded-lg text-xs font-bold transition">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SectionWithBanner({ title, subtitle, bannerColor, bannerImage, bannerTitle, bannerSubtitle }) {
  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="mb-8 flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <button className="text-[#0fafb8] font-bold text-sm hover:underline flex items-center gap-1">
          View All
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="w-full">
        {/* Products Slider */}
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 }
            }}
            navigation
            pagination={{ clickable: true }}
            className="w-full"
            style={{
              "--swiper-navigation-color": "#0fafb8",
              "--swiper-pagination-color": "#0fafb8"
            }}
          >
            {DUMMY_ELECTRONICS.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition group h-full flex flex-col">
                  {/* Product Image */}
                  <div className="aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[70%] h-[70%] object-contain group-hover:scale-110 transition"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-[#ff6b00] text-white px-2 py-1 rounded text-xs font-bold">
                      Sale
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#0fafb8] transition mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">(12)</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-bold text-[#ff6b00]">{product.price}</span>
                      <button className="bg-[#0fafb8] hover:bg-[#0a8d95] text-white px-3 py-1.5 rounded text-xs font-bold transition">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

function PromotionalBanner({ title, subtitle, bgColor, ctaText }) {
  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={`bg-gradient-to-r ${bgColor} rounded-xl overflow-hidden shadow-xl`}>
        <div className="grid md:grid-cols-2 items-center">
          {/* Text Content */}
          <div className="p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {title}
            </h3>
            <p className="text-lg text-gray-100 mb-8 max-w-sm">
              {subtitle}
            </p>
            <button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition">
              {ctaText}
            </button>
          </div>

          {/* Image */}
          <div className="hidden md:flex h-[300px] bg-white/10 items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=500&auto=format&fit=crop&q=80"
              alt={title}
              className="h-[250px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}