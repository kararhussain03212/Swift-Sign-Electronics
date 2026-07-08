import React from 'react';
import { products } from '../../data/products';
import ProductCard from './ProductCard';

export default function RelatedProducts({ relatedIds = [], currentProductId, onQuickView }) {
  // Find related products by ID, excluding the current product
  const relatedList = products.filter(
    (prod) => relatedIds.includes(prod.id) && prod.id !== currentProductId
  );

  // If no specific related IDs are provided, find products in the same category
  const fallbackList = relatedList.length > 0 
    ? relatedList 
    : products
        .filter((prod) => prod.id !== currentProductId)
        .slice(0, 3);

  if (fallbackList.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800">
          Related Products
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fallbackList.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="grid"
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
}
