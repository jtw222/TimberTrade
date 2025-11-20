
import React, { useState } from 'react';
import { Palette, RefreshCcw, Info, Check } from 'lucide-react';

const stains = [
  { name: 'Natural / Clear', color: '#f5f5f0', opacity: 0.1, hex: '#f2f2eb' },
  { name: 'Golden Oak', color: '#d4a017', opacity: 0.5, hex: '#e0ac26' },
  { name: 'Early American', color: '#8d6e63', opacity: 0.6, hex: '#8d6e63' },
  { name: 'Dark Walnut', color: '#4e342e', opacity: 0.8, hex: '#3e2723' },
  { name: 'Red Mahogany', color: '#5d1010', opacity: 0.7, hex: '#7f1515' },
  { name: 'Weathered Gray', color: '#78909c', opacity: 0.6, hex: '#90a4ae' },
  { name: 'Ebony', color: '#212121', opacity: 0.85, hex: '#000000' },
  { name: 'Whitewash', color: '#ffffff', opacity: 0.5, hex: '#ffffff' },
];

const StainVisualizer: React.FC = () => {
  const [selectedStain, setSelectedStain] = useState(stains[0]);
  const [isMatte, setIsMatte] = useState(false);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Controls Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Palette className="h-6 w-6 text-amber-700 dark:text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Stain Lab</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Visualize finishes before you buy.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Select Stain</label>
              <div className="grid grid-cols-2 gap-3">
                {stains.map((stain) => (
                  <button
                    key={stain.name}
                    onClick={() => setSelectedStain(stain)}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all group ${
                      selectedStain.name === stain.name
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-600'
                        : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700 bg-white dark:bg-stone-800'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-inner border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: stain.hex }}
                    ></div>
                    <span className={`text-sm font-medium ${
                      selectedStain.name === stain.name ? 'text-amber-900 dark:text-amber-400' : 'text-stone-600 dark:text-stone-300'
                    }`}>
                      {stain.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Finish Sheen</label>
              <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                <button
                  onClick={() => setIsMatte(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    !isMatte 
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  Gloss / Satin
                </button>
                <button
                  onClick={() => setIsMatte(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    isMatte 
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  Matte / Flat
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-100 dark:bg-stone-900/50 p-5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-sm flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <p>
            <strong>Pro Tip:</strong> Always test on scrap wood first. End grain (the cut ends) absorbs more stain and appears darker than face grain.
          </p>
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="lg:col-span-8 bg-stone-200 dark:bg-stone-950 rounded-2xl border border-stone-300 dark:border-stone-800 shadow-inner flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 via-stone-200/50 to-stone-300/50 dark:from-stone-800 dark:via-stone-900 dark:to-black pointer-events-none"></div>

        {/* The Frame Preview */}
        <div className="relative z-10 w-full max-w-md aspect-[3/4] shadow-2xl rounded-sm transition-all duration-500 transform">
          
          {/* Mat Board (Inner White) */}
          <div className="absolute inset-8 bg-white shadow-inner z-20 flex items-center justify-center">
            <div className="text-stone-300 font-serif italic text-2xl opacity-30">Photo / Art</div>
          </div>

          {/* The Wood Frame Structure */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* We simulate wood using a base texture and a blend mode overlay */}
            
            {/* 1. Base Wood Texture (CSS Pattern) */}
            <div 
              className="absolute inset-0 bg-amber-100"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
                backgroundSize: '200px',
              }}
            ></div>

            {/* 2. Grain Lines (Simulated CSS) */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)',
                 backgroundSize: '100% 100%'
               }}
            ></div>

            {/* 3. The Stain Color (Multiply Mode is the magic for stains) */}
            <div 
              className="absolute inset-0 transition-colors duration-700 ease-in-out"
              style={{ 
                backgroundColor: selectedStain.color,
                mixBlendMode: 'multiply',
                opacity: selectedStain.name === 'Natural / Clear' ? 0.1 : 0.9
              }}
            ></div>

            {/* 4. The Finish (Gloss vs Matte) */}
            <div 
              className={`absolute inset-0 transition-opacity duration-500 ${
                isMatte ? 'opacity-0' : 'opacity-30'
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.1) 100%)'
              }}
            ></div>

            {/* 5. Inner Bevel/Shadow for realism */}
            <div className="absolute inset-0 border-[32px] border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
          </div>
        </div>

        {/* Selected Label floating */}
        <div className="absolute bottom-8 bg-white/90 dark:bg-stone-800/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-stone-200 dark:border-stone-700">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: selectedStain.hex }}
          ></div>
          <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
            {selectedStain.name}
          </span>
          <span className="text-stone-400 dark:text-stone-500 text-xs mx-1">|</span>
          <span className="text-stone-600 dark:text-stone-400 text-xs">
            {isMatte ? 'Matte Finish' : 'Satin Finish'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StainVisualizer;
