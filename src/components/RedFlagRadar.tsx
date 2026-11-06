import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const RedFlagRadar: React.FC = () => {
  const [neutralizedFlags, setNeutralizedFlags] = useState<string[]>([
    'perpetuity',
    'whitelisting'
  ]);

  const flags = [
    {
      id: 'perpetuity',
      title: 'Perpetual Worldwide Rights',
      danger: 'Allows brand to use your face on billboard/TV in 2040 without paying extra.',
      solution: 'Neutralized: Enforces 60-day digital cap or demands 400% commercial buyout.'
    },
    {
      id: 'whitelisting',
      title: 'Dark Ads / Unpaid Whitelisting',
      danger: 'Brand runs paid ads through your handle to steal personal organic credibility.',
      solution: 'Neutralized: Automatically priced as separate +$1,200 licensing add-on.'
    },
    {
      id: 'net90',
      title: 'Net-90 Payment Terms',
      danger: 'You deliver content in January and wait until May for payment.',
      solution: 'Neutralized: Demands 50% advance deposit upon contract signing.'
    },
    {
      id: 'exclusivity',
      title: 'Blanket Category Lockout',
      danger: '$500 deal prevents you from partnering with any other tech brand for 6 months.',
      solution: 'Neutralized: Caps exclusivity to 14 days and specific competitor product only.'
    }
  ];

  const toggleFlag = (id: string) => {
    if (neutralizedFlags.includes(id)) {
      setNeutralizedFlags(neutralizedFlags.filter((f) => f !== id));
    } else {
      setNeutralizedFlags([...neutralizedFlags, id]);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-1.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
          AUTOMATED LEGAL RADAR
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-[#F1F5F9] tracking-tight">
          Never sign away your rights again.
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Click any predatory clause below to see how VALLU detects and neutralizes it before you review.
        </p>
      </div>

      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-[0_20px_50px_rgba(9,13,22,0.9)]">
        {/* Visual Animated Radar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-6 bg-[#090D16]/80 border border-[#1E293B] rounded-2xl relative overflow-hidden">
          {/* Radar Circles */}
          <div className="w-48 sm:w-56 h-48 sm:h-56 rounded-full border border-[#E11D48]/25 relative flex items-center justify-center">
            <div className="w-36 sm:w-40 h-36 sm:h-40 rounded-full border border-[#E11D48]/20 flex items-center justify-center">
              <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border border-[#E11D48]/25 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#E11D48] shadow-[0_0_12px_#E11D48]" />
              </div>
            </div>

            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-[#E11D48]/20" />
              <div className="h-full w-px bg-[#E11D48]/20 absolute" />
            </div>

            {/* Rotating Radar Sweep */}
            <div className="absolute inset-0 rounded-full overflow-hidden animate-radar pointer-events-none">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#E11D48]/35 to-transparent origin-bottom-right" />
            </div>

            {/* Blips */}
            <div className="absolute top-8 sm:top-10 right-10 sm:right-12 w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-ping" />
            <div className="absolute bottom-10 sm:bottom-12 left-8 sm:left-10 w-2 h-2 rounded-full bg-rose-500" />
          </div>

          <div className="mt-4 text-center">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#94A3B8]">Radar Status:</span>
            <div className="text-xs font-bold text-emerald-400 font-mono">
              {neutralizedFlags.length} of 4 Predatory Traps Neutralized
            </div>
          </div>
        </div>

        {/* Interactive Clause Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
          {flags.map((item) => {
            const isProtected = neutralizedFlags.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleFlag(item.id)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isProtected
                    ? 'bg-[#090D16]/90 border-emerald-500/30 shadow-[0_4px_16px_rgba(16,185,129,0.08)]'
                    : 'bg-[#090D16]/90 border-[#E11D48]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {isProtected ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
                    )}
                    <span className="text-xs font-bold text-[#F1F5F9]">{item.title}</span>
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isProtected
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-[#E11D48]/20 text-[#E11D48] font-bold'
                    }`}
                  >
                    {isProtected ? 'Protected ✓' : 'Threat Active !'}
                  </span>
                </div>

                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-1 leading-snug">
                  {isProtected ? item.solution : item.danger}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
