import React, { useState } from 'react';
import { CreatorData, useCreatorStore } from '../store/creatorStore';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Sparkles,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Send,
  Lock,
} from 'lucide-react';

interface CreatorLandingTemplateProps {
  creator: CreatorData;
  isPublic?: boolean;
  onNavigateHome?: () => void;
}

export const CreatorLandingTemplate: React.FC<CreatorLandingTemplateProps> = ({
  creator,
  isPublic = false,
  onNavigateHome,
}) => {
  const { addProposal } = useCreatorStore();

  // Inbound Brand Form state
  const [brandName, setBrandName] = useState('');
  const [brandEmail, setBrandEmail] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [selectedDeliverable, setSelectedDeliverable] = useState('1x Dedicated Video Feature');
  const [proposedBudget, setProposedBudget] = useState(creator.startingRate || 4000);
  const [timeline, setTimeline] = useState('14-21 Business Days');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Accordion state for Working Process
  const [activeStep, setActiveStep] = useState<number | null>(0);

  // Computed deliverable services based on creator rates
  const services = [
    {
      title: 'Dedicated Video Feature',
      category: 'YouTube / Video',
      description: 'Comprehensive deep dive and product teardown integrated seamlessly into organic long-form video content.',
      price: creator.startingRate,
      turnaround: '14 Days',
      popular: true,
    },
    {
      title: '60s Mid-Roll Integration',
      category: 'Sponsorship',
      description: 'Dynamic 60-second in-video commercial segment featuring live screen recording and dedicated call to action.',
      price: Math.round(creator.startingRate * 0.7),
      turnaround: '10 Days',
    },
    {
      title: 'Multi-Platform Blitz',
      category: 'Campaign Package',
      description: '1x Long-form video integration + dedicated X thread + primary newsletter feature reaching all 480K audience.',
      price: Math.round(creator.startingRate * 1.6),
      turnaround: '21 Days',
    },
    {
      title: 'Primary Newsletter Sponsorship',
      category: 'Newsletter',
      description: 'Top-of-fold primary sponsor slot delivered to over 80K verified tech and design subscribers.',
      price: Math.round(creator.startingRate * 0.4),
      turnaround: '7 Days',
    },
  ];

  // Working Process steps (from Reference Image 2)
  const processSteps = [
    {
      number: '01',
      title: 'Automated Consultation & Rate Screening',
      description: `During inquiry, VALLU screens the brand's proposed budget against John's confidential rate rules ($${creator.floorRate.toLocaleString()} minimum floor). Lowballs and predatory clauses are neutralized instantly.`,
    },
    {
      number: '02',
      title: 'Commercial Terms & Milestones',
      description: `We establish verified delivery milestones: ${creator.paymentTerms}. Zero commission fees are deducted from the creator.`,
    },
    {
      number: '03',
      title: 'Creative Production & Revision Cycle',
      description: 'Content is crafted authentic to the creator’s audience voice, including a fast 48-hour brand preview for factual accuracy.',
    },
    {
      number: '04',
      title: 'Public Launch & Guaranteed Net Payout',
      description: 'Content goes live across verified channels, analytics reporting is dispatched, and balance payment is unlocked directly.',
    },
  ];

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !brandEmail) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Calculate score based on floor and starting rate
      let score = 50;
      const flags: string[] = [];
      if (proposedBudget >= creator.startingRate) {
        score = 95;
      } else if (proposedBudget >= creator.floorRate) {
        score = 80;
      } else {
        score = 45;
        flags.push(`Offered budget ($${proposedBudget}) is below confidential threshold ($${creator.floorRate})`);
      }

      // Add to store
      addProposal({
        brandName,
        brandEmail,
        campaignName: campaignTitle || 'Sponsored Collaboration',
        deliverable: selectedDeliverable,
        offeredBudget: Number(proposedBudget),
        dealScore: score,
        redFlags: flags,
        paymentWindow: 'Net-15',
        usageRights: '60-day digital organic',
        transcript: [
          { sender: 'brand', text: `Hi ${creator.name}, we are offering $${proposedBudget.toLocaleString()} for ${selectedDeliverable}.`, time: 'Just now' },
          { sender: 'assistant', text: `Received! Offer has been scored (${score}/100) and placed into ${creator.name}'s review inbox.`, time: 'Just now' },
        ],
      });

      setIsSubmitting(false);
      setSubmissionSuccess(true);
    }, 600);
  };

  return (
    <div className="bg-[#090D16] text-[#F1F5F9] font-sans selection:bg-[#E11D48]/30 selection:text-white min-h-screen">
      {/* 1. Header (Reference Image 1: John Doe clean nav) */}
      <nav className="border-b border-[#1E293B] bg-[#090D16]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-lg sm:text-xl text-white tracking-wider">
              {creator.name}
            </span>
            <span className="text-[10px] font-mono bg-[#1E293B] text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/20">
              Verified VALLU Bio
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-[#94A3B8]">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#services" className="hover:text-white transition-colors">Sponsorships</a>
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#contact" className="hover:text-white transition-colors">Inquire</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="bg-[#E11D48] hover:bg-rose-600 text-white text-xs font-bold px-3.5 sm:px-4 py-1.5 rounded-full shadow-[0_2px_12px_rgba(225,29,72,0.4)] transition-all"
            >
              Book Sponsorship
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (Combined Reference 1 + Reference 2) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Text (Reference 1 style) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131926] border border-[#1E293B] text-xs font-mono text-[#94A3B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACCEPTING Q2 / Q3 BRAND PARTNERSHIPS</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tight leading-[0.98]">
              Hello, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] via-rose-500 to-rose-400">
                {creator.name}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-medium">
              {creator.headline}
            </p>

            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl leading-relaxed">
              {creator.bio}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(225,29,72,0.45)] transition-all inline-flex items-center gap-2 group active:scale-95"
              >
                <span>Submit Brand Proposal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#work"
                className="px-5 py-3 rounded-full bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-white transition-all inline-flex items-center gap-2"
              >
                <span>Explore Media Kit & Work</span>
              </a>
            </div>

            {/* Micro Audience Highlights */}
            <div className="pt-4 flex items-center gap-4 text-xs font-mono text-[#94A3B8]">
              <div>
                <span className="text-white font-bold block text-sm">{creator.followersTotal}</span>
                <span>Total Reach</span>
              </div>
              <span className="text-[#1E293B]">|</span>
              <div>
                <span className="text-emerald-400 font-bold block text-sm">${creator.startingRate.toLocaleString()}</span>
                <span>Starting Rate</span>
              </div>
              <span className="text-[#1E293B]">|</span>
              <div>
                <span className="text-white font-bold block text-sm">{creator.location}</span>
                <span>Location</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image (Reference 1 styled circle + geometric accents) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative">
              {/* Decorative graphic accents (+ + and //// from Reference 1) */}
              <div className="absolute -top-4 -right-4 text-[#E11D48] font-mono text-xl font-bold select-none tracking-widest">
                + +
              </div>
              <div className="absolute -bottom-4 -left-4 text-[#94A3B8] font-mono text-sm select-none tracking-widest">
                / / / /
              </div>

              {/* Glowing back aura */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E11D48]/30 to-rose-600/10 rounded-full blur-2xl transform scale-95" />

              {/* Circular Framed Avatar */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-b from-[#1E293B] to-[#131926] border-2 border-[#1E293B] shadow-[0_20px_50px_rgba(9,13,22,0.9)] overflow-hidden">
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Float Rate Badge */}
              <div className="absolute bottom-2 right-2 bg-[#131926]/95 border border-[#1E293B] rounded-2xl p-3 shadow-xl backdrop-blur-md">
                <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">Verified Baseline</span>
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Starts at ${creator.startingRate.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted Brand Ticker (Reference 2 style) */}
      <section className="border-y border-[#1E293B] bg-[#131926]/40 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] shrink-0">
            Trusted by top tech & design teams:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 font-bold text-sm tracking-wider uppercase">
            {creator.pastBrands.map((brand, i) => (
              <span key={i} className="hover:text-white transition-colors font-display">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "about." Narrative Section (Reference 1 huge watermark header) */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 relative">
        <div className="text-5xl sm:text-8xl font-black font-display text-white/[0.04] uppercase tracking-tighter select-none absolute top-4 left-6 pointer-events-none">
          about.
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131926] border border-[#1E293B] text-xs font-mono text-[#E11D48]">
            <span>CREATOR MANIFESTO</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            High-Craft Engineering Meets <br />
            Audience Respect.
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-3xl leading-relaxed">
            I don’t do generic ad reads. Every sponsored integration is treated as a premium editorial segment, customized to solve actual problems for developers and designers.
          </p>

          {/* Timeline Milestones (from Reference 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-5 space-y-1.5">
              <span className="text-xs font-mono text-[#E11D48] font-bold">● 2022 – 2024</span>
              <h3 className="text-sm font-bold text-white">Channel Scaling</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Grew community from zero to 280K YouTube subscribers with in-depth systems teardowns.
              </p>
            </div>

            <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-5 space-y-1.5">
              <span className="text-xs font-mono text-[#E11D48] font-bold">● 2024 – 2025</span>
              <h3 className="text-sm font-bold text-white">Top Tech Collabs</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Delivered 35+ successful product launches with {creator.pastBrands.slice(0, 3).join(', ')}.
              </p>
            </div>

            <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-5 space-y-1.5">
              <span className="text-xs font-mono text-emerald-400 font-bold">● 2026 – Present</span>
              <h3 className="text-sm font-bold text-white">Autonomous Deal Shield</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Deployed VALLU operating system with 0% commission and 100% contract floor protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "services." Sponsorship Packages (Reference 2 Positivus styled cards) */}
      <section id="services" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1E293B]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131926] border border-[#1E293B] text-xs font-mono text-emerald-400 mb-2">
              <span>COLLABORATION PACKAGES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
              Deliverables & Rates
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] max-w-sm">
            All packages include standard 60-day digital organic rights, draft preview, and zero commission markup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 border transition-all ${
                svc.popular
                  ? 'bg-[#131926] border-[#E11D48]/60 shadow-[0_10px_35px_rgba(225,29,72,0.15)]'
                  : 'bg-[#131926]/70 border-[#1E293B] hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#090D16] border border-[#1E293B] text-slate-300">
                  {svc.category}
                </span>
                {svc.popular && (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#E11D48] text-white">
                    Most Requested
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-2">{svc.title}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">{svc.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
                <div>
                  <span className="text-[10px] text-[#94A3B8] uppercase block font-mono">Standard Package</span>
                  <span className="text-xl font-mono font-bold text-white">${svc.price.toLocaleString()} USD</span>
                </div>
                <a
                  href="#contact"
                  className="px-4 py-2 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-white transition-colors"
                >
                  Inquire Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. "work." Featured Case Studies (Reference 1 style) */}
      <section id="work" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1E293B] relative">
        <div className="text-5xl sm:text-8xl font-black font-display text-white/[0.04] uppercase tracking-tighter select-none absolute top-4 left-6 pointer-events-none">
          work.
        </div>

        <div className="relative z-10 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131926] border border-[#1E293B] text-xs font-mono text-rose-300 mb-2">
            <span>PERFORMANCE PROOF</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            Recent Collaborations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-[#131926] border border-[#1E293B] rounded-3xl overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-between">
              <span className="text-xs font-mono text-[#E11D48] font-bold">Notion Feature Launch</span>
              <div>
                <span className="text-2xl font-black font-mono text-white">180K+ Views</span>
                <span className="text-xs text-slate-300 block">14.2% Click-through Rate</span>
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-base font-bold text-white">Building an Autonomous Second Brain</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                A 14-minute deep dive video exploring real developer database workflows using Notion.
              </p>
            </div>
          </div>

          <div className="bg-[#131926] border border-[#1E293B] rounded-3xl overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-slate-900 to-[#131926] p-6 flex flex-col justify-between border-b border-[#1E293B]">
              <span className="text-xs font-mono text-emerald-400 font-bold">Linear 2.0 Spotlight</span>
              <div>
                <span className="text-2xl font-black font-mono text-white">240K+ Engineers</span>
                <span className="text-xs text-slate-300 block">#1 Trending on X Tech</span>
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-base font-bold text-white">Speed as a Competitive Advantage</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Dedicated video teardown showing keyboard shortcuts and issue tracking ergonomics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. "process." Working Process Accordion (Reference 2 style) */}
      <section id="process" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1E293B]">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131926] border border-[#1E293B] text-xs font-mono text-[#94A3B8] mb-2">
            <span>STEP-BY-STEP WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            Our Working Process
          </h2>
        </div>

        <div className="space-y-3">
          {processSteps.map((step, index) => {
            const isOpen = activeStep === index;
            return (
              <div
                key={index}
                className="bg-[#131926] border border-[#1E293B] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-black text-xl text-[#E11D48]">
                      {step.number}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white">
                      {step.title}
                    </span>
                  </div>
                  <span className="text-[#94A3B8]">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-[#1E293B]/60">
                    {step.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. "contact." Interactive Brand Proposal Submission (Reference 1 + 2 Form) */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1E293B]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131926] border border-[#1E293B] text-xs font-mono text-[#E11D48]">
              <span>AUTONOMOUS PROPOSAL PORTAL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
              Work With <br />
              <span className="text-[#E11D48]">{creator.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Submit your collaboration scope directly. Your offer is instantly screened by {creator.name}'s VALLU assistant and dispatched to the creator's private review inbox.
            </p>

            <div className="p-4 bg-[#131926] border border-[#1E293B] rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Response Time:</span>
                <span className="text-white font-medium">&lt; 24 Business Hours</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Starting Baseline:</span>
                <span className="text-emerald-400 font-bold font-mono">${creator.startingRate.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Escrow / Payment:</span>
                <span className="text-white">{creator.paymentTerms}</span>
              </div>
            </div>
          </div>

          {/* Proposal Submission Form */}
          <div className="lg:col-span-7 bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl">
            {submissionSuccess ? (
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  Proposal Successfully Dispatched!
                </h3>
                <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                  Your sponsorship offer for <strong className="text-white">${proposedBudget.toLocaleString()}</strong> has been submitted to {creator.name}’s live dashboard inbox.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionSuccess(false);
                    setBrandName('');
                    setBrandEmail('');
                    setCampaignTitle('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs text-white font-semibold transition-colors"
                >
                  Submit Another Scope
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">
                      Brand / Company Name <span className="text-[#E11D48]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Supabase, Linear, Notion"
                      className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">
                      Work Email <span className="text-[#E11D48]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={brandEmail}
                      onChange={(e) => setBrandEmail(e.target.value)}
                      placeholder="partnerships@company.com"
                      className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-medium mb-1">Campaign or Product Title</label>
                  <input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="e.g. Q3 Feature Launch & Developer Teardown"
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Selected Deliverable</label>
                    <select
                      value={selectedDeliverable}
                      onChange={(e) => setSelectedDeliverable(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E11D48]"
                    >
                      <option value="1x Dedicated Video Feature">1x Dedicated Video Feature</option>
                      <option value="60s Mid-Roll Integration">60s Mid-Roll Integration</option>
                      <option value="Multi-Platform Blitz Package">Multi-Platform Blitz Package</option>
                      <option value="Newsletter Primary Feature">Newsletter Primary Feature</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Estimated Timeline</label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E11D48]"
                    >
                      <option value="14-21 Business Days">14-21 Business Days (Standard)</option>
                      <option value="7-14 Business Days">7-14 Business Days (Expedited)</option>
                      <option value="30+ Days Advance Booking">30+ Days Advance Booking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[#94A3B8] font-medium">Proposed Sponsorship Budget</label>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      ${proposedBudget.toLocaleString()} USD
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={12000}
                    step={250}
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(Number(e.target.value))}
                    className="w-full accent-[#E11D48] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono mt-1">
                    <span>$1,000</span>
                    <span>Creator Starting Rate: ${creator.startingRate.toLocaleString()}</span>
                    <span>$12,000+</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(225,29,72,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting Proposal...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Proposal (${proposedBudget.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-8 text-center text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {creator.name} · All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-[#131926] px-2.5 py-1 rounded-full border border-[#1E293B] text-slate-300">
              Powered by VALLU Deal OS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
