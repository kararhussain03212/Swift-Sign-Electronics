import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

export default function ShippingList({ list = [] }) {
  if (list.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400 text-sm">No package details available.</p>;
  }

  return (
    <ul className="space-y-2.5">
      {list.map((item, index) => {
        // Support both string items and object items
        const itemName = typeof item === 'string' ? item : item.name;
        const itemCount = typeof item === 'string' ? null : item.count;

        return (
          <li key={index} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-blue-500 font-bold">•</span>
            <span className="leading-normal">
              {itemName} {itemCount && <strong className="text-slate-400 dark:text-slate-500 ml-1 font-semibold">(x{itemCount})</strong>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
