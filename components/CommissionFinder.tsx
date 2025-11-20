
import React, { useState } from 'react';
import { findSocialLeads, generateCommissionQuote } from '../services/geminiService';
import { Search, MessageCircle, User, DollarSign, Clock, Hammer, Copy, Check, AlertCircle, ExternalLink, Lock, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Lead } from '../types';

interface CommissionFinderProps {
  isPro: boolean;
  onTriggerSubscribe: () => void;
}

// Mock leads to simulate the experience when Search is dry (common for specific social queries)
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    platform: 'Reddit',
    user: 'walnut_fan_99',
    request: 'Looking for a custom coffee table, MCM style. Needs to be 48" long. Can\'t find what I want in stores.',
    budget: '$400-$600',
    postedDate: '2 days ago',
    url: 'https://reddit.com/r/woodworking',
    compatibilityScore: 95
  },
  {
    id: '2',
    platform: 'Twitter',
    user: '@design_enthusiast',
    request: 'Anyone know a woodworker in the PNW who can make a live edge floating shelf? Need it by next month.',
    budget: 'Unknown',
    postedDate: '5 hours ago',
    url: 'https://twitter.com',
    compatibilityScore: 80
  },
  {
    id: '3',
    platform: 'Forum',
    user: 'TableTopGamer',
    request: 'Commission request: Custom hexagon gaming table topper. Pine is fine, just need sturdy joinery.',
    budget: '$300',
    postedDate: '1 week ago',
    url: '#',
    compatibilityScore: 60
  }
];

const CommissionFinder: React.FC<CommissionFinderProps> = ({ isPro, onTriggerSubscribe }) => {
  const [keyword, setKeyword] = useState("custom coffee table");
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [loading, setLoading] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  
  // Quote Builder State
  const [material, setMaterial] = useState("Black Walnut");
  const [leadTime, setLeadTime] = useState("4-6 weeks");
  const [priceEst, setPriceEst] = useState("$550");
  const [notes, setNotes] = useState("I have some beautiful air-dried slabs ready to go.");
  const [generatedQuote, setGeneratedQuote] = useState("");
  const [generatingQuote, setGeneratingQuote] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) {
      onTriggerSubscribe();
      return;
    }

    setLoading(true);
    // In a real app, we'd parse the AI result into Lead objects.
    // For this demo, we will simulate a "fresh" fetch by shuffling mock data 
    // and checking grounding chunks if available.
    const result = await findSocialLeads(keyword);
    
    // Simulate finding new items based on search
    setTimeout(() => {
      const newLeads = [...MOCK_LEADS].map(l => ({...l, compatibilityScore: Math.floor(Math.random() * 30) + 70}));
      // If we got real search chunks, we might display them differently, 
      // but here we keep the UI consistent with the mock card layout.
      setLeads(newLeads);
      setLoading(false);
    }, 1500);
  };

  const handleGenerateQuote = async () => {
    if (!activeLead) return;
    setGeneratingQuote(true);
    const quote = await generateCommissionQuote(activeLead.request, {
      material,
      leadTime,
      priceEst,
      notes
    });
    setGeneratedQuote(quote);
    setGeneratingQuote(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedQuote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* LEFT: Search & Feed */}
      <div className="lg:col-span-5 flex flex-col gap-6 h-full">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 flex-shrink-0">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-amber-600" />
            Commission Hunter
          </h2>
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={!isPro}
              className="w-full p-3 pl-10 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="Search e.g. 'custom dining table'..."
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            {!isPro && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Lock className="h-4 w-4 text-stone-400" />
              </div>
            )}
            <button 
              type="submit"
              disabled={!isPro || loading}
              className="absolute right-2 top-2 bottom-2 px-3 bg-amber-600 text-white text-xs font-bold rounded hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Hunt'}
            </button>
          </form>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {leads.map((lead) => (
            <div 
              key={lead.id}
              onClick={() => setActiveLead(lead)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeLead?.id === lead.id 
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 ring-1 ring-amber-500' 
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    lead.platform === 'Reddit' ? 'bg-orange-100 text-orange-700' :
                    lead.platform === 'Twitter' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {lead.platform}
                  </span>
                  <span className="text-xs text-stone-400">{lead.postedDate}</span>
                </div>
                <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
                  {lead.compatibilityScore}% Match
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-stone-900 dark:text-white line-clamp-2 mb-3">
                "{lead.request}"
              </h3>
              
              <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {lead.user}
                </div>
                <div className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-300">
                  <DollarSign className="h-3 w-3" /> {lead.budget}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Quote Builder */}
      <div className="lg:col-span-7 h-full flex flex-col">
        {activeLead ? (
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">Quote Builder</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Drafting reply to <span className="font-medium text-amber-600">{activeLead.user}</span>
                  </p>
                </div>
                {activeLead.url && (
                  <a href={activeLead.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                    View Source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              {/* Constraints Input */}
              <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 overflow-y-auto">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> 
                  Your Constraints
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Available Material</label>
                    <select 
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700"
                    >
                      <option>Black Walnut</option>
                      <option>White Oak</option>
                      <option>Cherry</option>
                      <option>Maple</option>
                      <option>Reclaimed Pine</option>
                    </select>
                    <p className="text-[10px] text-stone-400 mt-1">The AI will only offer this wood.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Lead Time</label>
                    <select 
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700"
                    >
                      <option>2-3 weeks</option>
                      <option>4-6 weeks</option>
                      <option>8+ weeks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Est. Price</label>
                    <input 
                      type="text" 
                      value={priceEst}
                      onChange={(e) => setPriceEst(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Notes / Upsell</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleGenerateQuote}
                    disabled={generatingQuote}
                    className="w-full py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    {generatingQuote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hammer className="h-4 w-4" />}
                    Generate Quote
                  </button>
                </div>
              </div>

              {/* AI Output */}
              <div className="w-full md:w-1/2 p-6 bg-stone-50 dark:bg-stone-950 overflow-y-auto relative">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> 
                  Draft Response
                </h4>

                {generatedQuote ? (
                  <div className="animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm text-sm text-stone-700 dark:text-stone-300 prose prose-sm prose-amber dark:prose-invert">
                      <ReactMarkdown>{generatedQuote}</ReactMarkdown>
                    </div>
                    
                    <button 
                      onClick={copyToClipboard}
                      className="mt-4 flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied to Clipboard" : "Copy Response"}
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center">
                    <Clock className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">Set your constraints and generate a response to seal the deal.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-stone-100 dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-400">
            <Search className="h-12 w-12 mb-4 opacity-20" />
            <p className="font-medium">Select a lead to start building a quote.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionFinder;
