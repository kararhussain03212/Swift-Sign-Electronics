import React, { useState } from 'react';
import { FiFileText, FiDownload, FiEye, FiCheck } from 'react-icons/fi';

export default function DocumentCard({ document }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Simulated download: Starting download for ${document.title} (${document.size}).`);
    }, 1500);
  };

  const handlePreview = () => {
    setIsPreviewing(true);
    setTimeout(() => {
      setIsPreviewing(false);
      alert(`Simulated preview: Opening inline PDF reader for ${document.title}.`);
    }, 1000);
  };

  // Determine file badge style based on document.type
  const getBadgeStyle = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'bg-red-55/80 dark:bg-red-950/20 text-red-500 border border-red-200/50 dark:border-red-900/30';
      case 'ZIP':
      case 'RAR':
        return 'bg-orange-55/80 dark:bg-orange-950/20 text-orange-500 border border-orange-200/50 dark:border-orange-900/30';
      case 'TXT':
      case 'DOC':
      case 'DOCX':
        return 'bg-blue-55/80 dark:bg-blue-950/20 text-blue-500 border border-blue-200/50 dark:border-blue-900/30';
      default:
        return 'bg-slate-105/85 dark:bg-slate-800 text-slate-500';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-400/20 transition-all duration-300">
      {/* File Info */}
      <div className="flex items-start gap-3.5">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 text-blue-600 dark:text-blue-400 rounded-xl">
          <FiFileText className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-250 text-sm md:text-base">
            {document.title}
          </h4>
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${getBadgeStyle(document.type)}`}>
              {document.type}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              Size: {document.size}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Preview Button */}
        <button
          onClick={handlePreview}
          disabled={isPreviewing}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <FiEye /> {isPreviewing ? 'Loading...' : 'Preview'}
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-80"
        >
          {isDownloading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Downloading
            </>
          ) : (
            <>
              <FiDownload /> Download
            </>
          )}
        </button>
      </div>
    </div>
  );
}
