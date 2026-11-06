import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { ArrowRight, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 50);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'How It Works', route: 'how-it-works' },
    { label: 'For Creators', route: 'for-creators' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'FAQ', route: 'faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out flex justify-center px-3 sm:px-4 ${
        isScrolled ? 'pt-2 pb-1.5' : 'pt-3.5 pb-2'
      }`}
    >
      <div
        className={`w-full max-w-4xl transition-all duration-500 transform ${
          hasEntered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'
        } ${
          isScrolled
            ? 'bg-[#131926]/90 backdrop-blur-2xl border border-[#1E293B] shadow-[0_16px_40px_-12px_rgba(9,13,22,0.95)] rounded-full px-3.5 sm:px-4 py-2'
            : 'bg-[#131926]/60 backdrop-blur-md border border-[#1E293B]/60 rounded-2xl sm:rounded-full px-4 sm:px-5 py-2 sm:py-2.5'
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1: Starburst Glyph + VALLU Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E293B]/80 hover:bg-[#1E293B] border border-[#1E293B] flex items-center justify-center text-[#F1F5F9] transition-all hover:scale-105 active:scale-95 group shadow-sm"
              aria-label="VALLU Home"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#F1F5F9] group-hover:text-[#E11D48] group-hover:rotate-45 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
              </svg>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-left focus:outline-none group"
            >
              <span className="font-display font-black text-base sm:text-lg tracking-wider text-[#F1F5F9] group-hover:text-[#E11D48] transition-colors">
                VALLU
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shadow-[0_0_8px_#E11D48]" />
            </button>
          </div>

          {/* Zone 2: Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#090D16]/60 border border-[#1E293B] rounded-full px-3 py-1 shadow-inner">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#F1F5F9] bg-[#1E293B] shadow-sm font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Clean Actions (Sign In + Get Started) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => onNavigate('login')}
              className="text-[11px] sm:text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-[#1E293B]/40 transition-colors whitespace-nowrap"
            >
              Sign In
            </button>

            <button
              onClick={() => onNavigate('signup')}
              className="group flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-white bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 px-3.5 sm:px-4 py-1.5 rounded-full transition-all shadow-[0_4px_14px_rgba(225,29,72,0.35)] hover:shadow-[0_4px_20px_rgba(225,29,72,0.55)] active:scale-95 whitespace-nowrap"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#1E293B]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2.5 pt-2.5 border-t border-[#1E293B] flex flex-col gap-1 pb-1 animate-in fade-in duration-150">
            {navLinks.map((item) => (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  currentRoute === item.route
                    ? 'text-[#F1F5F9] bg-[#1E293B] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]/40'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-px bg-[#1E293B] my-1" />

            <button
              onClick={() => {
                onNavigate('signup');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-1.5 text-xs rounded-lg font-semibold text-rose-300 hover:bg-[#1E293B] flex items-center justify-between"
            >
              <span>Get Started / Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E11D48]" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

