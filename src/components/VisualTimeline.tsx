import React from 'react';
import { Link2, Bot, Scale, DollarSign } from 'lucide-react';

export const VisualTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Bio Link Tap',
      desc: 'Sponsor opens vallu.bio/@you directly from your IG, YouTube, or X bio without login.',
      icon: Link2,
      color: 'text-[#F1F5F9]'
    },
    {
      num: '02',
      title: '60s Bot Screening',
      desc: 'Assistant gathers exact deliverables, budget, timelines, and rights duration in order.',
      icon: Bot,
      color: 'text-[#E11D48]'
    },
    {
      num: '03',
      title: '2-Counter Discovery',
      desc: 'Discovers maximum budget without volunteering your private floor. Scored 0–10.',
      icon: Scale,
      color: 'text-[#E11D48]'
    },
    {
      num: '04',
      title: 'Direct Creator Deposit',
      desc: 'You review the full transcript and accept. 0% take-rate, direct wire/Stripe payment.',
      icon: DollarSign,
      color: 'text-emerald-400'
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-1.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#94A3B8]">
          END-TO-END PIPELINE
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-[#F1F5F9] tracking-tight">
          From link click to bank deposit.
        </h2>
      </div>

      {/* Grid: 2 columns on phone & tablet, 4 on desktop (Phone same as tablet mode) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-[#131926] border border-[#1E293B] rounded-2xl p-4 sm:p-5 relative flex flex-col justify-between card-tilt-hover group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="font-display font-black text-xl sm:text-2xl text-[#94A3B8]/60 font-mono group-hover:text-[#E11D48] transition-colors">
                    {s.num}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#090D16] border border-[#1E293B] flex items-center justify-center">
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${s.color}`} />
                  </div>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-[#F1F5F9]">{s.title}</h3>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-1.5 sm:mt-2 leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#1E293B] flex items-center justify-between text-[9px] sm:text-[10px] text-[#94A3B8] font-mono">
                <span>Phase {idx + 1}</span>
                <span className="text-emerald-400">Automated</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
