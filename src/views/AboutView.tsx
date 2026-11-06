import React from 'react';
import { PageRoute } from '../types';
import { ShieldCheck, Heart, Zap, ArrowRight, Target, Users, Scale } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const principles = [
    {
      title: 'Creator Leverage First',
      desc: 'In traditional agency models, creators are pushed to accept bad deals for volume commissions. VALLU takes 0% commission, ensuring our software only works in the creator’s economic interest.',
      icon: Target,
      color: 'text-[#E11D48]'
    },
    {
      title: 'Deterministic Safety over Hallucinations',
      desc: 'Our brand assistant is not an uncontrollable chatbot that makes false promises. It operates on strict creator rules, bounded classifications, and confidential floor rates.',
      icon: Scale,
      color: 'text-orange-400'
    },
    {
      title: 'Total Transparency',
      desc: 'Every negotiation message, counter-offer rationale, and 0–10 score component is visible and copyable. No black-box algorithms or hidden sponsor arrangements.',
      icon: ShieldCheck,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-28 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
          <span>THE VALLU THESIS</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-6xl text-[#F1F5F9] tracking-tight">
          We believe creators should own their <span className="text-[#E11D48]">deals</span> and time.
        </h1>
        <p className="text-xs sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
          Content creators are the media companies of the 21st century. Yet their inbound brand business has been trapped in chaotic DMs, unread emails, and predatory contracts.
        </p>
      </div>

      {/* Story / Mission Grid — 2 columns on phone & tablet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 items-center">
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F1F5F9]">
            Why We Built VALLU
          </h2>
          <p>
            When a creator reaches 10,000, 100,000, or 1,000,000 followers, inbound brand sponsorship inquiries explode. But 90% of them are time sinks: lowball barter proposals, agencies asking for free media kits, and contracts with sneaked-in perpetuity clauses.
          </p>
          <p>
            Creators end up hiring agencies who demand 20% to 30% of their gross earnings, or spend their nights drafting manual replies instead of making world-class content.
          </p>
          <p className="text-[#F1F5F9] font-medium border-l-2 border-[#E11D48] pl-3.5 py-1">
            "VALLU was engineered to act as a 24/7 digital deal manager: one clean bio link, an intelligent brand inquiry bot, and instant contract protection."
          </p>
        </div>

        {/* Visual Callout */}
        <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-5 sm:p-8 space-y-3 sm:space-y-4 shadow-[0_20px_50px_rgba(9,13,22,0.9)]">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#E11D48]">
            VALLU Operational Architecture
          </div>
          <div className="space-y-2.5 sm:space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl flex justify-between items-center">
              <span className="text-[#94A3B8]">Brand Login Friction:</span>
              <span className="text-emerald-400 font-bold">0% (Public Chat)</span>
            </div>
            <div className="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl flex justify-between items-center">
              <span className="text-[#94A3B8]">Creator Deal Commission:</span>
              <span className="text-emerald-400 font-bold">0% (Direct Pay)</span>
            </div>
            <div className="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl flex justify-between items-center">
              <span className="text-[#94A3B8]">Offer Expiry Standard:</span>
              <span className="text-[#F1F5F9] font-bold">14 Days Strict</span>
            </div>
            <div className="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl flex justify-between items-center">
              <span className="text-[#94A3B8]">Negotiation Counter Cap:</span>
              <span className="text-[#E11D48] font-bold">Max 2 Counters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Principles (2 cols on mobile/tablet) */}
      <div className="space-y-6 pt-6 border-t border-[#1E293B]">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F1F5F9]">Our Founding Principles</h2>
          <p className="text-xs text-[#94A3B8]">The unbreakable guardrails that govern the VALLU software platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-[#131926] border border-[#1E293B] rounded-2xl p-5 sm:p-6 space-y-3 shadow-[0_10px_30px_rgba(9,13,22,0.8)]"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D48]" />
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#F1F5F9]">{p.title}</h3>
                <p className="text-[11px] sm:text-xs text-[#94A3B8] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 sm:mt-16 text-center">
        <button
          onClick={() => onNavigate('signup')}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all inline-flex items-center gap-2 group active:scale-95"
        >
          <span>Join the Creator Beta</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
