import React, { useState } from 'react';
import { FiInfo, FiSliders, FiPackage, FiFileText } from 'react-icons/fi';
import SpecificationTable from './SpecificationTable';
import ShippingList from './ShippingList';
import DocumentCard from '../Home/DocumentCard';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('intro');

  const tabs = [
    { id: 'intro', label: 'Introduction', icon: <FiInfo /> },
    { id: 'specs', label: 'Specifications', icon: <FiSliders /> },
    { id: 'shipping', label: 'Shipping List', icon: <FiPackage /> },
    { id: 'docs', label: 'Documents', icon: <FiFileText /> },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none scroll-smooth">
        <div className="flex gap-2.5 sm:gap-6 min-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 py-4 px-3 sm:px-4 text-sm font-bold transition-colors cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250'
                }`}
              >
                {tab.icon}
                {tab.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 z-10"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="min-h-72">
        <>
          <div
            key={activeTab}
          >
            {activeTab === 'intro' && (
              <div className="space-y-8">
                {/* Overview */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Overview</h3>
                  <p className="text-slate-650 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                    {product.introduction?.overview || product.description}
                  </p>
                </div>

                {/* Purpose */}
                {product.introduction?.purpose && (
                  <div className="p-5 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/10 rounded-none">
                    <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm uppercase tracking-wider mb-2">
                      Product Purpose
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {product.introduction.purpose}
                    </p>
                  </div>
                )}

                {/* Features & Advantages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Key Features */}
                  {product.introduction?.features && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-slate-850 dark:text-slate-200">Key Features</h4>
                      <ul className="space-y-2.5">
                        {product.introduction.features.map((feature, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-450">
                            <span className="text-blue-500 font-bold">•</span>
                            <span className="leading-normal">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advantages */}
                  {product.introduction?.advantages && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-slate-850 dark:text-slate-200">Advantages</h4>
                      <ul className="space-y-2.5">
                        {product.introduction.advantages.map((advantage, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-455">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span className="leading-normal">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Applications */}
                {product.introduction?.applications && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-850 dark:text-slate-200">Applications</h4>
                    <ul className="space-y-2.5">
                      {product.introduction.applications.map((app, idx) => (
                        <li key={idx} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-450">
                          <span className="text-blue-500 font-bold">•</span>
                          <span className="leading-normal">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Technical Specifications</h3>
                <SpecificationTable specifications={product.specifications} />
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">What's in the Box</h3>
                <ShippingList list={product.shippingList} />
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Datasheets & Manuals</h3>
                <div className="grid grid-cols-1 gap-3.5">
                  {product.documents?.map((doc, idx) => (
                    <DocumentCard key={idx} document={doc} />
                  ))}
                  {(!product.documents || product.documents.length === 0) && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No documents listed.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
}
