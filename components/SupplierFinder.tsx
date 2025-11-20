
import React, { useState } from 'react';
import { findSuppliers } from '../services/geminiService';
import { Loader2, MapPin, Search, Navigation, Star, Phone, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SupplierFinderProps {
  isPro: boolean;
  onTriggerSubscribe: () => void;
}

const SupplierFinder: React.FC<SupplierFinderProps> = ({ isPro, onTriggerSubscribe }) => {
  const [location, setLocation] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<{text: string, chunks: any[] | undefined} | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    if (!isPro) {
        onTriggerSubscribe();
        return;
    }

    setLoading(true);
    const data = await findSuppliers(location);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Local Supplier Map</h2>
          <p className="text-stone-500 dark:text-stone-400">Locate the best hardwood, sawmills, and tools near you.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto shadow-sm rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 relative">
          <div className="relative flex-grow md:w-80">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter City or Zip Code..."
              disabled={!isPro}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-stone-900 outline-none text-stone-800 dark:text-white placeholder-stone-400 disabled:bg-stone-50 dark:disabled:bg-stone-800 disabled:cursor-not-allowed"
            />
            {!isPro && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Lock className="h-4 w-4 text-stone-400" />
                </div>
            )}
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`px-6 py-3 font-medium transition-colors disabled:opacity-70 flex items-center ${
                isPro
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-stone-200 text-stone-500 hover:bg-stone-300 dark:bg-stone-800'
            }`}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isPro ? "Find" : "Pro Only")}
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Results List / Bubbles */}
        <div className="lg:col-span-7 space-y-4">
           {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-stone-400">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-3" />
              <p>Scouting the area for timber...</p>
            </div>
           )}

           {!loading && results?.chunks && results.chunks.length > 0 && (
             <div className="grid gap-4">
               {results.chunks.map((chunk, idx) => {
                 const uri = chunk.maps?.googleMapsUri || chunk.web?.uri || chunk.uri;
                 const title = chunk.maps?.title || chunk.web?.title || chunk.title;
                 // Some chunks might not be useful places
                 if (!uri || !title) return null;

                 return (
                  <div key={idx} className="bg-white dark:bg-stone-900 p-5 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:shadow-md transition-shadow flex gap-4 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center border border-red-100 dark:border-red-900 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                        <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-stone-900 dark:text-white text-lg">{title}</h3>
                        {chunk.maps?.rating && (
                          <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded text-xs font-bold text-amber-700 dark:text-amber-500">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            {chunk.maps.rating}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-stone-500 dark:text-stone-400 mt-1 mb-3">
                        {chunk.maps?.address || "Local Supplier"}
                      </div>

                      <div className="flex gap-2">
                        <a 
                          href={uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Navigation className="h-3 w-3" />
                          Directions
                        </a>
                        {chunk.maps?.phoneNumber && (
                           <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                             <Phone className="h-3 w-3" />
                             Call
                           </button>
                        )}
                      </div>
                    </div>
                  </div>
                 );
               })}
             </div>
           )}

           {!loading && !results && (
             <div className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-8 text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-stone-800 shadow-sm mb-4">
                 {isPro ? <Search className="h-8 w-8 text-stone-300 dark:text-stone-600" /> : <Lock className="h-8 w-8 text-stone-300 dark:text-stone-600" />}
               </div>
               <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300">
                 {isPro ? "Ready to Search" : "Supplier Finder (Locked)"}
               </h3>
               <p className="text-stone-500 dark:text-stone-500 max-w-xs mx-auto mt-2">
                 {isPro 
                    ? "Enter a location to find suppliers formatted as easy-to-read map cards."
                    : "Upgrade to Craftsman Pro to use the Live Map Search feature."}
               </p>
             </div>
           )}
        </div>

        {/* AI Summary Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden sticky top-24">
            <div className="bg-stone-900 dark:bg-stone-950 px-6 py-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-amber-400" />
                AI Logistics Summary
              </h3>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto prose prose-sm prose-stone dark:prose-invert">
               {results ? (
                 <ReactMarkdown>{results.text}</ReactMarkdown>
               ) : (
                 <p className="text-stone-500 dark:text-stone-400 italic">
                   {isPro 
                     ? "The AI will analyze the search results to recommend the best spots for hardwood vs. tools once you search."
                     : "Upgrade to view AI recommendations on local suppliers."}
                 </p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierFinder;
