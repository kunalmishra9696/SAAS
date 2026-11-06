import React from 'react';
import { PageRoute } from '../types';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-[#090D16] border-t border-[#1E293B] pt-14 sm:pt-16 pb-12 overflow-hidden text-[#94A3B8]">
      {/* Background subtle neon crimson glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#E11D48]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-[#1E293B]">
          {/* Brand info (2 columns on mobile/tablet) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl sm:text-2xl text-[#F1F5F9] tracking-wider">
                VALLU
              </span>
              <span className="w-2 h-2 rounded-full bg-[#E11D48] shadow-[0_0_8px_#E11D48]" />
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm leading-relaxed">
              The creator-first deal operating system. One public bio link, an autonomous brand inquiry assistant, and zero predatory contract terms.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131926] border border-[#1E293B] text-[11px] sm:text-xs text-[#F1F5F9]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confidential Rate Floor Guaranteed</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#F1F5F9]">Platform</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('for-creators')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>For Creators</span>
                  <span className="text-[9px] text-[#E11D48] font-mono">CALC</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors"
                >
                  Pricing & Beta
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#F1F5F9]">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('404')}
                  className="hover:text-white transition-colors"
                >
                  System 404
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Auth */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#F1F5F9]">Security & Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('legal')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal')}
                  className="hover:text-white transition-colors"
                >
                  14-Day Auto-Decline
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors text-[#F1F5F9] font-medium"
                >
                  Creator Portal Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} VALLU Inc. Direct creator payments, zero escrow.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate('legal')} className="hover:text-white">
              Cookie Preferences
            </button>
            <button onClick={() => onNavigate('legal')} className="hover:text-white">
              Security Disclosures
            </button>
            <span className="text-[#64748B]">v1.0 Master Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
