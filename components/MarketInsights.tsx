import React, { useState, useEffect } from 'react';
import { fetchMarketTrends, generateTrendImage } from '../services/geminiService';
import { Loader2, TrendingUp, ExternalLink, Sparkles, Tag } from 'lucide-react';
import { TrendItem } from '../types';

const MarketInsights: React.FC = () => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [images, setImages] = useState<{[key: string]: string}>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    setTrends([]);
    setImages({});
    
    const data = await fetchMarketTrends();
    
    if (data.trends && data.trends.length > 0) {
      setTrends(data.trends);
      setSources(data.chunks);
      
      // Trigger image generation for each trend individually
      data.trends.forEach(async (trend: TrendItem) => {
        const img = await generateTrendImage(`${trend.title} - ${trend.description}`);
        if (img) {
          setImages(prev => ({...prev, [trend.title]: img}));
        }
      });
    } else {
      // Fallback if parsing fails
      setTrends([{ title: "General Market Data", description: data.text, priceRange: "N/A" }]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-amber-600" />
            2025 Trend Forecast
          </h2>
          <p className="text-stone-500 text-sm mt-1">Real-time market analysis powered by Google Search & AI Vision.</p>
        </div>
        <button 
          onClick={loadData} 
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? 'Scanning Market...' : 'Refresh Trends'}
        </button>
      </div>

      {loading && trends.length === 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl h-96 border border-stone-100 shadow-sm p-4 space-y-4">
              <div className="bg-stone-200 h-48 rounded-xl w-full"></div>
              <div className="h-6 bg-stone-200 rounded w-3/4"></div>
              <div className="h-4 bg-stone-200 rounded w-full"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trends.map((trend, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="relative h-56 bg-stone-100 overflow-hidden">
                {images[trend.title] ? (
                  <img 
                    src={images[trend.title]} 
                    alt={trend.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-50">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-800 shadow-sm">
                  #{idx + 1} Trending
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">
                    {trend.title}
                  </h3>
                </div>
                
                <p className="text-sm text-stone-600 mb-4 line-clamp-3 flex-grow">
                  {trend.description}
                </p>
                
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                    <Tag className="h-3 w-3" />
                    {trend.priceRange || "Price Varies"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-stone-200">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Data Sources</h3>
          <div className="flex flex-wrap gap-2">
            {sources.map((chunk, idx) => {
              if (chunk.web?.uri) {
                return (
                  <a 
                    key={idx} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm hover:shadow border border-stone-200 text-xs text-stone-600 transition-all"
                  >
                    <ExternalLink className="h-3 w-3 text-amber-500" />
                    {chunk.web.title || "Source"}
                  </a>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketInsights;