import React, { useState } from 'react';
import { PageRoute } from '../types';
import {
  Link2,
  Bot,
  Scale,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Claim Your Link & Set Boundaries',
      subtitle: '2–4 Minute Setup',
      desc: 'Reserve your verified link (vallu.bio/@you) and configure your confidential preferred rate, minimum floor price, and excluded categories.',
      icon: Link2,
      accent: 'text-[#E11D48]',
      badge: 'Private Settings'
    },
    {
      num: '02',
      title: 'Autonomous Semi-AI Inquiry Screening',
      subtitle: 'Zero Brand Friction',
      desc: 'Brands click your bio link and chat directly with your assistant. It gathers campaign deliverables, budget, timelines, and rights duration in order.',
      icon: Bot,
      accent: 'text-rose-400',
      badge: 'Deterministic Safety'
    },
    {
      num: '03',
      title: 'Bounded Negotiation & Scoring',
      subtitle: 'Max 2 Counter-Offers',
      desc: 'The assistant negotiates upward toward your target rate without ever exposing your floor price. If workable, it calculates the transparent deal score.',
      icon: Scale,
      accent: 'text-[#E11D48]',
      badge: 'Transparent Formula'
    },
    {
      num: '04',
      title: 'Direct Creator Payout',
      subtitle: '100% Creator Authority',
      desc: 'Review the full conversation transcript and make the final call. 0% commission take-rate, direct wire/Stripe payouts straight to your bank.',
      icon: ShieldCheck,
      accent: 'text-emerald-400',
      badge: 'Direct Creator Payment'
    }
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-28 max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-20">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
          <span>THE 4-STAGE PIPELINE</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-6xl text-[#F1F5F9] tracking-tight uppercase leading-[1.05]">
          HOW VALLU OPERATES
        </h1>
        <p className="text-xs sm:text-base text-[#94A3B8] max-w-xl mx-auto">
          From the first bio link tap to the final bank deposit. Structured, shielded, and automated.
        </p>
      </div>

      {/* 4 Connected Step Cards with Zoom and Glow on Hover — 2 columns on phone & tablet */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStep === idx;
          return (
            <div
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`safeguard-card p-4 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#131926] border-[#E11D48] shadow-[0_15px_40px_rgba(225,29,72,0.25)]'
                  : 'bg-[#131926] border-[#1E293B]'
              }`}
            >
              <div className="space-y-3 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-2xl sm:text-4xl text-[#94A3B8]/50 font-mono">
                    {s.num}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono px-2 sm:px-3 py-0.5 rounded-full bg-[#090D16] border border-[#1E293B] text-[#94A3B8]">
                    {s.badge}
                  </span>
                </div>

                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-[#E11D48]" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm sm:text-xl text-[#F1F5F9]">{s.title}</h3>
                  <div className="text-[11px] sm:text-xs text-[#E11D48] font-medium mt-0.5 sm:mt-1">{s.subtitle}</div>
                  <p className="text-[10px] sm:text-sm text-[#94A3B8] mt-2 sm:mt-3 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-8 pt-3 sm:pt-4 border-t border-[#1E293B] flex items-center justify-between text-[10px] sm:text-xs text-[#94A3B8] font-mono">
                <span>Phase {idx + 1} of 4</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Automated
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison: Instagram DMs vs VALLU (2 columns on phone & tablet) */}
      <div className="border border-[#1E293B] rounded-3xl bg-[#131926] p-5 sm:p-12 shadow-[0_20px_50px_rgba(9,13,22,0.95)]">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-2">
          <h2 className="font-display font-black text-xl sm:text-3xl text-[#F1F5F9] uppercase tracking-tight">
            UNSTRUCTURED DMS VS THE VALLU ENGINE
          </h2>
          <p className="text-xs text-[#94A3B8]">
            See the concrete difference between losing deals in buried DMs and using an automated deal OS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm">
          {/* Old Way */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#090D16]/90 border border-[#E11D48]/30 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-[#E11D48] font-bold uppercase tracking-wider font-mono text-xs">
              <X className="w-4 h-4 text-[#E11D48]" />
              <span>The Old Way: Instagram & Email DMs</span>
            </div>
            <ul className="space-y-2.5 sm:space-y-3 text-[#94A3B8] text-xs">
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] shrink-0 font-bold">✕</span>
                <span>Vague sponsors ask for "media kit" without disclosing approved budgets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] shrink-0 font-bold">✕</span>
                <span>Predatory contracts sneak in perpetual worldwide rights for a single reel fee.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] shrink-0 font-bold">✕</span>
                <span>Creators waste 10+ hours a week manually answering lowball barter requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48] shrink-0 font-bold">✕</span>
                <span>Net-90 payment terms go unpaid or get forgotten in messy DM threads.</span>
              </li>
            </ul>
          </div>

          {/* VALLU Way */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#090D16]/90 border border-emerald-500/30 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider font-mono text-xs">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>The VALLU Way: Automated & Shielded</span>
            </div>
            <ul className="space-y-2.5 sm:space-y-3 text-[#F1F5F9] text-xs">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                <span>Assistant asks for budget first before disclosing any creator rate.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                <span>Contract radar highlights perpetuity, whitelisting, and delayed payout traps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                <span>Transparent score and 14-day auto-decline countdown keep inbox clean.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                <span>Direct payout to your bank with 0% platform take-rate.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('signup')}
          className="px-9 py-4 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_8px_30px_rgba(225,29,72,0.45)] transition-all inline-flex items-center gap-2 group active:scale-95"
        >
          <span>CLAIM YOUR CREATOR LINK</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
