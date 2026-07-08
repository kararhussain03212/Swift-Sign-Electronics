import React, { useState } from 'react';
import { FiInfo, FiSliders, FiPackage, FiFileText } from 'react-icons/fi';
import SpecificationTable from './SpecificationTable';
import ShippingList from './ShippingList';

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
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none scroll-smooth">
        <div className="flex gap-2.5 sm:gap-6 min-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 py-4 px-3 sm:px-4 text-sm font-bold transition-colors cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 z-10"
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
                  <h3 className="text-xl font-bold text-slate-800">Overview</h3>
                  <p className="text-slate-650 text-sm md:text-base leading-relaxed">
                    {product.introduction?.overview || product.description}
                  </p>
                </div>

                {/* Purpose */}
                {product.introduction?.purpose && (
                  <div className="p-5 bg-blue-50/50 border border-blue-100/50 rounded-none">
                    <h4 className="font-bold text-blue-800 text-sm uppercase tracking-wider mb-2">
                      Product Purpose
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {product.introduction.purpose}
                    </p>
                  </div>
                )}

                {/* Features & Advantages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Key Features */}
                  {product.introduction?.features && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-slate-850">Key Features</h4>
                      <ul className="space-y-2.5">
                        {product.introduction.features.map((feature, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm text-slate-600">
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
                      <h4 className="text-lg font-bold text-slate-850">Advantages</h4>
                      <ul className="space-y-2.5">
                        {product.introduction.advantages.map((advantage, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm text-slate-600">
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
                    <h4 className="text-lg font-bold text-slate-850">Applications</h4>
                    <ul className="space-y-2.5">
                      {product.introduction.applications.map((app, idx) => (
                        <li key={idx} className="flex gap-2.5 text-sm text-slate-600">
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
                <h3 className="text-xl font-bold text-slate-800 mb-2">Technical Specifications</h3>
                <SpecificationTable specifications={product.specifications} />
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-6">What's in the Box</h3>
                <ShippingList list={product.shippingList} />
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Datasheets & Manuals</h3>
                <div className="grid grid-cols-1 gap-3.5">
                  {product.documents?.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <FiFileText className="text-blue-600 text-xl group-hover:scale-110 transition" />
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-blue-600 transition">{doc.name}</p>
                          {doc.size && <p className="text-xs text-slate-500">{doc.size}</p>}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ))}
                  {(!product.documents || product.documents.length === 0) && (
                    <p className="text-slate-500 text-sm">No documents listed.</p>
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
