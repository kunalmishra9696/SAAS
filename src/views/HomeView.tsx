import React, { useEffect, useRef, useState } from 'react';
import { PageRoute } from '../types';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronRight,
  CircleHelp, LockKeyhole, MessageCircle, ShieldCheck, Sparkles,
  TrendingUp, Zap, Play, MousePointer2, Globe2, Clock3
} from 'lucide-react';

interface HomeViewProps { onNavigate: (route: PageRoute) => void; }

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal-up ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
};

const ChatLine: React.FC<{ side: 'brand' | 'assistant'; children: React.ReactNode; time: string }> = ({ side, children, time }) => (
  <div className={`flex ${side === 'brand' ? 'justify-start' : 'justify-end'}`}>
    <div className={`max-w-[86%] rounded-2xl px-4 py-3 ${side === 'brand' ? 'bg-white/[0.055] border border-white/[0.07] rounded-tl-md' : 'bg-[#F0443E] text-white rounded-tr-md'}`}>
      <p className="text-[11px] sm:text-xs leading-relaxed">{children}</p>
      <span className={`mt-2 block text-[9px] font-mono ${side === 'brand' ? 'text-white/35' : 'text-white/60'}`}>{time}</span>
    </div>
  </div>
);

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [demoStep, setDemoStep] = useState(0);
  const [activeFeature, setActiveFeature] = useState('page');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setDemoStep((step) => (step + 1) % 4), 3600);
    return () => window.clearInterval(timer);
  }, []);

  const features = [
    { id: 'page', no: '01', title: 'Your page', line: 'A personal home for every collaboration.', icon: Globe2, color: 'text-[#FF963F]' },
    { id: 'assistant', no: '02', title: 'Your assistant', line: 'Brand enquiries, handled on your terms.', icon: MessageCircle, color: 'text-[#F0443E]' },
    { id: 'offers', no: '03', title: 'Your offers', line: 'Every term, score and conversation in one place.', icon: TrendingUp, color: 'text-[#FF963F]' },
    { id: 'control', no: '04', title: 'Your decision', line: 'You stay in control. Always.', icon: ShieldCheck, color: 'text-[#F0443E]' },
  ];

  const benefits = [
    { icon: LockKeyhole, title: 'Your floor stays private', text: 'Your minimum rate and private rules never appear in a brand conversation.' },
    { icon: CircleHelp, title: 'No more lost details', text: 'Budget, deliverables, usage rights and timelines arrive together.' },
    { icon: ShieldCheck, title: 'You make the call', text: 'The assistant can prepare a proposal. Only you can accept a deal.' },
  ];

  return (
    <div className="page-shell">
      <section className="relative min-h-[760px] lg:min-h-[850px] flex items-center pt-28 pb-24">
        <div className="hero-grid absolute inset-x-0 top-0 h-[780px] pointer-events-none opacity-70" />
        <div className="absolute -top-40 left-[45%] h-[620px] w-[620px] rounded-full bg-[#F0443E]/[0.075] blur-[145px] pointer-events-none" />
        <div className="absolute top-56 right-[-220px] h-[480px] w-[480px] rounded-full bg-[#FF963F]/[0.045] blur-[130px] pointer-events-none" />
        <div className="site-container relative z-10 grid lg:grid-cols-[1.02fr_.98fr] items-center gap-14 lg:gap-16">
          <div className="max-w-[620px]">
            <div className="site-eyebrow mb-7">A better way to work with brands</div>
            <h1 className="font-display text-[clamp(3.5rem,7.4vw,6.7rem)] font-semibold leading-[.88] tracking-[-.075em]">
              Make your<br />
              next deal<br />
              <span className="text-[#F0443E]">a better one.</span>
            </h1>
            <p className="mt-8 max-w-[420px] text-[14px] leading-[1.85] text-[#A3A4AA]">
              One link for your work. One assistant for brand enquiries. Every collaboration, on your terms.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button className="site-button site-button-primary" onClick={() => onNavigate('signup')}>
                Get your creator link <ArrowUpRight size={15}/>
              </button>
              <button className="site-button site-button-secondary" onClick={() => document.getElementById('product-preview')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play size={13}/> See how it works
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] text-[#85868C]">
              <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#F0443E]"/> No commission on your deals</span>
              <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#F0443E]"/> You approve every deal</span>
            </div>
            <div className="mt-14 flex items-center gap-4 text-[9px] font-mono uppercase tracking-[.16em] text-[#62636A]">
              <span>BUILT FOR INDEPENDENT CREATORS</span><span className="h-px w-12 bg-[#393A40]"/><span>V1 · PRIVATE BETA</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="hero-orbit absolute left-[8%] top-[12%] h-[80%] w-[84%] pointer-events-none" />
            <div className="hero-orbit absolute left-[17%] top-[5%] h-[92%] w-[68%] pointer-events-none opacity-50" style={{ transform: 'rotate(27deg)' }} />
            <div className="absolute -right-2 top-12 h-28 w-28 rounded-full bg-[#F0443E]/15 blur-3xl"/>
            <div className="relative panel rounded-[26px] p-4 sm:p-5 backdrop-blur-xl hero-float">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-1 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0443E] text-white font-display font-bold text-xs">V.</div>
                  <div><p className="text-[11px] font-semibold">Creator workspace</p><p className="text-[9px] text-[#777980]">Private overview</p></div>
                </div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] text-[#A3A4AA]">LIVE PREVIEW</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 py-4">
                {[['01','New enquiries'],['02','Terms checked'],['03','Your decision']].map(([n,t]) => (
                  <div key={n} className="rounded-xl bg-white/[0.035] border border-white/[0.055] p-3">
                    <p className="font-mono text-[9px] text-[#F0443E]">{n}</p><p className="mt-2 text-[9px] text-[#A3A4AA]">{t}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F12] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div><p className="text-[10px] text-[#777980]">BRAND CONVERSATION</p><p className="mt-1 text-xs font-semibold">New campaign enquiry</p></div>
                  <span className="flex items-center gap-1.5 text-[9px] text-emerald-400"><span className="demo-dot h-1.5 w-1.5 rounded-full bg-emerald-400"/> Assistant active</span>
                </div>
                <div className="space-y-3 min-h-[192px]">
                  <ChatLine side="brand" time="10:41 AM">Hi! We’re planning a launch campaign and would love to work together.</ChatLine>
                  {demoStep >= 1 && <ChatLine side="assistant" time="10:41 AM">Thanks for reaching out. What budget have you set aside for this collaboration?</ChatLine>}
                  {demoStep >= 2 && <ChatLine side="brand" time="10:42 AM">We have a budget of ₹85,000 for one dedicated video.</ChatLine>}
                  {demoStep >= 3 && <ChatLine side="assistant" time="10:42 AM">Got it. I’ll collect the usage and timeline details so the creator can review a complete proposal.</ChatLine>}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3">
                  <span className="text-[9px] text-[#777980]">A guided enquiry. Not an auto-accept.</span>
                  <span className="font-mono text-[9px] text-[#F0443E]">{['01 / 04','02 / 04','03 / 04','04 / 04'][demoStep]}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F0443E]/[0.10] border border-[#F0443E]/20 px-4 py-3">
                <div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#F0443E]"/><span className="text-[10px] text-[#E8E5E2]">Creator rules stay in control</span></div>
                <ArrowUpRight size={14} className="text-[#F0443E]"/>
              </div>
            </div>
            <div className="hero-float-delayed absolute -left-8 top-[17%] hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-[#1A1B20] px-3 py-2.5 shadow-2xl">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF963F]/15"><Zap size={14} className="text-[#FF963F]"/></div>
              <div><p className="text-[9px] text-[#777980]">INQUIRY STATUS</p><p className="text-[10px] font-semibold">Details captured</p></div>
            </div>
            <div className="hero-float absolute -right-5 bottom-[10%] hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-[#1A1B20] px-3 py-2.5 shadow-2xl">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10"><LockKeyhole size={14} className="text-emerald-400"/></div>
              <div><p className="text-[9px] text-[#777980]">PRIVATE TERMS</p><p className="text-[10px] font-semibold">Never shared</p></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[9px] font-mono uppercase tracking-[.18em] text-[#65666D] md:flex"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={12}/></div>
      </section>

      <section className="border-y border-white/[0.075] bg-white/[0.018]">
        <div className="site-container grid grid-cols-2 md:grid-cols-4">
          {[
            ['01','One public creator page'],['02','One guided assistant'],['03','A transparent offer inbox'],['04','Your final decision']
          ].map(([n,t], i) => <div key={n} className={`flex items-center gap-4 py-6 ${i ? 'md:border-l md:border-white/[0.08] md:pl-7' : ''} ${i % 2 ? 'pl-4' : ''} md:pl-7 first:md:pl-0`}>
            <span className="font-mono text-[10px] text-[#F0443E]">{n}</span><span className="text-[10px] sm:text-xs text-[#BFC0C4]">{t}</span>
          </div>)}
        </div>
      </section>

      <section id="product-preview" className="site-section">
        <div className="site-container">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div><div className="site-eyebrow">Your collaboration system</div><h2 className="section-heading">From first hello<br/>to <span className="accent">final terms.</span></h2></div>
            <p className="section-copy">One connected experience for your public presence, brand conversations and deal decisions.</p>
          </Reveal>
          <div className="mt-14 grid lg:grid-cols-[.78fr_1.22fr] gap-5">
            <div className="grid grid-cols-1 gap-2.5">
              {features.map((f) => {
                const Icon = f.icon;
                const active = activeFeature === f.id;
                return <button key={f.id} onClick={() => setActiveFeature(f.id)} className={`card-lift rounded-2xl border p-5 text-left transition-all ${active ? 'border-[#F0443E]/55 bg-[#F0443E]/[0.08]' : 'border-white/[0.09] bg-white/[0.025] hover:bg-white/[0.045]'}`}>
                  <div className="flex items-start justify-between"><span className="font-mono text-[10px] text-[#777980]">{f.no}</span><Icon size={17} className={f.color}/></div>
                  <div className="mt-5 flex items-end justify-between gap-3"><div><p className="text-[16px] font-semibold">{f.title}</p><p className="mt-1.5 text-[11px] text-[#92939A]">{f.line}</p></div><ChevronRight size={16} className={active ? 'text-[#F0443E]' : 'text-[#63646A]'}/></div>
                </button>;
              })}
            </div>
            <div className="panel relative min-h-[430px] overflow-hidden rounded-[26px] p-5 sm:p-8">
              <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#F0443E]/[0.09] blur-[100px]"/>
              {activeFeature === 'page' && <div className="relative z-10 h-full">
                <div className="flex items-center justify-between"><span className="text-[9px] font-mono tracking-[.16em] text-[#777980]">PUBLIC CREATOR PAGE</span><span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[9px] text-emerald-300">PUBLISHED PAGE</span></div>
                <div className="mt-8 grid sm:grid-cols-[1fr_180px] gap-8 items-center">
                  <div><p className="text-[10px] text-[#FF963F]">CREATOR / 01</p><h3 className="mt-3 font-display text-4xl sm:text-5xl leading-[.95] font-semibold tracking-[-.06em]">Make<br/>something<br/><span className="text-[#F0443E]">matter.</span></h3><p className="mt-5 max-w-[250px] text-[11px] leading-relaxed text-[#9C9DA3]">A considered home for your work, audience and next collaboration.</p><div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F0443E] px-4 py-2.5 text-[10px] font-semibold">Work with me <ArrowUpRight size={12}/></div></div>
                  <div className="relative mx-auto h-[195px] w-[160px] rounded-[80px] border border-white/15 bg-gradient-to-br from-[#363238] via-[#222329] to-[#111216]"><div className="absolute inset-3 rounded-[75px] border border-white/10"/><div className="absolute bottom-5 left-1/2 h-24 w-20 -translate-x-1/2 rounded-t-[55px] bg-gradient-to-b from-[#F0B89C] to-[#7A4B40]"/><div className="absolute bottom-[98px] left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-[#D69B7C]"/><div className="absolute bottom-[146px] left-1/2 h-7 w-[70px] -translate-x-1/2 rounded-t-full bg-[#242025]"/></div>
                </div>
                <div className="mt-9 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-5">{[['CONTENT','Design'],['AUDIENCE','Self-reported'],['COLLABS','Selected work']].map(([a,b])=><div key={a}><p className="font-mono text-[8px] text-[#777980]">{a}</p><p className="mt-1 text-[10px] text-[#D2D0CD]">{b}</p></div>)}</div>
              </div>}
              {activeFeature === 'assistant' && <div className="relative z-10">
                <div className="flex items-center justify-between"><span className="text-[9px] font-mono tracking-[.16em] text-[#777980]">BRAND ASSISTANT</span><MessageCircle size={17} className="text-[#F0443E]"/></div>
                <h3 className="mt-7 max-w-[430px] font-display text-3xl sm:text-4xl font-semibold leading-tight">A better first conversation.</h3><p className="mt-3 max-w-[390px] text-[11px] leading-relaxed text-[#9C9DA3]">One prompt at a time. No brand account. No endless back-and-forth.</p>
                <div className="mt-8 max-w-[470px] space-y-3"><ChatLine side="brand" time="11:08">We’re interested in a campaign. Could you share availability?</ChatLine><ChatLine side="assistant" time="11:08">Absolutely. Which brand are you reaching out from?</ChatLine><ChatLine side="brand" time="11:09">Northstar. We have a launch in December.</ChatLine><div className="ml-auto flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[9px] text-[#BFC0C4]"><span className="demo-dot h-1.5 w-1.5 rounded-full bg-[#FF963F]"/> Gathering campaign details</div></div>
              </div>}
              {activeFeature === 'offers' && <div className="relative z-10">
                <div className="flex items-center justify-between"><span className="text-[9px] font-mono tracking-[.16em] text-[#777980]">OFFER REVIEW</span><span className="text-[9px] text-[#FF963F]">ILLUSTRATIVE</span></div>
                <h3 className="mt-7 font-display text-3xl sm:text-4xl font-semibold">Know what<br/>you’re agreeing to.</h3>
                <div className="mt-8 grid sm:grid-cols-[1fr_180px] gap-5">
                  <div className="space-y-3">{[['Budget','₹85,000'],['Deliverables','1 dedicated video'],['Usage rights','60 days · organic'],['Payment','50% upfront'],['Exclusivity','Not requested']].map(([a,b])=><div key={a} className="flex justify-between gap-4 border-b border-white/[0.07] pb-2.5"><span className="text-[10px] text-[#8D8E95]">{a}</span><span className="text-[10px] text-[#F0EFEC]">{b}</span></div>)}</div>
                  <div className="rounded-2xl border border-[#F0443E]/25 bg-[#F0443E]/[0.07] p-4"><p className="text-[9px] font-mono text-[#A3A4AA]">OFFER SCORE</p><p className="mt-3 font-display text-5xl font-semibold text-[#FF963F]">8.6<span className="text-sm text-[#9B9CA2]">/10</span></p><div className="mt-4 h-1.5 rounded-full bg-white/10"><div className="h-1.5 w-[86%] rounded-full bg-[#FF963F]"/></div><p className="mt-4 text-[9px] leading-relaxed text-[#C0BEC0]">Example score only. The creator reviews the terms and makes the final decision.</p></div>
                </div>
              </div>}
              {activeFeature === 'control' && <div className="relative z-10">
                <div className="flex items-center justify-between"><span className="text-[9px] font-mono tracking-[.16em] text-[#777980]">CREATOR CONTROL</span><ShieldCheck size={18} className="text-[#F0443E]"/></div>
                <h3 className="mt-7 max-w-[420px] font-display text-3xl sm:text-4xl font-semibold">The assistant prepares.<br/><span className="text-[#F0443E]">You decide.</span></h3>
                <div className="mt-8 grid sm:grid-cols-2 gap-3">{[['Private rate floor','Never shared with brands'],['Negotiation rules','Set by the creator'],['Full transcript','Every message stays visible'],['Final approval','Always belongs to you']].map(([a,b])=><div key={a} className="rounded-xl border border-white/[0.09] bg-black/20 p-4"><Check size={14} className="text-[#FF963F]"/><p className="mt-4 text-[11px] font-semibold">{a}</p><p className="mt-1 text-[10px] text-[#8D8E95]">{b}</p></div>)}</div>
              </div>}
              <div className="absolute bottom-5 right-6 flex items-center gap-1.5 text-[9px] font-mono text-[#62636A]"><span>SELECT A STEP</span><MousePointer2 size={11}/></div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section border-y border-white/[0.07] bg-[#101115]">
        <div className="site-container">
          <Reveal className="grid lg:grid-cols-[.85fr_1.15fr] gap-12 lg:gap-24">
            <div><div className="site-eyebrow">Designed around your boundaries</div><h2 className="section-heading">Good work.<br/><span className="accent">Better terms.</span></h2><p className="section-copy mt-6">Your rates, your preferences, your red lines. The assistant follows the boundaries you set.</p><button className="site-button site-button-secondary mt-7" onClick={() => onNavigate('how-it-works')}>Explore the process <ArrowRight size={14}/></button></div>
            <div className="space-y-0">{benefits.map((b,i)=>{const Icon=b.icon;return <div key={b.title} className="flex gap-5 border-b border-white/[0.09] py-6 first:pt-0 last:border-0"><span className="font-mono text-[10px] text-[#F0443E]">0{i+1}</span><div className="flex-1"><div className="flex items-center gap-2"><Icon size={15} className="text-[#FF963F]"/><h3 className="text-[14px] font-semibold">{b.title}</h3></div><p className="mt-2 max-w-[410px] text-[11px] leading-relaxed text-[#909198]">{b.text}</p></div><ArrowUpRight size={15} className="mt-1 text-[#66676D]"/></div>})}</div>
          </Reveal>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <Reveal><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"><div><div className="site-eyebrow">Simple by design</div><h2 className="section-heading">Your link.<br/>Your <span className="accent">workflow.</span></h2></div><p className="section-copy">A clear path from creator setup to a conversation worth having.</p></div></Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['01','Build your page','Add your identity, work and audience details.'],
              ['02','Set your boundaries','Choose rates, preferences and hard no’s.'],
              ['03','Share one link','Brands can enquire without creating an account.'],
              ['04','Review the proposal','Read every detail. Accept, decline or hold.'],
            ].map(([n,t,d],i)=><Reveal key={n} delay={i*90}><div className="card-lift h-full rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5"><div className="flex justify-between"><span className="font-mono text-[10px] text-[#F0443E]">{n}</span>{i===3?<ShieldCheck size={16} className="text-[#FF963F]"/>:<ArrowUpRight size={16} className="text-[#6A6B71]"/>}</div><h3 className="mt-10 text-[16px] font-semibold">{t}</h3><p className="mt-2 text-[11px] leading-relaxed text-[#8F9096]">{d}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="site-section pt-0">
        <div className="site-container">
          <Reveal className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#17181D] px-7 py-12 sm:px-12 sm:py-16">
            <div className="absolute -right-20 -top-28 h-[360px] w-[360px] rounded-full bg-[#F0443E]/[0.13] blur-[100px]"/>
            <div className="absolute right-[18%] top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border border-white/[0.07] lg:block"/>
            <div className="relative z-10 max-w-[650px]"><div className="site-eyebrow">Your next collaboration starts here</div><h2 className="mt-5 font-display text-[clamp(2.7rem,6vw,5.3rem)] font-semibold leading-[.94] tracking-[-.07em]">Make your link<br/><span className="text-[#F0443E]">work harder.</span></h2><p className="mt-5 max-w-[360px] text-[12px] leading-relaxed text-[#A3A4AA]">A thoughtful page. A more complete enquiry. A deal you can review with clarity.</p><button className="site-button site-button-primary mt-8" onClick={() => onNavigate('signup')}>Create your creator link <ArrowUpRight size={15}/></button></div>
            <div className="absolute bottom-8 right-10 hidden h-20 w-20 rotate-45 border border-[#F0443E]/40 lg:block"><div className="absolute inset-3 border border-[#FF963F]/50"/></div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
