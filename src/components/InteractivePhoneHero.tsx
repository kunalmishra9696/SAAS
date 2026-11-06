import React, { useState, useRef, useEffect } from 'react';
import { PageRoute } from '../types';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  CheckCircle2,
  CheckCheck
} from 'lucide-react';

interface InteractivePhoneHeroProps {
  onNavigate: (route: PageRoute) => void;
}

export const InteractivePhoneHero: React.FC<InteractivePhoneHeroProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [activeDealCardTab, setActiveDealCardTab] = useState<'offer' | 'chat'>('offer');
  const [isApproved, setIsApproved] = useState(false);

  // Animated name rotator every 2s
  const rotatingNames = ['marcus', 'sarah', 'alex', 'elena', 'kai'];
  const [nameIndex, setNameIndex] = useState(0);
  const [isNameFading, setIsNameFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsNameFading(true);
      setTimeout(() => {
        setNameIndex((prev) => (prev + 1) % rotatingNames.length);
        setIsNameFading(false);
      }, 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentHandle = rotatingNames[nameIndex];

  // Smooth mouse tilt with damped interpolation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Tilt Container — Phone mode mirrors Tablet Mode proportions */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative perspective-container w-full max-w-4xl py-4 sm:py-6 flex justify-center items-center cursor-default select-none"
      >
        <div
          className="preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 w-full"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          }}
        >
          {/* Mobile Phone Mockup — Deep Slate #131926 with #1E293B Border */}
          <div className="w-[285px] sm:w-[310px] md:w-80 h-[480px] sm:h-[510px] md:h-[530px] bg-[#090D16] border-[2.5px] border-[#1E293B] rounded-[42px] sm:rounded-[44px] p-2.5 sm:p-3 shadow-[0_30px_70px_-20px_rgba(9,13,22,0.95)] relative overflow-hidden flex flex-col justify-between shrink-0">
            {/* Ambient Crimson Rim Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#E11D48]/15 rounded-full blur-[40px] pointer-events-none" />

            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-[#131926] border border-[#1E293B]/50 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#1E293B]" />
            </div>

            {/* Phone Screen: Deep Slate Structural Surface #131926 */}
            <div className="flex-1 bg-[#131926] rounded-[32px] sm:rounded-[34px] p-3 sm:p-3.5 flex flex-col justify-between border border-[#1E293B] overflow-hidden">
              <div>
                {/* Creator Header with Clean Monogram Badge */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#1E293B]">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#E11D48] to-rose-600 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm">
                    MV
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#F1F5F9]">Marcus Vance</span>
                      <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      vallu.bio/@{currentHandle}
                    </span>
                  </div>
                </div>

                {/* Micro Stats Bar */}
                <div className="grid grid-cols-2 gap-1.5 my-2.5">
                  <div className="bg-[#090D16]/70 p-1.5 rounded-lg border border-[#1E293B] text-center">
                    <span className="text-[8px] text-[#94A3B8] uppercase tracking-wider block font-mono">Audience</span>
                    <span className="text-[11px] font-bold text-[#F1F5F9] font-mono">480K Total</span>
                  </div>
                  <div className="bg-[#090D16]/70 p-1.5 rounded-lg border border-[#1E293B] text-center">
                    <span className="text-[8px] text-[#94A3B8] uppercase tracking-wider block font-mono">Starting Rate</span>
                    <span className="text-[11px] font-bold text-[#E11D48] font-mono">$4,000 USD</span>
                  </div>
                </div>

                {/* Real iOS/Messenger Style Chat Stream */}
                <div className="space-y-2 pt-1 text-[11px]">
                  {/* Brand incoming message */}
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="text-[8px] text-[#94A3B8] font-mono mb-0.5">Nike Running</div>
                    <div className="bg-[#1E293B]/80 text-[#F1F5F9] px-3 py-1.5 sm:py-2 rounded-2xl rounded-tl-sm border border-[#1E293B] leading-snug">
                      Hi Marcus! We have $3,500 allocated for a dedicated shoe review.
                    </div>
                  </div>

                  {/* VALLU Bot response bubble */}
                  <div className="flex flex-col items-end max-w-[88%] ml-auto">
                    <div className="text-[8px] text-[#E11D48] font-mono mb-0.5">VALLU Assistant</div>
                    <div className="bg-gradient-to-r from-[#E11D48] to-rose-600 text-white px-3 py-1.5 sm:py-2 rounded-2xl rounded-tr-sm shadow-md leading-snug">
                      Marcus's standard is $4,500. We can confirm $4,200 with 60-day digital rights & 50% deposit.
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[8px] text-[#94A3B8]">
                      <span>Delivered</span>
                      <CheckCheck className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                  </div>

                  {/* Brand approval bubble */}
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-[#1E293B]/80 text-[#F1F5F9] px-3 py-1.5 sm:py-2 rounded-2xl rounded-tl-sm border border-[#1E293B] leading-snug">
                      Approved at $4,200 with deposit. Sending terms over.
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Floor Indicator at bottom */}
              <div className="pt-2">
                <div className="w-full py-1.5 bg-[#090D16]/80 border border-[#1E293B] rounded-lg text-center text-[9px] font-mono text-[#94A3B8] flex items-center justify-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-[#E11D48]" />
                  <span>Floor rate encrypted server-side</span>
                </div>
              </div>
            </div>

            {/* Home indicator bar */}
            <div className="w-24 h-1 bg-[#1E293B] rounded-full mx-auto mt-2" />
          </div>

          {/* Floating Deal Card — Deep Slate #131926 with Neon Crimson #E11D48 Accents */}
          <div className="w-full max-w-[340px] sm:max-w-md bg-[#131926]/95 border border-[#1E293B] hover:border-[#E11D48]/50 rounded-3xl p-5 sm:p-6 shadow-[0_30px_70px_-15px_rgba(9,13,22,0.95)] backdrop-blur-2xl relative transition-colors duration-300">
            {/* Header: Brand Name + Verified Status + 14-Day Timer */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#F1F5F9]">Nike Running</h4>
                  <span className="text-[9px] sm:text-[10px] text-[#94A3B8] font-mono">Inbound Brand Campaign</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/30 text-[10px] font-mono text-[#E11D48]">
                <Clock className="w-3 h-3" />
                <span>14d Validity</span>
              </div>
            </div>

            {/* Big Clean Payout Number & Upward Discovery Pill */}
            <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-2xl bg-[#090D16]/80 border border-[#1E293B] flex items-center justify-between">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-mono text-[#94A3B8] block">
                  Final Agreed Rate
                </span>
                <div className="font-mono font-black text-2xl sm:text-4xl text-[#F1F5F9] tracking-tight">
                  $4,200
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-400">
                  +$700 Above Offer
                </span>
                <span className="text-[9px] text-[#94A3B8] block mt-1 font-mono">
                  Initial brand budget: $3,500
                </span>
              </div>
            </div>

            {/* 2 Clean View Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#090D16] border border-[#1E293B] rounded-xl text-xs mb-3.5 sm:mb-4">
              <button
                onClick={() => setActiveDealCardTab('offer')}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                  activeDealCardTab === 'offer'
                    ? 'bg-[#1E293B] text-[#F1F5F9] font-semibold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Deal Terms
              </button>
              <button
                onClick={() => setActiveDealCardTab('chat')}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                  activeDealCardTab === 'chat'
                    ? 'bg-[#1E293B] text-[#F1F5F9] font-semibold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Negotiation Transcript
              </button>
            </div>

            {/* Tab 1: Clean Structured Specs Table */}
            {activeDealCardTab === 'offer' && (
              <div className="space-y-1.5 sm:space-y-2 text-xs mb-4 sm:mb-5">
                <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-[#090D16]/60 border border-[#1E293B]">
                  <span className="text-[#94A3B8]">Deliverables</span>
                  <span className="text-[#F1F5F9] font-medium">1x YouTube Video + 1x Reel</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-[#090D16]/60 border border-[#1E293B]">
                  <span className="text-[#94A3B8]">Usage Rights</span>
                  <span className="text-emerald-400 font-medium">60 Days Organic (Perpetuity Blocked ✓)</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-[#090D16]/60 border border-[#1E293B]">
                  <span className="text-[#94A3B8]">Payment Milestones</span>
                  <span className="text-[#F1F5F9] font-mono font-medium">50% Advance Upon Contract</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-[#090D16]/60 border border-[#1E293B]">
                  <span className="text-[#94A3B8]">VALLU Commission</span>
                  <span className="text-emerald-400 font-mono font-bold">$0.00 (0% Cut)</span>
                </div>
              </div>
            )}

            {/* Tab 2: Clean iOS Chat Transcript View */}
            {activeDealCardTab === 'chat' && (
              <div className="space-y-2 text-xs mb-4 sm:mb-5 p-3 bg-[#090D16]/60 rounded-2xl border border-[#1E293B] font-sans">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">Brand:</span>
                  <p className="text-[#F1F5F9] text-[11px]">"We have $3,500 allocated for this review."</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-[#E11D48] font-mono shrink-0">Bot:</span>
                  <p className="text-white text-[11px]">"Marcus's standard is $4,500. We can do $4,200 with 60-day rights & 50% advance."</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-emerald-400 font-mono shrink-0">Brand:</span>
                  <p className="text-emerald-300 text-[11px]">"Approved at $4,200. Ready to execute."</p>
                </div>
              </div>
            )}

            {/* Prominent Action Button: Neon Crimson #E11D48 */}
            {isApproved ? (
              <div className="py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deal Approved! Direct Invoice Dispatched</span>
              </div>
            ) : (
              <button
                onClick={() => setIsApproved(true)}
                className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs tracking-wide shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Accept Deal & Send Invoice ($4,200)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Claim Bio Link Strip — Slate Background #131926 with Slate Border #1E293B */}
      <div className="mt-6 sm:mt-8 flex flex-row items-center gap-2 bg-[#131926] border border-[#1E293B] rounded-full p-1.5 pl-4 sm:pl-5 max-w-[340px] sm:max-w-md w-full shadow-[0_10px_30px_rgba(9,13,22,0.8)]">
        <span className="text-xs text-[#94A3B8] font-mono shrink-0">vallu.bio/@</span>
        <div className="flex-1 min-w-0 flex items-center">
          <span
            className={`text-xs text-[#F1F5F9] font-mono font-semibold transition-all duration-200 ${
              isNameFading ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentHandle}
          </span>
          <span className="w-1.5 h-3 bg-[#E11D48] animate-pulse ml-1 inline-block" />
        </div>
        <button
          onClick={() => onNavigate('signup')}
          className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#E11D48] hover:bg-rose-600 text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase transition-all whitespace-nowrap shadow-[0_2px_12px_rgba(225,29,72,0.4)] active:scale-95"
        >
          CLAIM YOUR LINK
        </button>
      </div>
    </div>
  );
};
