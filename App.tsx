import React, { useState } from 'react';
import { AppTab } from './types';
import MarketInsights from './components/MarketInsights';
import RevenueCalculator from './components/RevenueCalculator';
import ActionPlan from './components/ActionPlan';
import TemplateGenerator from './components/TemplateGenerator';
import StorePreview from './components/StorePreview';
import SupplierFinder from './components/SupplierFinder';
import { Hammer, LineChart, BookOpen, TrendingUp, Ruler, ShoppingBag, Truck } from 'lucide-react';

function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.MARKET);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-amber-600 p-2 rounded-lg">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900 leading-tight">TimberTrade</h1>
                <p className="text-xs text-stone-500">Artisan Business Planner</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-stone-200/50 p-1 rounded-xl w-full md:w-fit mx-auto md:mx-0 overflow-x-auto">
          <button
            onClick={() => setCurrentTab(AppTab.MARKET)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.MARKET 
                ? 'bg-white text-amber-700 shadow-sm ring-1 ring-stone-200' 
                : 'text-stone-600 hover:bg-stone-200 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Market Trends
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.TEMPLATES)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.TEMPLATES
                ? 'bg-white text-amber-700 shadow-sm ring-1 ring-stone-200' 
                : 'text-stone-600 hover:bg-stone-200 hover:text-stone-800'
            }`}
          >
            <Ruler className="h-4 w-4" />
            Plans & Templates
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.CALCULATOR)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.CALCULATOR
                ? 'bg-white text-amber-700 shadow-sm ring-1 ring-stone-200' 
                : 'text-stone-600 hover:bg-stone-200 hover:text-stone-800'
            }`}
          >
            <LineChart className="h-4 w-4" />
            Profit Calc
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.SUPPLIERS)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.SUPPLIERS
                ? 'bg-white text-amber-700 shadow-sm ring-1 ring-stone-200' 
                : 'text-stone-600 hover:bg-stone-200 hover:text-stone-800'
            }`}
          >
            <Truck className="h-4 w-4" />
            Find Wood
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.STORE)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.STORE
                ? 'bg-white text-amber-700 shadow-sm ring-1 ring-stone-200' 
                : 'text-stone-600 hover:bg-stone-200 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Store Preview
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.GUIDE)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.GUIDE
                ? 'bg-white text-amber-700 shadow-sm ring-1 ring-stone-200' 
                : 'text-stone-600 hover:bg-stone-200 hover:text-stone-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Launch Guide
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
          {currentTab === AppTab.MARKET && <MarketInsights />}
          {currentTab === AppTab.TEMPLATES && <TemplateGenerator />}
          {currentTab === AppTab.CALCULATOR && <RevenueCalculator />}
          {currentTab === AppTab.STORE && <StorePreview />}
          {currentTab === AppTab.GUIDE && <ActionPlan />}
          {currentTab === AppTab.SUPPLIERS && <SupplierFinder />}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-stone-400">
            &copy; 2024 TimberTrade Tools. Built for Makers.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;