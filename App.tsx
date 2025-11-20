
import React, { useState, useEffect } from 'react';
import { AppTab, SavedItem } from './types';
import MarketInsights from './components/MarketInsights';
import RevenueCalculator from './components/RevenueCalculator';
import ActionPlan from './components/ActionPlan';
import TemplateGenerator from './components/TemplateGenerator';
import StorePreview from './components/StorePreview';
import SupplierFinder from './components/SupplierFinder';
import Gallery from './components/Gallery';
import StainVisualizer from './components/StainVisualizer';
import CommissionFinder from './components/CommissionFinder';
import SubscriptionModal from './components/SubscriptionModal';
import { Hammer, LineChart, BookOpen, TrendingUp, Ruler, ShoppingBag, Truck, Image as ImageIcon, Moon, Sun, Palette, Crown, Lock, MessageCircle } from 'lucide-react';

function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.MARKET);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveItem = (item: Omit<SavedItem, 'id' | 'date'>) => {
    const newItem: SavedItem = {
      ...item,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setSavedItems(prev => [newItem, ...prev]);
    
    const notification = document.createElement('div');
    notification.textContent = "Saved to Gallery!";
    notification.className = "fixed bottom-4 right-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4 z-[60]";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const handleDeleteItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleTriggerSubscribe = () => {
    setShowSubscribeModal(true);
  };

  const handleSubscribe = () => {
    setIsPro(true);
    setShowSubscribeModal(false);
    // Simulate success notification
    const notification = document.createElement('div');
    notification.textContent = "Welcome to Craftsman Pro!";
    notification.className = "fixed top-20 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-6 py-3 rounded-full shadow-xl text-sm font-bold animate-in fade-in slide-in-from-top-4 z-[60]";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col transition-colors duration-300">
      <SubscriptionModal 
        isOpen={showSubscribeModal} 
        onClose={() => setShowSubscribeModal(false)}
        onSubscribe={handleSubscribe}
      />

      {/* Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-amber-600 p-2 rounded-lg shadow-sm">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900 dark:text-white leading-tight">Timber Trade</h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">Wish A MF Wood Business Planner</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div 
                  onClick={!isPro ? handleTriggerSubscribe : undefined}
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    isPro 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
                    : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700'
                  }`}
               >
                 {isPro ? <Crown className="h-3 w-3 fill-amber-600 text-amber-600" /> : <Lock className="h-3 w-3" />}
                 {isPro ? 'Craftsman Pro' : 'Free Plan'}
               </div>

               <div className="bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 transition-colors hidden sm:block">
                 {savedItems.length} Saved
               </div>
               <button 
                 onClick={() => setDarkMode(!darkMode)}
                 className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
                 title="Toggle Dark Mode"
               >
                 {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-stone-200/50 dark:bg-stone-900/50 p-1 rounded-xl w-full md:w-fit mx-auto md:mx-0 overflow-x-auto transition-colors">
          <button
            onClick={() => setCurrentTab(AppTab.MARKET)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.MARKET 
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Market Trends
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.COMMISSIONS)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.COMMISSIONS
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Commission Hunter
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.TEMPLATES)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.TEMPLATES
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Ruler className="h-4 w-4" />
            Plans & Templates
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.STAIN_VISUALIZER)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.STAIN_VISUALIZER
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Palette className="h-4 w-4" />
            Stain Lab
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.CALCULATOR)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.CALCULATOR
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <LineChart className="h-4 w-4" />
            Profit Calc
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.SUPPLIERS)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.SUPPLIERS
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Truck className="h-4 w-4" />
            Find Wood
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.STORE)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.STORE
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Store Preview
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.GUIDE)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.GUIDE
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Launch Guide
          </button>
          <button
            onClick={() => setCurrentTab(AppTab.GALLERY)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === AppTab.GALLERY
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
          {currentTab === AppTab.MARKET && <MarketInsights onSave={handleSaveItem} isPro={isPro} onTriggerSubscribe={handleTriggerSubscribe} />}
          {currentTab === AppTab.COMMISSIONS && <CommissionFinder isPro={isPro} onTriggerSubscribe={handleTriggerSubscribe} />}
          {currentTab === AppTab.TEMPLATES && <TemplateGenerator onSave={handleSaveItem} isPro={isPro} onTriggerSubscribe={handleTriggerSubscribe} />}
          {currentTab === AppTab.STAIN_VISUALIZER && <StainVisualizer />}
          {currentTab === AppTab.CALCULATOR && <RevenueCalculator isPro={isPro} onTriggerSubscribe={handleTriggerSubscribe} />}
          {currentTab === AppTab.STORE && <StorePreview />}
          {currentTab === AppTab.GUIDE && <ActionPlan isPro={isPro} onTriggerSubscribe={handleTriggerSubscribe} />}
          {currentTab === AppTab.SUPPLIERS && <SupplierFinder isPro={isPro} onTriggerSubscribe={handleTriggerSubscribe} />}
          {currentTab === AppTab.GALLERY && <Gallery items={savedItems} onDelete={handleDeleteItem} />}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-sm text-stone-400 dark:text-stone-500">
            &copy; 2024 TimberTrade Tools. Built for Makers.
          </p>
          {!isPro && (
            <button 
              onClick={handleTriggerSubscribe}
              className="text-xs font-medium text-amber-600 dark:text-amber-500 hover:underline"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
