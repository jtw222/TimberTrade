
import React, { useState, useEffect } from 'react';
import { fetchMarketTrends, getTrendImage, FALLBACK_TRENDS } from '../services/geminiService';
import { Loader2, TrendingUp, ExternalLink, Sparkles, Tag, Camera, Lock, BarChart3 } from 'lucide-react';
import { TrendItem, SavedItem } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketInsightsProps {
  onSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  isPro: boolean;
  onTriggerSubscribe: () => void;
}

const MARKET_DATA = [
  { year: '2021', value: 718, label: 'Historical' },
  { year: '2022', value: 752, label: 'Historical' },
  { year: '2023', value: 790, label: 'Historical' },
  { year: '2024', value: 835, label: 'Current' },
  { year: '2025', value: 890, label: 'Forecast' },
  { year: '2026', value: 955, label: 'Forecast' },
  { year: '2027', value: 1025, label: 'Forecast' },
];

const MarketInsights: React.FC<MarketInsightsProps> = ({ onSave, isPro, onTriggerSubscribe }) => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [images, setImages] = useState<{[key: string]: string}>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [usingLive, setUsingLive] = useState<boolean>(false);

  // Initial load logic
  useEffect(() => {
    const loadData = async () => {
      // Check if we have cached live data first (implicit via service)
      const data = await fetchMarketTrends(false);
      
      if (data.trends && data.trends.length > 0) {
        setTrends(data.trends);
        setSources(data.chunks || []);
        
        // Auto-load visuals using the smart mapper (No API cost)
        const newImages: {[key: string]: string} = {};
        for (const trend of data.trends) {
           const img = await getTrendImage(trend.title + " " + trend.description);
           newImages[trend.title] = img;
        }
        setImages(newImages);
        
        // If the returned data matches fallback exactly, we aren't "live"
        const isFallback = JSON.stringify(data.trends) === JSON.stringify(FALLBACK_TRENDS);
        setUsingLive(!isFallback);
      }
    };
    loadData();
  }, []);

  const handleScanMarket = async () => {
    if (!isPro) {
        onTriggerSubscribe();
        return;
    }

    setLoading(true);
    setUsingLive(true);
    
    // Force refresh true to hit API
    const data = await fetchMarketTrends(true);
    
    if (data.trends && data.trends.length > 0) {
      setTrends(data.trends);
      setSources(data.chunks || []);
      
      // Instantly map images without hitting API limits
      const newImages: {[key: string]: string} = {};
      for (const trend of data.trends) {
          const img = await getTrendImage(trend.title + " " + trend.description);
          newImages[trend.title] = img;
      }
      setImages(newImages);
    }
    setLoading(false);
  };

  const handleCapture = (trend: TrendItem) => {
    onSave({
      type: 'TREND',
      title: trend.title,
      content: trend.description,
      image: images[trend.title],
      tags: trend.priceRange ? [trend.priceRange] : []
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-amber-600" />
            Market Intelligence
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {usingLive ? "Showing AI market analysis (Live Data)." : "Showing evergreen market staples."}
          </p>
        </div>
        <button 
          onClick={handleScanMarket} 
          disabled={loading}
          className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all shadow-md disabled:opacity-50 flex items-center gap-2 whitespace-nowrap ${
            isPro 
              ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPro ? (
            <Sparkles className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {loading ? 'Scanning Trends...' : 'Refresh Market Data'}
        </button>
      </div>

      {/* MARKET GROWTH CHART */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-stone-500" />
              Global Artisan Market Size
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Historical growth and future valuation (Billions USD).
            </p>
          </div>
          <div className="flex gap-3 text-xs font-medium">
             <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               <span className="text-stone-600 dark:text-stone-300">Historical</span>
             </div>
             <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-amber-300/50 border border-amber-500 border-dashed"></span>
               <span className="text-stone-600 dark:text-stone-300">Projected</span>
             </div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MARKET_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-stone-800" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#78716c', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#78716c', fontSize: 12}} 
                tickFormatter={(value) => `$${value}B`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value} Billion`, 'Market Size']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#d97706" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl h-96 border border-stone-100 dark:border-stone-800 shadow-sm p-4 space-y-4">
              <div className="bg-stone-200 dark:bg-stone-800 h-48 rounded-xl w-full"></div>
              <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trends.map((trend, idx) => {
            const hasImage = !!images[trend.title];
            
            return (
              <div key={idx} className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col relative">
                <div className="relative h-56 bg-stone-100 dark:bg-stone-800 overflow-hidden group/image">
                  {hasImage ? (
                    <img 
                      src={images[trend.title]} 
                      alt={trend.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-800 dark:to-stone-900 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-800 shadow-sm z-10">
                    #{idx + 1} Trending
                  </div>
                  
                  {/* Capture Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCapture(trend);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-700 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                    title="Capture to Gallery"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                      {trend.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-3 flex-grow">
                    {trend.description}
                  </p>
                  
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md">
                      <Tag className="h-3 w-3" />
                      {trend.priceRange || "Price Varies"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-stone-900 rounded-full shadow-sm hover:shadow border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 transition-all"
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
