import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DEFAULT_SITE_SETTINGS } from '../../data/siteContent';

export default function Banner() {
  const { siteSettings } = useShop();
  const messages = siteSettings?.topbar_messages?.length
    ? siteSettings.topbar_messages
    : DEFAULT_SITE_SETTINGS.topbar_messages;

  return (
    <>
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .banner-scroll {
          display: flex;
          width: max-content;
          animation: scrollLeft 40s linear infinite;
        }

        .banner-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="bg-[#0f172a] text-white text-xs md:text-sm font-semibold py-2 w-full overflow-hidden flex whitespace-nowrap">
        <div className="banner-scroll">
          <div className="flex items-center gap-6 md:gap-12 pr-6 md:pr-12">
            {messages.map((msg, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="hidden md:inline">•</span>}
                <span>{msg.text}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
