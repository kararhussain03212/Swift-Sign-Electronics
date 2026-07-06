import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function Rating({ value, reviewsCount, showText = true }) {
  const stars = [];
  const roundedRating = Math.round(value * 2) / 2; // round to nearest 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      stars.push(<FaStar key={i} className="text-amber-500 fill-current" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-500 fill-current" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-slate-300 dark:text-slate-600 fill-current" />);
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex items-center text-amber-500">
        {stars}
      </div>
      {showText && (
        <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {value.toFixed(1)}
          {reviewsCount !== undefined && (
            <span className="font-normal text-slate-400 dark:text-slate-500 text-xs ml-1.5">
              ({reviewsCount} reviews)
            </span>
          )}
        </span>
      )}
    </div>
  );
}
