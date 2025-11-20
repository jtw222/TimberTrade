
import React, { useState } from 'react';
import { SavedItem } from '../types';
import { Trash2, Calendar, Tag, Image as ImageIcon, FileText, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GalleryProps {
  items: SavedItem[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onDelete }) => {
  const [filter, setFilter] = useState<'ALL' | 'TREND' | 'PLAN'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    filter === 'ALL' ? true : item.type === filter
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Design Gallery</h2>
          <p className="text-stone-500 dark:text-stone-400">Your curated collection of captured trends and saved blueprints.</p>
        </div>

        <div className="flex bg-stone-200 dark:bg-stone-800 p-1 rounded-lg">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'ALL' ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-white shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('TREND')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'TREND' ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-white shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setFilter('PLAN')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'PLAN' ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-white shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Blueprints
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-stone-50 dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-stone-800 shadow-sm mb-4">
            <ImageIcon className="h-8 w-8 text-stone-300 dark:text-stone-600" />
          </div>
          <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300">Gallery is Empty</h3>
          <p className="text-stone-500 dark:text-stone-500 max-w-md mx-auto mt-2">
            Go to Market Trends or Plans & Templates and click the "Capture" button to save items here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col group hover:shadow-md transition-all">
              {/* Image Header */}
              <div className="relative h-48 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                    <FileText className="h-12 w-12 opacity-20" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm border ${
                    item.type === 'TREND' 
                      ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-800' 
                      : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-800'
                  }`}>
                    {item.type === 'TREND' ? 'Trend Forecast' : 'Workshop Plan'}
                  </span>
                </div>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-stone-800/90 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Delete Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-stone-900 dark:text-white text-lg line-clamp-1" title={item.title}>
                    {item.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500 mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>Captured on {item.date}</span>
                </div>

                <div className={`text-sm text-stone-600 dark:text-stone-400 flex-grow ${expandedId === item.id ? '' : 'line-clamp-3'}`}>
                  {item.type === 'PLAN' ? (
                    <div className="prose prose-sm prose-stone dark:prose-invert max-h-60 overflow-hidden relative">
                      <ReactMarkdown>{item.content}</ReactMarkdown>
                      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white dark:from-stone-900 to-transparent pointer-events-none"></div>
                    </div>
                  ) : (
                    <p>{item.content}</p>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.type === 'PLAN' && (
                  <button 
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="mt-4 w-full py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    {expandedId === item.id ? 'Collapse Plan' : 'View Full Details'}
                  </button>
                )}
              </div>
              
              {/* Expanded View for Plans */}
              {expandedId === item.id && item.type === 'PLAN' && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                   <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
                     <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center sticky top-0 bg-white dark:bg-stone-900 z-10">
                       <h2 className="text-xl font-bold text-stone-900 dark:text-white">{item.title}</h2>
                       <button 
                         onClick={() => setExpandedId(null)}
                         className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-500"
                       >
                         Close
                       </button>
                     </div>
                     <div className="p-8">
                       {item.image && (
                         <img src={item.image} alt="Blueprint" className="w-full rounded-xl border border-stone-200 dark:border-stone-700 mb-8" />
                       )}
                       <div className="prose prose-stone prose-amber dark:prose-invert max-w-none">
                         <ReactMarkdown>{item.content}</ReactMarkdown>
                       </div>
                     </div>
                   </div>
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
