import React from 'react';
import { Shield, Lock, Scale, Clock } from 'lucide-react';

export const SafeguardsStrip: React.FC = () => {
  const safeguards = [
    {
      metric: '0%',
      title: 'Platform Commission',
      problem: 'Agencies take 20%–30% of your sponsor payout.',
      solution: 'VALLU takes $0.00. Brands pay you directly to your bank.',
      icon: Shield,
      accent: 'text-emerald-400',
      badge: 'Zero Cut'
    },
    {
      metric: '100%',
      title: 'Floor Rate Privacy',
      problem: 'Leaking minimums causes sponsors to lowball.',
      solution: 'Floor is encrypted. Assistant discovers budget first.',
      icon: Lock,
      accent: 'text-[#E11D48]',
      badge: 'Encrypted'
    },
    {
      metric: '2-Max',
      title: 'Negotiation Counters',
      problem: 'Endless bargaining in DMs wastes days.',
      solution: '2-counter engine discovers max budget in 60s.',
      icon: Scale,
      accent: 'text-[#E11D48]',
      badge: 'Fast Discovery'
    },
    {
      metric: '14-Day',
      title: 'Auto-Decline Engine',
      problem: 'Unanswered pitches linger forever.',
      solution: 'Automatic polite decline purges stale offers.',
      icon: Clock,
      accent: 'text-[#94A3B8]',
      badge: 'Zero Clutter'
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
          ARCHITECTURAL SAFEGUARDS
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-[#F1F5F9] tracking-tight">
          Engineered to solve real deal friction.
        </h2>
      </div>

      {/* Grid: 2 columns on phone & tablet, 4 on desktop (User requirement: phone same as tablet mode) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {safeguards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="safeguard-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#1E293B] bg-[#131926] cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[8px] sm:text-[9px] font-mono text-[#94A3B8] uppercase tracking-wider bg-[#090D16] px-2 py-0.5 rounded-full border border-[#1E293B]">
                    {item.badge}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center">
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.accent}`} />
                  </div>
                </div>

                <div className="font-display font-black text-2xl sm:text-4xl text-[#F1F5F9] font-mono tracking-tight">
                  {item.metric}
                </div>
                <div className="font-bold text-xs sm:text-sm text-[#F1F5F9] mt-1">
                  {item.title}
                </div>
              </div>

              {/* Problem vs Solution on hover */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#1E293B] space-y-1.5 sm:space-y-2 text-xs">
                <div className="text-[#94A3B8] text-[10px] sm:text-[11px] leading-snug">
                  <span className="text-[#E11D48] font-medium">Friction:</span> {item.problem}
                </div>
                <div className="text-[#F1F5F9] text-[10px] sm:text-[11px] leading-snug">
                  <span className="text-emerald-400 font-medium">VALLU:</span> {item.solution}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
