import React from 'react';
import { PageRoute } from '../types';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface PricingViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-28 max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
          <span>TRANSPARENT BETA PRICING</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-6xl text-[#F1F5F9] tracking-tight uppercase leading-[1.05]">
          ZERO COMMISSION. <span className="text-[#E11D48]">100% YOURS</span>.
        </h1>
        <p className="text-xs sm:text-base text-[#94A3B8] max-w-lg mx-auto">
          Keep 100% of your sponsor payout. No hidden agency cuts, no transaction percentages.
        </p>
      </div>

      {/* Pricing Cards with Hover Zoom and Ambient Glow (2 columns on phone & tablet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
        {/* Tier 1: Creator Beta (Active Plan) */}
        <div className="safeguard-card bg-[#131926] border-2 border-[#E11D48]/60 rounded-3xl p-5 sm:p-10 relative flex flex-col justify-between shadow-[0_20px_50px_rgba(225,29,72,0.25)]">
          <div className="absolute -top-3 left-6 sm:left-8 bg-gradient-to-r from-[#E11D48] to-rose-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 sm:px-3.5 py-1 rounded-full font-mono shadow-sm">
            Current Beta Special — 100% Free
          </div>

          <div className="space-y-4 sm:space-y-6 pt-2">
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F1F5F9]">Creator Early Beta</h3>
              <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-1">
                Full access for active creators during our private V1 launch.
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-4xl sm:text-5xl text-[#F1F5F9] font-mono">$0</span>
              <span className="text-xs sm:text-sm text-[#94A3B8] font-mono">/ month for life of beta</span>
            </div>

            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#94A3B8] border-t border-[#1E293B] pt-4 sm:pt-6">
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1 Verified Public Bio Page (vallu.bio/@you)</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Semi-AI Brand Inquiry Assistant</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted Floor Rate & 2-counter discovery</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Red-Flag Radar</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>14-Day Auto-Decline Engine</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5 font-bold text-[#F1F5F9]">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0% Commission (Direct Payout to You)</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#1E293B]">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(225,29,72,0.4)] active:scale-95"
            >
              CLAIM YOUR FREE BETA LINK
            </button>
            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] text-center mt-2 sm:mt-3 font-mono">
              Instant activation · No credit card required
            </p>
          </div>
        </div>

        {/* Tier 2: Pro & Agency (Future Preview) */}
        <div className="safeguard-card bg-[#131926] border border-[#1E293B] rounded-3xl p-5 sm:p-10 relative flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F1F5F9]">Pro Creator</h3>
                <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-1">
                  For full-time media teams and talent managers.
                </p>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase bg-[#090D16] text-[#94A3B8] border border-[#1E293B] px-2 py-0.5 rounded">
                Post-Beta
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-4xl sm:text-5xl text-[#94A3B8]/60 font-mono">$29</span>
              <span className="text-xs sm:text-sm text-[#94A3B8] font-mono">/ month</span>
            </div>

            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#94A3B8] border-t border-[#1E293B] pt-4 sm:pt-6">
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>Everything in Early Beta</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>Custom Domain (deals.yourname.com)</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>Multi-seat manager access for talent agents</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-2.5">
                <Check className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>Automated PDF contract agreement generator</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#1E293B]">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-3 sm:py-4 rounded-full bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-[#F1F5F9] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Request Pro Notification
            </button>
            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] text-center mt-2 sm:mt-3 font-mono">
              Beta creators receive 50% lifetime discount
            </p>
          </div>
        </div>
      </div>

      {/* Guarantee Notice */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#131926] border border-[#1E293B] text-center flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>VALLU is not an escrow service. Brands pay you directly through your chosen invoice methods.</span>
      </div>
    </div>
  );
};
