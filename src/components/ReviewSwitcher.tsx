import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Layers, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

interface ReviewSwitcherProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const ReviewSwitcher: React.FC<ReviewSwitcherProps> = ({ currentRoute, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const pages: { id: PageRoute; label: string; group: 'marketing' | 'auth' | 'system' | 'app'; num: number }[] = [
    // Marketing (1 - 8)
    { id: 'home', label: '1. Home', group: 'marketing', num: 1 },
    { id: 'how-it-works', label: '2. How It Works', group: 'marketing', num: 2 },
    { id: 'for-creators', label: '3. For Creators', group: 'marketing', num: 3 },
    { id: 'pricing', label: '4. Pricing', group: 'marketing', num: 4 },
    { id: 'faq', label: '5. FAQ', group: 'marketing', num: 5 },
    { id: 'about', label: '6. About', group: 'marketing', num: 6 },
    { id: 'contact', label: '7. Contact', group: 'marketing', num: 7 },
    { id: 'legal', label: '8. Legal', group: 'marketing', num: 8 },
    // Auth & Creator SaaS Flow (9 - 13)
    { id: 'signup', label: '9. Auth (Sign Up / Log In)', group: 'auth', num: 9 },
    { id: 'onboarding', label: '10. Creator Onboarding', group: 'app', num: 10 },
    { id: 'landing-preview', label: '11. Landing Preview', group: 'app', num: 11 },
    { id: 'public-landing', label: '12. Public Creator Link', group: 'app', num: 12 },
    { id: 'dashboard', label: '13. Creator Dashboard', group: 'app', num: 13 },
    // System (14)
    { id: '404', label: '14. 404 Error', group: 'system', num: 14 },
  ];

  const currentPage = pages.find((p) => p.id === currentRoute) || pages[0];

  return (
    <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Expanded Grid Panel */}
      {isExpanded && (
        <div className="mb-2 w-[92vw] max-w-2xl bg-[#131926]/95 backdrop-blur-2xl border border-[#1E293B] rounded-2xl p-4 shadow-[0_24px_50px_-12px_rgba(9,13,22,0.95)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E11D48]" />
              <span className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider">
                VALLU 14-View Live Navigator
              </span>
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">
              Click any view to preview
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-64 overflow-y-auto pr-1">
            {pages.map((p) => {
              const isActive = currentRoute === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onNavigate(p.id);
                    setIsExpanded(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#E11D48] text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                      : 'bg-[#090D16]/60 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
                  }`}
                >
                  <span className="truncate">{p.label}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Pill Trigger */}
      <div className="flex items-center gap-2 bg-[#131926]/90 backdrop-blur-xl border border-[#1E293B] rounded-full px-3 py-1.5 shadow-[0_12px_32px_rgba(9,13,22,0.85)]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-medium text-[#F1F5F9] hover:text-[#E11D48] transition-colors py-1 px-1.5"
          title="Toggle 12-Page View Switcher"
        >
          <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
          <span className="text-[#94A3B8]">Viewing:</span>
          <span className="font-semibold text-white underline decoration-[#E11D48] decoration-2 underline-offset-4">
            {currentPage.label}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-[#94A3B8]" />
          )}
        </button>

        <div className="h-4 w-px bg-[#1E293B]" />

        {/* Quick Prev / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const currentIndex = pages.findIndex((p) => p.id === currentRoute);
              const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
              onNavigate(pages[prevIndex].id);
            }}
            className="px-2 py-1 text-[11px] text-[#94A3B8] hover:text-white rounded-md hover:bg-[#1E293B] transition-colors"
            title="Previous page"
          >
            ←
          </button>
          <span className="text-[10px] text-[#94A3B8] font-mono">
            {currentPage.num}/14
          </span>
          <button
            onClick={() => {
              const currentIndex = pages.findIndex((p) => p.id === currentRoute);
              const nextIndex = (currentIndex + 1) % pages.length;
              onNavigate(pages[nextIndex].id);
            }}
            className="px-2 py-1 text-[11px] text-[#94A3B8] hover:text-white rounded-md hover:bg-[#1E293B] transition-colors"
            title="Next page"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
