
import React from 'react';
import { CheckCircle2, Crown, X, Sparkles, Zap, Search } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-amber-100 dark:border-amber-900/30 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header Pattern */}
        <div className="h-32 bg-stone-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-600/40 via-stone-900 to-stone-900"></div>
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
            </button>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 p-3 rounded-xl border-4 border-white dark:border-stone-800 shadow-xl">
                <Crown className="h-8 w-8 text-amber-500 fill-amber-500" />
            </div>
        </div>

        <div className="px-8 pt-10 pb-8 text-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Become a Craftsman</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-8">
                Unlock the full power of AI to scale your woodworking business.
            </p>

            <div className="space-y-4 mb-8 text-left">
                <div className="flex gap-3 items-start">
                    <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-600 dark:text-amber-500 mt-0.5">
                        <Zap className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Live Market Scans</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Real-time trend analysis via Google Search.</p>
                    </div>
                </div>
                <div className="flex gap-3 items-start">
                    <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-600 dark:text-amber-500 mt-0.5">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Custom Blueprints</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Generate plans for ANY custom item you can imagine.</p>
                    </div>
                </div>
                <div className="flex gap-3 items-start">
                    <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-600 dark:text-amber-500 mt-0.5">
                        <Search className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Local Intelligence</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Find suppliers & grants near you with Maps integration.</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={onSubscribe}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold shadow-lg shadow-amber-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
                Upgrade to Pro <span className="text-amber-200 font-normal text-xs ml-1">($19/mo)</span>
            </button>
            <p className="mt-4 text-[10px] text-stone-400 uppercase tracking-widest">Cancel Anytime • Secure Payment</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
