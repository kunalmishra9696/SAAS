import React, { useState } from 'react';
import { PageRoute } from '../types';
import {
  Calculator,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  AlertOctagon,
  Check
} from 'lucide-react';

interface ForCreatorsViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const ForCreatorsView: React.FC<ForCreatorsViewProps> = ({ onNavigate }) => {
  // Calculator state
  const [inquiriesPerMonth, setInquiriesPerMonth] = useState<number>(12);
  const [averageDealRate, setAverageDealRate] = useState<number>(2500);

  // Calculations
  const hoursSavedPerMonth = Math.round(inquiriesPerMonth * 1.5);
  const negotiatedUplift = Math.round(inquiriesPerMonth * 0.45 * (averageDealRate * 0.25));
  const protectedDealsPerYear = Math.round(inquiriesPerMonth * 12);

  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-28 max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-20">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
          <span>BUILT FOR AUDIENCES OF 10K+</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-6xl text-[#F1F5F9] tracking-tight uppercase leading-[1.05]">
          PROTECT YOUR LEVERAGE. <span className="text-[#E11D48]">KEEP YOUR TIME</span>.
        </h1>
        <p className="text-xs sm:text-base text-[#94A3B8] max-w-xl mx-auto">
          Stop arguing with lowball sponsors and deciphering predatory clauses in DMs.
        </p>
      </div>

      {/* Interactive Creator Calculator with Hover Zoom */}
      <div className="safeguard-card bg-[#131926] border border-[#1E293B] rounded-3xl p-5 sm:p-12 shadow-[0_25px_60px_-15px_rgba(9,13,22,0.95)]">
        <div className="flex items-center gap-2.5 pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#1E293B]">
          <Calculator className="w-5 h-5 text-[#E11D48]" />
          <h2 className="font-display font-black text-lg sm:text-2xl text-[#F1F5F9] uppercase tracking-tight">
            Creator Value & Hours Saved Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Slider 1: Inquiries per month */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8] font-medium">Brand Inquiries Per Month:</span>
                <span className="text-[#F1F5F9] font-mono font-bold text-sm sm:text-base bg-[#090D16] px-3 py-0.5 rounded-lg border border-[#1E293B]">
                  {inquiriesPerMonth} inquiries
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                step="1"
                value={inquiriesPerMonth}
                onChange={(e) => setInquiriesPerMonth(Number(e.target.value))}
                className="w-full accent-[#E11D48] cursor-pointer h-2 bg-[#090D16] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono">
                <span>4 / mo</span>
                <span>20 / mo</span>
                <span>40 / mo</span>
              </div>
            </div>

            {/* Slider 2: Average Deal Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8] font-medium">Your Current Average Rate:</span>
                <span className="text-[#E11D48] font-mono font-bold text-sm sm:text-base bg-[#090D16] px-3 py-0.5 rounded-lg border border-[#1E293B]">
                  ${averageDealRate.toLocaleString()} USD
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={averageDealRate}
                onChange={(e) => setAverageDealRate(Number(e.target.value))}
                className="w-full accent-[#E11D48] cursor-pointer h-2 bg-[#090D16] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono">
                <span>$500</span>
                <span>$5,000</span>
                <span>$10,000+</span>
              </div>
            </div>
          </div>

          {/* Results (5 cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-[#E11D48]/40 rounded-2xl p-5 sm:p-6 space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
              PROJECTED MONTHLY VALUE
            </span>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B]">
                <span className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-400" /> Time Saved / Month:
                </span>
                <span className="text-base sm:text-lg font-bold text-[#F1F5F9] font-mono">
                  {hoursSavedPerMonth} hours
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B]">
                <span className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Extra Revenue / Mo:
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                  +${negotiatedUplift.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#E11D48]" /> Annual Deals Screened:
                </span>
                <span className="text-base sm:text-lg font-bold text-[#F1F5F9] font-mono">
                  {protectedDealsPerYear} deals
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('signup')}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_2px_14px_rgba(225,29,72,0.4)] active:scale-95"
            >
              DEPLOY CREATOR LINK
            </button>
          </div>
        </div>
      </div>

      {/* The 4 Predatory Traps (2 columns on phone & tablet) */}
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
            CONTRACT SHIELD
          </span>
          <h2 className="font-display font-black text-xl sm:text-3xl text-[#F1F5F9] uppercase tracking-tight">
            4 Red Flags Brands Try to Sneak In
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <div className="safeguard-card bg-[#131926] border border-[#1E293B] hover:border-[#E11D48]/50 rounded-2xl p-4 sm:p-6 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#E11D48] font-bold text-xs sm:text-sm">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>1. Perpetual Rights</span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Brands demand rights to use your face forever on television. VALLU restricts licenses to 60 days maximum.
              </p>
            </div>
          </div>

          <div className="safeguard-card bg-[#131926] border border-[#1E293B] hover:border-[#E11D48]/50 rounded-2xl p-4 sm:p-6 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#E11D48] font-bold text-xs sm:text-sm">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>2. Unpaid Whitelisting</span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Sponsors borrow your credibility for ads. VALLU automatically prices whitelisting as a separate +$1,200 licensing fee.
              </p>
            </div>
          </div>

          <div className="safeguard-card bg-[#131926] border border-[#1E293B] hover:border-[#E11D48]/50 rounded-2xl p-4 sm:p-6 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#F1F5F9] font-bold text-xs sm:text-sm">
                <AlertOctagon className="w-4 h-4 shrink-0 text-[#94A3B8]" />
                <span>3. Net-90 Delayed Payouts</span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Waiting 3 months after publishing is unfair. VALLU demands 50% advance deposits upon contract signing.
              </p>
            </div>
          </div>

          <div className="safeguard-card bg-[#131926] border border-[#1E293B] hover:border-[#E11D48]/50 rounded-2xl p-4 sm:p-6 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#F1F5F9] font-bold text-xs sm:text-sm">
                <AlertOctagon className="w-4 h-4 shrink-0 text-[#94A3B8]" />
                <span>4. Category Lockouts</span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#94A3B8] mt-2 leading-relaxed">
                A small fee shouldn't block you from working with others. VALLU caps exclusivity to 14 days and specific competitor SKUs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
