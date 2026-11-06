import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, Check, X } from 'lucide-react';

export const DealAnatomy: React.FC = () => {
  const [mode, setMode] = useState<'with' | 'without'>('with');

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
          PROVEN VALUE MULTIPLIER
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-[#F1F5F9] tracking-tight">
          How VALLU transforms your deal revenue.
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Toggle below to see the exact difference between an unshielded DM and a VALLU-negotiated partnership.
        </p>

        {/* Mode Toggle Switch */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <div className="p-1 bg-[#131926] border border-[#1E293B] rounded-full flex items-center">
            <button
              onClick={() => setMode('without')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all ${
                mode === 'without'
                  ? 'bg-[#E11D48]/20 text-[#E11D48] border border-[#E11D48]/30'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Without VALLU (Chaotic DM)
            </button>
            <button
              onClick={() => setMode('with')}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                mode === 'with'
                  ? 'bg-gradient-to-r from-[#E11D48] to-rose-600 text-white shadow-[0_2px_14px_rgba(225,29,72,0.4)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              With VALLU Protection ✓
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Blueprint Card — Deep Slate #131926 */}
      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-4 sm:p-10 shadow-[0_25px_60px_-15px_rgba(9,13,22,0.95)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-stretch">
          {/* Left Column: Visual Terms Specs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1E293B]">
              {mode === 'with' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-[#E11D48]" />
              )}
              <h3 className="font-display font-bold text-base sm:text-lg text-[#F1F5F9]">
                {mode === 'with' ? 'VALLU Shielded Agreement' : 'Unprotected Direct Message Pitch'}
              </h3>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs">
              {/* Feature 1 */}
              <div className="p-3 rounded-2xl bg-[#090D16]/80 border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[#94A3B8] text-[9px] sm:text-[10px] uppercase font-mono block">Budget Discovery</span>
                  <span className="text-[#F1F5F9] font-medium text-[11px] sm:text-xs">
                    {mode === 'with' ? 'Discovered $3,200 via 2-counter assistant' : 'Sponsor offered $800 lowball'}
                  </span>
                </div>
                {mode === 'with' ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-[#E11D48] shrink-0" />
                )}
              </div>

              {/* Feature 2 */}
              <div className="p-3 rounded-2xl bg-[#090D16]/80 border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[#94A3B8] text-[9px] sm:text-[10px] uppercase font-mono block">Licensing Rights</span>
                  <span className="text-[#F1F5F9] font-medium text-[11px] sm:text-xs">
                    {mode === 'with' ? 'Capped at 60 Days Organic' : 'Perpetual Forever Rights Demanded'}
                  </span>
                </div>
                {mode === 'with' ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-[#E11D48] shrink-0" />
                )}
              </div>

              {/* Feature 3 */}
              <div className="p-3 rounded-2xl bg-[#090D16]/80 border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[#94A3B8] text-[9px] sm:text-[10px] uppercase font-mono block">Paid Whitelisting</span>
                  <span className="text-[#F1F5F9] font-medium text-[11px] sm:text-xs">
                    {mode === 'with' ? '+$1,200 Amplification Fee Added' : 'Uncredited Dark Ads Bundled for Free'}
                  </span>
                </div>
                {mode === 'with' ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-[#E11D48] shrink-0" />
                )}
              </div>

              {/* Feature 4 */}
              <div className="p-3 rounded-2xl bg-[#090D16]/80 border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[#94A3B8] text-[9px] sm:text-[10px] uppercase font-mono block">Payment Terms</span>
                  <span className="text-[#F1F5F9] font-medium text-[11px] sm:text-xs">
                    {mode === 'with' ? '50% Advance Upon Signing' : 'Net-90 Days After Publishing'}
                  </span>
                </div>
                {mode === 'with' ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-[#E11D48] shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Financial Outcome Card */}
          <div
            className={`p-5 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between ${
              mode === 'with'
                ? 'bg-gradient-to-br from-[#131926] to-[#090D16] border-emerald-500/40 shadow-[0_10px_35px_rgba(16,185,129,0.15)]'
                : 'bg-gradient-to-br from-[#131926] to-[#090D16] border-[#E11D48]/30'
            }`}
          >
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
                {mode === 'with' ? 'Net Creator Payout' : 'Exploited Payout'}
              </span>
              <div className="font-mono font-black text-3xl sm:text-5xl text-[#F1F5F9] tracking-tight my-2">
                {mode === 'with' ? '$4,400' : '$640'}
              </div>
              <p className="text-xs text-[#94A3B8]">
                {mode === 'with'
                  ? 'Base ($3,200) + Whitelisting ($1,200) with 0% platform fee.'
                  : 'Lowball $800 minus typical 20% agency cut (-$160).'}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 border-t border-[#1E293B] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Creator Earnings Multiplier:</span>
                <span
                  className={`font-mono font-bold ${
                    mode === 'with' ? 'text-emerald-400' : 'text-[#E11D48]'
                  }`}
                >
                  {mode === 'with' ? '+587% Increase' : 'Loss of $3,760'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Legal Rights Protection:</span>
                <span
                  className={`font-mono font-bold ${
                    mode === 'with' ? 'text-emerald-400' : 'text-[#E11D48]'
                  }`}
                >
                  {mode === 'with' ? '100% Retained' : 'Perpetual Trap'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
