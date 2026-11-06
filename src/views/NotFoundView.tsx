import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, Home, Search, Compass } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    if (query.toLowerCase().includes('price') || query.toLowerCase().includes('plan')) {
      onNavigate('pricing');
    } else if (query.toLowerCase().includes('work') || query.toLowerCase().includes('how')) {
      onNavigate('how-it-works');
    } else if (query.toLowerCase().includes('faq') || query.toLowerCase().includes('question')) {
      onNavigate('faq');
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* Glow */}
        <div className="relative inline-block">
          <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-[#090D16] border border-[#E11D48]/30 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(225,29,72,0.25)]">
            <span className="font-display font-black text-3xl sm:text-4xl text-[#E11D48] font-mono">404</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F1F5F9]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            The deal room, creator handle, or document you were looking for doesn't exist or has expired under our 14-day data retention policy.
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="relative max-w-sm mx-auto">
          <Search className="w-4 h-4 text-[#94A3B8]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages (e.g. pricing, faq, how it works)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#131926] border border-[#1E293B] rounded-full pl-10 pr-24 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-[11px] text-[#F1F5F9] font-medium transition-colors"
          >
            Find
          </button>
        </form>

        {/* Action Shortcuts */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5 uppercase tracking-wider active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className="px-4 py-2.5 rounded-full bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F1F5F9] font-medium transition-colors"
          >
            How It Works
          </button>

          <button
            onClick={() => onNavigate('faq')}
            className="px-4 py-2.5 rounded-full bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F1F5F9] font-medium transition-colors"
          >
            Read FAQs
          </button>
        </div>
      </div>
    </div>
  );
};
