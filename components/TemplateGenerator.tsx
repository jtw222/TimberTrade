
import React, { useState } from 'react';
import { generateDesignPlan, generateBlueprintImage, FALLBACK_PLAN } from '../services/geminiService';
import { Ruler, PenTool, Loader2, Hammer, Download, RefreshCw, Image as ImageIcon, Camera, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SavedItem } from '../types';

interface TemplateGeneratorProps {
  onSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  isPro: boolean;
  onTriggerSubscribe: () => void;
}

const TemplateGenerator: React.FC<TemplateGeneratorProps> = ({ onSave, isPro, onTriggerSubscribe }) => {
  const [productType, setProductType] = useState<string>("Picture Frame");
  const [customType, setCustomType] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    // Gate the custom request feature
    if (productType === "Other" && !isPro) {
        onTriggerSubscribe();
        return;
    }

    setLoading(true);
    setPlan("");
    setImageUrl(null);
    const typeToGen = productType === "Other" ? customType : productType;
    
    try {
      // Run both requests
      const textResult = await generateDesignPlan(typeToGen);
      setPlan(textResult || FALLBACK_PLAN);
      
      // Image is secondary, don't block if it fails or if quota is tight
      const imageResult = await generateBlueprintImage(typeToGen);
      setImageUrl(imageResult);
    } catch (e) {
      console.error("Error generating plan", e);
      setPlan(FALLBACK_PLAN);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = () => {
    if (!plan) return;
    const typeToGen = productType === "Other" ? customType : productType;
    onSave({
      type: 'PLAN',
      title: `Blueprint: ${typeToGen}`,
      content: plan,
      image: imageUrl,
      tags: ['Draft', 'Custom']
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 mb-4 text-amber-800 dark:text-amber-500">
            <Ruler className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Blueprint Generator</h3>
          </div>
          
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
            Generate professional grade woodworking plans and visual blueprints for your shop.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase mb-1">Product Category</label>
              <select 
                value={productType} 
                onChange={(e) => setProductType(e.target.value)}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Artisan Picture Frame">Picture Frame</option>
                <option value="Shadow Box Frame">Shadow Box</option>
                <option value="Heirloom Hope Chest">Hope Chest</option>
                <option value="Live Edge Floating Shelf">Floating Shelf</option>
                <option value="Rustic End Table">End Table</option>
                <option value="Wooden Serving Tray">Serving Tray</option>
                <option value="Other">Custom Request (Pro)...</option>
              </select>
            </div>

            {productType === "Other" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase mb-1">What do you want to build?</label>
                <div className="relative">
                    <input 
                      type="text" 
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="e.g. Wine Rack, Plant Stand"
                      disabled={!isPro}
                      className="w-full p-2 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60"
                    />
                    {!isPro && (
                        <div className="absolute right-2 top-2.5 text-amber-600">
                            <Lock className="h-4 w-4" />
                        </div>
                    )}
                </div>
                {!isPro && <p className="text-xs text-amber-600 mt-1">Unlock Pro to generate custom plans.</p>}
              </div>
            )}

            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors disabled:opacity-70 ${
                  productType === 'Other' && !isPro 
                  ? 'bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (productType === 'Other' && !isPro ? <Lock className="h-4 w-4" /> : <PenTool className="h-5 w-5" />)}
              {loading ? 'Drafting Plan...' : 'Generate New Plan'}
            </button>
          </div>
        </div>

        <div className="bg-stone-100 dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
          <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Daily Inspiration</h4>
          <p className="text-sm text-stone-600 dark:text-stone-400 italic">
            "Measure twice, cut once, and always sand with the grain."
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-500">
            <RefreshCw className="h-3 w-3" />
            <span>Refreshed Today</span>
          </div>
        </div>
      </div>

      {/* Blueprint Output */}
      <div className="lg:col-span-8">
        <div className="bg-white dark:bg-stone-900 min-h-[600px] p-8 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 relative">
          {!plan && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 dark:text-stone-600">
              <Hammer className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a product type to generate a blueprint.</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-600/70 dark:text-amber-500/70 bg-white/80 dark:bg-stone-900/80 z-10">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="font-medium">Drafting technical drawings & steps...</p>
            </div>
          )}

          {/* Display Generated Image */}
          {imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm">
              <div className="bg-stone-100 dark:bg-stone-800 px-4 py-2 border-b border-stone-200 dark:border-stone-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Generated Technical View</span>
              </div>
              <img src={imageUrl} alt="Technical Blueprint" className="w-full h-auto object-cover max-h-[400px]" />
            </div>
          )}

          {plan && (
            <div className="prose prose-stone prose-amber dark:prose-invert max-w-none">
              <div className="flex justify-end mb-4 gap-2">
                 <button 
                    onClick={handleCapture}
                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                 >
                    <Camera className="h-3 w-3" /> Capture to Gallery
                 </button>
                 <button className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                    <Download className="h-3 w-3" /> Export PDF
                 </button>
              </div>
              <ReactMarkdown>{plan}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateGenerator;
