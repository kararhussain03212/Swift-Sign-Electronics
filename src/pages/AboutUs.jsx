import React, { useEffect, useState } from 'react';
import { FiTarget, FiAward, FiUsers, FiStar, FiCheckCircle, FiActivity, FiCpu, FiGlobe } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  fetchAboutPage,
  fetchAboutValueCards,
  fetchAboutTeamMembers,
  fetchAboutAccoladeCards,
  fetchAboutTestimonials,
  resolveUploadUrl,
} from '../api/shopApi';

const ICONS = {
  FiTarget, FiAward, FiUsers, FiStar, FiCheckCircle, FiActivity, FiCpu, FiGlobe,
};

const renderIcon = (key, className) => {
  const Icon = ICONS[key];
  return Icon ? <Icon className={className} /> : null;
};

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(null);
  const [valueCards, setValueCards] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [accoladeCards, setAccoladeCards] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchAboutPage(),
      fetchAboutValueCards(),
      fetchAboutTeamMembers(),
      fetchAboutAccoladeCards(),
      fetchAboutTestimonials(),
    ]).then(([page, cards, members, accolades, quotes]) => {
      if (cancelled) return;
      setContent(page);
      setValueCards(cards);
      setTeamMembers(members);
      setAccoladeCards(accolades);
      setTestimonials(quotes);
    }).catch((err) => {
      console.error('[AboutUs] failed to load page content:', err);
    });

    return () => { cancelled = true; };
  }, []);

  if (!content) {
    return <div className="min-h-screen bg-[#f8fafc]" />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden selection:bg-[#0fafb8] selection:text-white">

      {/* 1. Ultra-Premium Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[75vh] lg:min-h-[85vh] flex items-center justify-center pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#0fafb8]/20 to-blue-600/10 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow transform translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-900/10 to-[#0fafb8]/20 rounded-full blur-[100px] mix-blend-multiply opacity-60 transform -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {/* Right side floating abstract composition - Mobile First */}
          <div className="w-full md:w-3/4 lg:w-5/12 relative mb-4 lg:mb-0 order-first lg:order-last mx-auto md:mx-0">
             <div className="relative w-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl transform lg:rotate-3 lg:hover:rotate-0 transition-transform duration-700 ease-out group">
               <img
                 src={content.hero_image ? resolveUploadUrl(content.hero_image) : ''}
                 alt="Technology Innovation"
                 className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                 onError={(e) => { e.target.style.display = 'none'; }}
               />
             </div>
          </div>

          <div className="lg:w-7/12 text-center lg:text-left w-full order-last lg:order-first">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8 hover:shadow-md transition-shadow">
                <span className="w-2 h-2 rounded-full bg-[#0fafb8] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#0fafb8] absolute" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 ml-1">{content.hero_badge}</span>
             </div>
             <h1 className="text-4xl md:text-6xl lg:text-[80px] font-bold text-gray-900 leading-[1.05] mb-6 md:mb-8 tracking-tighter">
                {content.hero_heading} <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0fafb8] to-blue-700">{content.hero_heading_highlight}</span>
             </h1>
             <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 font-light">
                {content.hero_description}
             </p>
          </div>
        </div>
      </section>

      {/* 2. Who We Are - The "Bento Box" Grid Layout */}
      <section className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 md:mb-16">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3 md:mb-4">{content.anatomy_heading}</h2>
           <p className="text-base sm:text-lg md:text-xl text-gray-500 font-light max-w-2xl">{content.anatomy_subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
           {valueCards.map((card) => {
             if (card.style_variant === 'image') {
               return (
                 <div key={card.id} className="md:col-span-2 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden h-48 sm:h-64 md:h-80 lg:min-h-[350px] relative group bg-gray-900">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                    <img
                      src={card.image ? resolveUploadUrl(card.image) : ''}
                      alt={card.title || "Engineering Lab"}
                      className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                 </div>
               );
             }

             if (card.style_variant === 'dark') {
               return (
                 <div key={card.id} className="bg-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {renderIcon(card.icon, 'text-3xl md:text-4xl text-blue-400 mb-4 md:mb-6')}
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">{card.title}</h3>
                    <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">{card.description}</p>
                 </div>
               );
             }

             if (card.style_variant === 'gradient') {
               return (
                 <div key={card.id} className="bg-gradient-to-br from-[#0fafb8] to-blue-600 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                    {renderIcon(card.icon, 'text-3xl md:text-4xl text-white mb-4 md:mb-6')}
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">{card.title}</h3>
                    <p className="text-sm md:text-base text-blue-100 font-light leading-relaxed">{card.description}</p>
                 </div>
               );
             }

             return (
               <div key={card.id} className="md:col-span-2 bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-14 shadow-sm border border-gray-100 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-bl from-[#0fafb8]/10 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
                  {renderIcon(card.icon, 'text-4xl md:text-5xl text-[#0fafb8] mb-4 md:mb-8')}
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 tracking-tight">{card.title}</h3>
                  <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl font-light">{card.description}</p>
               </div>
             );
           })}
        </div>
      </section>

      {/* 3. CEO Message - Ultra Premium Card */}
      <section className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-2xl md:rounded-3xl bg-[#0a0f1c] overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" alt="Background Texture"/>
             <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c] via-[#0a0f1c]/90 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-stretch min-h-[350px] md:min-h-[450px] lg:min-h-[500px]">
            {/* Content side */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
              <div className="inline-flex items-center gap-3 mb-6 md:mb-8 lg:mb-10">
                 <div className="h-[1px] w-8 md:w-12 bg-[#0fafb8]" />
                 <span className="text-[#0fafb8] text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">{content.ceo_eyebrow}</span>
              </div>
              <blockquote className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-6 md:mb-8 lg:mb-10 tracking-tight">
                <span className="text-[#0fafb8] text-3xl md:text-4xl lg:text-5xl font-sans leading-none mr-1 md:mr-2 -ml-1 md:-ml-2">"</span>
                {content.ceo_quote}
              </blockquote>

              <div className="flex items-center gap-4 md:gap-6 mt-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-[#0fafb8] to-blue-600 p-[2px] flex-shrink-0">
                   <img src={content.ceo_photo ? resolveUploadUrl(content.ceo_photo) : ''} alt={content.ceo_name} className="w-full h-full rounded-full object-cover border-2 border-[#0a0f1c]" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-base md:text-lg lg:text-xl tracking-tight truncate">{content.ceo_name}</h4>
                  <p className="text-gray-400 text-xs md:text-sm font-medium mt-0.5 md:mt-1 truncate">{content.ceo_title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership - Asymmetric Hover Cards */}
      <section className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 md:mb-16 lg:mb-20">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 md:mb-6">{content.team_heading}</h2>
           <p className="text-base sm:text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto">{content.team_subheading}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10 w-full">
            {teamMembers.map((member, idx) => {
              const isEven = idx % 2 === 0;
              const nameColor = isEven ? 'text-[#0fafb8]' : 'text-blue-400';

              return (
                <div key={member.id} className="group relative text-center">
                   {/* Profile Image Card */}
                   <div className="relative w-72 sm:w-80 md:w-96 lg:w-[28rem] h-72 sm:h-80 md:h-96 lg:h-[28rem] rounded-3xl md:rounded-4xl overflow-hidden shadow-lg md:shadow-xl transition-all duration-500 transform group-hover:-translate-y-3 mb-4">
                      <img
                        src={member.photo ? resolveUploadUrl(member.photo) : ''}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                   </div>

                   {/* Name and Role */}
                   <div className="text-center">
                     <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 line-clamp-2">{member.name}</h3>
                     <p className={`${nameColor} font-bold uppercase tracking-widest text-xs sm:text-sm`}>{member.role}</p>
                   </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 5. Awards & Certifications - Premium Bento Layout */}
      {/* <section className="py-32 px-6 bg-[#040914] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#0fafb8]/10 rounded-full blur-[120px] animate-pulse-slow" />
           <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.15]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 border-b border-white/10 pb-8">
             <div className="max-w-2xl">
                <div className="inline-flex items-center gap-3 mb-6">
                   <span className="w-8 h-[1px] bg-[#0fafb8]"></span>
                   <span className="text-[#0fafb8] uppercase tracking-[0.2em] font-bold text-xs">{content.accolades_eyebrow}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter leading-tight">
                  {content.accolades_heading} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0fafb8] to-blue-500">{content.accolades_heading_highlight}</span>
                </h2>
             </div>
             <p className="text-lg text-gray-400 font-light max-w-md pb-2">
                {content.accolades_description}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {accoladeCards.map((card) => {
               if (card.size_variant === 'featured') {
                 return (
                   <div key={card.id} className="md:col-span-2 relative group rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0fafb8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="h-full bg-[#0a0f1c] rounded-[1.4rem] p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-[#0fafb8]/20 transition-colors duration-700" />

                         <div className="relative z-10">
                           <div className="flex justify-between items-start mb-16">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#0fafb8] to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-[0_0_30px_rgba(15,175,184,0.3)]">
                                {renderIcon(card.icon)}
                              </div>
                              <span className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-wider">{card.badge_text}</span>
                           </div>
                           <h3 className="text-3xl font-semibold text-white mb-4 tracking-tight">{card.title}</h3>
                           <p className="text-gray-400 font-light text-lg max-w-xl leading-relaxed">{card.description}</p>
                         </div>
                      </div>
                   </div>
                 );
               }

               if (card.size_variant === 'wide') {
                 return (
                   <div key={card.id} className="md:col-span-2 relative group rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-1">
                      <div className="h-full bg-gradient-to-r from-[#0a0f1c] to-[#041027] rounded-[1.4rem] p-8 lg:px-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                         <div className="w-16 h-16 shrink-0 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl">
                           {renderIcon(card.icon)}
                         </div>
                         <div>
                           <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-2xl text-white">{card.title}</h4>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">{card.badge_text}</span>
                           </div>
                           <p className="text-gray-400 font-light text-sm leading-relaxed max-w-2xl">{card.description}</p>
                         </div>
                      </div>
                   </div>
                 );
               }

               return (
                 <div key={card.id} className="relative group rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-1">
                    <div className="h-full bg-[#0a0f1c] rounded-[1.4rem] p-8 relative overflow-hidden flex flex-col">
                       <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#0fafb8] text-xl mb-auto">
                         {renderIcon(card.icon)}
                       </div>
                       <div className="mt-16">
                         <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">{card.badge_text}</div>
                         <h4 className="font-semibold text-2xl text-white mb-3">{card.title}</h4>
                         <p className="text-gray-500 font-light text-sm leading-relaxed">{card.description}</p>
                       </div>
                    </div>
                 </div>
               );
             })}

          </div>
        </div>
      </section>  */}

      {/* 6. Testimonials - Editorial Layout */}
      <section className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start lg:items-center">
           <div className="lg:w-1/3 w-full">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 md:mb-6 leading-tight">{content.testimonials_heading}</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 font-light mb-6 md:mb-8 lg:mb-10">
                {content.testimonials_subheading}
              </p>
              <div className="flex gap-2 md:gap-4">
                 <button className="testi-prev w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all text-gray-400 flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                 </button>
                 <button className="testi-next w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all text-gray-400 flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                 </button>
              </div>
           </div>

           <div className="lg:w-2/3 w-full">
              <Swiper
                 modules={[Navigation, Autoplay]}
                 spaceBetween={20}
                 slidesPerView={1}
                 autoplay={{ delay: 5000, disableOnInteraction: false }}
                 loop={testimonials.length > 1}
                 navigation={{
                   prevEl: '.testi-prev',
                   nextEl: '.testi-next',
                 }}
                 className="w-full relative"
              >
                 {testimonials.map((testimonial) => (
                   <SwiperSlide key={testimonial.id} className="pb-2 md:pb-4">
                      <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-14 xl:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative h-full">
                         <div className="absolute -top-4 md:-top-6 -right-4 md:-right-6 text-6xl md:text-9xl text-gray-100 font-sans leading-none select-none z-0">"</div>
                         <div className="relative z-10">
                            <div className="flex gap-1 text-[#0fafb8] mb-4 md:mb-6 lg:mb-8">
                              {Array.from({ length: testimonial.rating }).map((_, i) => <FiStar key={i} className="fill-current text-base md:text-lg lg:text-xl" />)}
                            </div>
                            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-800 font-medium leading-relaxed tracking-tight mb-6 md:mb-8 lg:mb-10 min-h-[100px] md:min-h-[140px] lg:min-h-[160px]">
                              {testimonial.quote}
                            </p>
                            <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                              <img src={testimonial.avatar ? resolveUploadUrl(testimonial.avatar) : ''} alt={testimonial.name} className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full object-cover shadow-md flex-shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                              <div className="min-w-0">
                                <h5 className="font-semibold text-base md:text-lg lg:text-xl text-gray-900 truncate">{testimonial.name}</h5>
                                <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase mt-0.5 md:mt-1 truncate">{testimonial.title}</p>
                              </div>
                            </div>
                         </div>
                      </div>
                   </SwiperSlide>
                 ))}
              </Swiper>
           </div>
        </div>
      </section>

    </div>
  );
}
