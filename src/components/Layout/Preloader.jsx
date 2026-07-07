import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1500);
    const removeTimer = setTimeout(() => setIsPreloading(false), 2000);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, []);

  if (!isPreloading) return null;

  return (
    <div className={`preloader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content flex justify-center items-center h-full">
        <img src="/preloader.png" alt="Swift Sign Electronics" className="preloader-image" />
      </div>
    </div>
  );
}
