import React from 'react';
import { PageRoute } from '../types';
import { InteractivePhoneHero } from '../components/InteractivePhoneHero';
import { SafeguardsStrip } from '../components/SafeguardsStrip';
import { DealAnatomy } from '../components/DealAnatomy';
import { RedFlagRadar } from '../components/RedFlagRadar';
import { VisualTimeline } from '../components/VisualTimeline';
import { ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="relative pt-24 sm:pt-28 pb-28 sm:pb-32 space-y-12 sm:space-y-20">
      {/* High-Movement Ambient Neon Crimson Spotlights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[85vw] h-[500px] spotlight-red pointer-events-none rounded-full" />
      <div className="absolute top-[600px] right-5 w-[450px] h-[450px] spotlight-amber pointer-events-none rounded-full" />

      {/* Hero Section — Phone matches Tablet Mode */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12 text-center">
        {/* Punchy 2-Line Hook Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
            <span>VALLU DEAL OPERATING SYSTEM</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-7xl md:text-8xl text-[#F1F5F9] tracking-tight uppercase leading-[0.95]">
            BRAND DEALS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] via-rose-500 to-rose-400">
              ON AUTOPILOT
            </span>
          </h1>

          <p className="text-xs sm:text-base text-[#94A3B8] font-medium tracking-wide">
            One link. Zero lowballs. Direct sponsor payouts.
          </p>
        </div>

        {/* 3D-Tilt Interactive Phone Showcase with Animated 2s Name Rotator */}
        <div className="mt-8 sm:mt-12">
          <InteractivePhoneHero onNavigate={onNavigate} />
        </div>
      </section>

      {/* Section 2: Architectural Safeguards with Hover Zoom & Glow (2 cols on phone & tablet) */}
      <SafeguardsStrip />

      {/* Section 3: Value Multiplier & Feature Benefit Comparison */}
      <DealAnatomy />

      {/* Section 4: Automated Legal Radar */}
      <RedFlagRadar />

      {/* Section 5: End-to-End Visual Timeline (2 cols on phone & tablet) */}
      <VisualTimeline />

      {/* Section 6: Upgraded Bottom Conversion Block — Deep Slate #131926 with #1E293B Border */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="relative rounded-[32px] sm:rounded-[36px] bg-[#131926] border border-[#1E293B] hover:border-[#E11D48]/40 p-8 sm:p-16 overflow-hidden shadow-[0_30px_70px_rgba(9,13,22,0.95)] text-center space-y-4 sm:space-y-6 transition-colors duration-300">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E11D48]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#090D16] border border-[#1E293B] text-[11px] sm:text-xs text-[#94A3B8] font-mono">
            <span>READY IN 3 MINUTES</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-5xl text-[#F1F5F9] tracking-tight uppercase leading-tight">
            PUT YOUR SPONSOR INBOX
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-rose-400">
              ON AUTOPILOT
            </span>
          </h2>

          <p className="text-xs sm:text-base text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
            Never miss a five-figure brand deal. Never get exploited by unfair terms. Deploy your public bio link today.
          </p>

          <div className="pt-2 sm:pt-3">
            <button
              onClick={() => onNavigate('signup')}
              className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_8px_30px_rgba(225,29,72,0.45)] transition-all inline-flex items-center gap-2 group active:scale-95"
            >
              <span>CLAIM YOUR CREATOR LINK</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
