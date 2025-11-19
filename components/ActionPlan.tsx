import React, { useState } from 'react';
import { CheckCircle2, ShoppingBag, Truck, PenTool, Store, Landmark, Search, ExternalLink, Loader2 } from 'lucide-react';
import { findGrants } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const steps = [
  {
    title: "Product Validation & Sourcing",
    icon: <PenTool className="h-6 w-6 text-amber-600" />,
    content: [
      "Secure a consistent lumber supplier (hardwoods like Walnut, Oak, Maple sell best).",
      "Create 3-5 prototypes (Frames, Coasters, Floating Shelves).",
      "Take high-quality photos in natural light (lifestyle shots are crucial for decor).",
      "Calculate exact board-feet required per product to refine pricing."
    ]
  },
  {
    title: "Brand & Digital Presence",
    icon: <Store className="h-6 w-6 text-amber-600" />,
    content: [
      "Choose a name that evokes craftsmanship (e.g., 'Heritage Joinery', 'Grain & Knot').",
      "Design a simple logo (can use Canva or AI tools).",
      "Register domain and social handles (Instagram/Pinterest are vital for visual goods).",
      "Write your 'Maker Story' – people buy the artisan, not just the wood."
    ]
  },
  {
    title: "Sales Channels Setup",
    icon: <ShoppingBag className="h-6 w-6 text-amber-600" />,
    content: [
      "Launch on Etsy first for built-in traffic (low barrier to entry).",
      "Set up Shopify once you have >10 products and an email list.",
      "Explore local craft fairs (high conversion rate, immediate feedback).",
      "Price products with at least 50% margin to allow for wholesale later."
    ]
  },
  {
    title: "Operations & Logistics",
    icon: <Truck className="h-6 w-6 text-amber-600" />,
    content: [
      "Stock up on shipping supplies (bubble wrap, corner protectors, branded boxes).",
      "Set up a dedicated 'Packing Station' to speed up fulfillment.",
      "Use a shipping aggregator like Pirate Ship to save 40-80% on labels.",
      "Create a standard operating procedure (SOP) for the 2-man workflow."
    ]
  }
];

const ActionPlan: React.FC = () => {
  const [location, setLocation] = useState("");
  const [grantResults, setGrantResults] = useState<{text: string, chunks: any[] | undefined} | null>(null);
  const [loadingGrants, setLoadingGrants] = useState(false);

  const handleGrantSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoadingGrants(true);
    const results = await findGrants(location);
    setGrantResults(results);
    setLoadingGrants(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Roadmap Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-3">Launch Roadmap</h2>
          <p className="text-stone-600">A streamlined path from workshop to worldwide shipping.</p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-stone-200 before:z-0">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-stone-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {step.icon}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-stone-200 z-10">
                <div className="flex items-center justify-between space-x-2 mb-3">
                  <h3 className="font-bold text-stone-800 text-lg">{step.title}</h3>
                  <span className="text-xs font-bold text-stone-400">0{idx + 1}</span>
                </div>
                <ul className="space-y-3">
                  {step.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-600 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Resources Section */}
      <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Landmark className="h-6 w-6 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800">Financial Fuel & Resources</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Static Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-700">Federal & National Programs</h3>
            <div className="grid gap-3">
              <a href="https://www.sba.gov/funding-programs" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 transition-colors group">
                <div>
                  <div className="font-medium text-stone-900">SBA Loans & Grants</div>
                  <div className="text-xs text-stone-500">Small Business Administration</div>
                </div>
                <ExternalLink className="h-4 w-4 text-stone-400 group-hover:text-emerald-500" />
              </a>
              <a href="https://www.grants.gov/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 transition-colors group">
                <div>
                  <div className="font-medium text-stone-900">Grants.gov</div>
                  <div className="text-xs text-stone-500">Official Federal Database</div>
                </div>
                <ExternalLink className="h-4 w-4 text-stone-400 group-hover:text-emerald-500" />
              </a>
              <a href="https://www.score.org/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200 hover:border-emerald-500 transition-colors group">
                <div>
                  <div className="font-medium text-stone-900">SCORE Mentorship</div>
                  <div className="text-xs text-stone-500">Free Business Mentoring</div>
                </div>
                <ExternalLink className="h-4 w-4 text-stone-400 group-hover:text-emerald-500" />
              </a>
            </div>
          </div>

          {/* Local Search */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="font-semibold text-stone-700 mb-2">Find Local Funding</h3>
            <p className="text-sm text-stone-500 mb-4">AI-powered search for grants in your specific area.</p>
            
            <form onSubmit={handleGrantSearch} className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State (e.g. Austin, TX)"
                className="flex-1 p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-emerald-600 font-medium placeholder-stone-400"
              />
              <button 
                type="submit" 
                disabled={loadingGrants}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center"
              >
                {loadingGrants ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </button>
            </form>

            <div className="max-h-60 overflow-y-auto prose prose-sm prose-stone">
              {grantResults ? (
                <div>
                  <ReactMarkdown>{grantResults.text}</ReactMarkdown>
                  {grantResults.chunks && grantResults.chunks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-xs font-bold text-stone-500 mb-2">Sources:</p>
                      <div className="space-y-1">
                        {grantResults.chunks.map((c: any, i: number) => c.web?.uri && (
                          <a key={i} href={c.web.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline truncate">
                            {c.web.title || "Source Link"}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-stone-400 py-4 text-sm">
                  Enter your location to scan for local manufacturing grants.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;