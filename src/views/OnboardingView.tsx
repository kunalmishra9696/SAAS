import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useCreatorStore, CreatorData } from '../store/creatorStore';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  BarChart3,
  User,
  Briefcase,
  HelpCircle,
  Plus,
} from 'lucide-react';

interface OnboardingViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onNavigate }) => {
  const { creator, updateCreator } = useCreatorStore();

  // Local form state initialized from store
  const [name, setName] = useState(creator.name);
  const [handle, setHandle] = useState(creator.handle);
  const [headline, setHeadline] = useState(creator.headline);
  const [bio, setBio] = useState(creator.bio);
  const [location, setLocation] = useState(creator.location);

  const [followersTotal, setFollowersTotal] = useState(creator.followersTotal);
  const [avgViews, setAvgViews] = useState(creator.avgViews);
  const [monthlyReach, setMonthlyReach] = useState(creator.monthlyReach);

  const [startingRate, setStartingRate] = useState(creator.startingRate);
  const [floorRate, setFloorRate] = useState(creator.floorRate);

  // Payment terms (3 options + Other)
  const paymentOptions = [
    '50% advance deposit upon contract + Net-15 balance',
    '100% advance deposit before filming starts',
    'Net-30 milestone payout with escrow lock',
  ];
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);
  const [customPayment, setCustomPayment] = useState('');
  const [isOtherPayment, setIsOtherPayment] = useState(false);

  // Collab Wants (3 options + Other)
  const wantOptions = [
    'Dedicated Product Teardown Video',
    'Developer Tools, AI & Tech Software',
    'Multi-month Ambassadorships',
  ];
  const [selectedWants, setSelectedWants] = useState<string[]>(creator.wants);
  const [customWant, setCustomWant] = useState(creator.customWant || '');

  // Collab Rejects (3 options + Other)
  const rejectOptions = [
    'Rev-share or affiliate-only commission',
    'Perpetual uncredited buyout rights',
    'Gambling, crypto casinos & betting',
  ];
  const [selectedRejects, setSelectedRejects] = useState<string[]>(creator.rejects);
  const [customReject, setCustomReject] = useState(creator.customReject || '');

  // Past Collabs
  const pastBrandOptions = [
    'Notion, Linear, Supabase, Figma',
    'Nike, Adidas, Gymshark, Under Armour',
    'Shopify, Webflow, Stripe, Vercel',
  ];
  const [selectedPastGroup, setSelectedPastGroup] = useState(pastBrandOptions[0]);
  const [customPastBrands, setCustomPastBrands] = useState('');
  const [isOtherPast, setIsOtherPast] = useState(false);
  const [pastAvgPayout, setPastAvgPayout] = useState(creator.pastAvgPayout);

  // Active step (1 to 5)
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Question answers validation for circular progress
  // Total of 10 key questions
  const totalQuestions = 10;
  let answeredCount = 0;
  if (name.trim()) answeredCount++;
  if (handle.trim()) answeredCount++;
  if (headline.trim()) answeredCount++;
  if (bio.trim()) answeredCount++;
  if (followersTotal.trim()) answeredCount++;
  if (avgViews.trim()) answeredCount++;
  if (startingRate > 0) answeredCount++;
  if (floorRate > 0) answeredCount++;
  if (selectedWants.length > 0 || customWant.trim()) answeredCount++;
  if (selectedRejects.length > 0 || customReject.trim()) answeredCount++;

  const questionsLeft = Math.max(0, totalQuestions - answeredCount);
  const progressPercent = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

  // Toggle selection helpers
  const toggleWant = (opt: string) => {
    setSelectedWants((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  const toggleReject = (opt: string) => {
    setSelectedRejects((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  // Submit and synthesize landing page
  const handleSynthesizeAndPreview = () => {
    // Determine past brands array
    const brandsList = isOtherPast && customPastBrands.trim()
      ? customPastBrands.split(',').map((s) => s.trim()).filter(Boolean)
      : selectedPastGroup.split(',').map((s) => s.trim()).filter(Boolean);

    // AI synthesis fallback: if creator left bio or headline blank, synthesize smart defaults
    const finalBio = bio.trim() || `Creator and specialist sharing authentic, high-impact stories with ${followersTotal || '480K'} engaged audience. Zero predatory contracts, guaranteed delivery.`;
    const finalHeadline = headline.trim() || `${name || 'Creator'} · Tech & Design Creator based in ${location || 'Netherlands'}`;

    const updatedData: Partial<CreatorData> = {
      name: name.trim() || 'John Doe',
      handle: handle.trim().toLowerCase() || 'johndoe',
      headline: finalHeadline,
      bio: finalBio,
      location: location.trim() || 'Amsterdam, Netherlands',
      followersTotal: followersTotal.trim() || '480K',
      avgViews: avgViews.trim() || '45K per video',
      monthlyReach: monthlyReach.trim() || '1.2M impressions',
      startingRate: Number(startingRate) || 4000,
      floorRate: Number(floorRate) || 2800,
      paymentTerms: isOtherPayment && customPayment.trim() ? customPayment.trim() : selectedPayment,
      wants: customWant.trim() ? [...selectedWants, customWant.trim()] : selectedWants,
      rejects: customReject.trim() ? [...selectedRejects, customReject.trim()] : selectedRejects,
      customWant,
      customReject,
      pastBrands: brandsList.length > 0 ? brandsList : ['Notion', 'Linear', 'Supabase', 'Figma'],
      pastAvgPayout: Number(pastAvgPayout) || 3500,
      isPublished: false,
    };

    updateCreator(updatedData);
    onNavigate('landing-preview');
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Top Header with Circular Progress Ring */}
      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(9,13,22,0.85)]">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090D16] border border-[#1E293B] text-xs font-mono text-[#94A3B8]">
            <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>AI BIO ENGINE & COMMERCIAL PROFILE</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Creator Onboarding Wizard
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg leading-relaxed">
            Answer a few quick questions about your audience, floor rates, and deal boundaries. We'll automatically synthesize your public sponsor landing page.
          </p>
        </div>

        {/* Circular Progress Bar Component */}
        <div className="flex items-center gap-4 shrink-0 bg-[#090D16] border border-[#1E293B] rounded-2xl px-5 py-3.5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#1E293B] stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#E11D48] stroke-current transition-all duration-500 ease-out"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* In the Center: Total questions left */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {questionsLeft === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <>
                  <span className="font-mono font-bold text-sm sm:text-base text-white leading-none">
                    {questionsLeft}
                  </span>
                  <span className="text-[9px] text-[#94A3B8] uppercase font-mono tracking-tight mt-0.5">
                    left
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-0.5 text-left">
            <div className="text-xs font-bold text-white font-mono">
              {progressPercent}% Complete
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {questionsLeft === 0 ? 'All 10 questions filled!' : `${answeredCount} of 10 answered`}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              Step {step} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator Tabs */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { num: 1, label: 'Identity & Hook' },
          { num: 2, label: 'Audience Reach' },
          { num: 3, label: 'Rate & Floor' },
          { num: 4, label: 'Deal Boundaries' },
          { num: 5, label: 'Past Proof' },
        ].map((tab) => (
          <button
            key={tab.num}
            onClick={() => setStep(tab.num)}
            className={`flex-1 min-w-[110px] sm:min-w-0 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              step === tab.num
                ? 'bg-[#1E293B] text-white border-[#E11D48] shadow-sm'
                : 'bg-[#131926]/60 text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                step === tab.num ? 'bg-[#E11D48] text-white' : 'bg-[#090D16] text-[#94A3B8]'
              }`}
            >
              {tab.num}
            </span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Step Cards */}
      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* STEP 1: Creator Identity & Hook */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[#E11D48]" />
                <h2 className="text-base sm:text-lg font-bold text-white">1. Creator Identity & Tagline</h2>
              </div>
              <p className="text-xs text-[#94A3B8]">
                This will head your public collaboration page, matching the John Doe portfolio hero style.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name / Display Name <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe, Marcus Vance"
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Unique Bio Handle <span className="text-[#E11D48]">*</span>
                </label>
                <div className="flex items-center bg-[#090D16] border border-[#1E293B] rounded-xl px-3 py-2.5 focus-within:border-[#E11D48]">
                  <span className="text-xs text-[#94A3B8] font-mono">vallu.bio/@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="handle"
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-600 focus:outline-none px-1 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                One-Liner Headline Hook <span className="text-[#E11D48]">*</span>
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Product Designer & Tech Creator based in Netherlands"
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
              />
              <span className="text-[10px] text-[#94A3B8] mt-1 block">
                Shown prominently in the hero section ("Hello, I'm [Name], [Headline]").
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Short Bio Narrative <span className="text-[10px] text-[#94A3B8] font-normal">(Optional — AI auto-fills if empty)</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">Autofill available</span>
              </div>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your creative focus, audience interests, and storytelling style..."
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Audience Analytics */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-[#E11D48]" />
                <h2 className="text-base sm:text-lg font-bold text-white">2. Audience Reach & Metrics</h2>
              </div>
              <p className="text-xs text-[#94A3B8]">
                These verified statistics will be featured in the Positivus-style metrics cards on your public landing page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Total Combined Followers <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  type="text"
                  value={followersTotal}
                  onChange={(e) => setFollowersTotal(e.target.value)}
                  placeholder="e.g. 480K, 1.2M"
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Average Views Per Video / Post
                </label>
                <input
                  type="text"
                  value={avgViews}
                  onChange={(e) => setAvgViews(e.target.value)}
                  placeholder="e.g. 45K views"
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Monthly Reach / Impressions
                </label>
                <input
                  type="text"
                  value={monthlyReach}
                  onChange={(e) => setMonthlyReach(e.target.value)}
                  placeholder="e.g. 1.2M impressions"
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48] font-mono"
                />
              </div>
            </div>

            {/* Quick Channel Breakdown preview */}
            <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-2xl">
              <span className="text-[11px] font-mono text-[#94A3B8] uppercase block mb-2">
                Primary Channels Detected:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#131926] p-2 rounded-xl border border-[#1E293B]">
                  <span className="text-[#94A3B8] block text-[10px]">YouTube</span>
                  <span className="font-bold text-white font-mono">280K Subs</span>
                </div>
                <div className="bg-[#131926] p-2 rounded-xl border border-[#1E293B]">
                  <span className="text-[#94A3B8] block text-[10px]">X / Twitter</span>
                  <span className="font-bold text-white font-mono">120K Followers</span>
                </div>
                <div className="bg-[#131926] p-2 rounded-xl border border-[#1E293B]">
                  <span className="text-[#94A3B8] block text-[10px]">Newsletter</span>
                  <span className="font-bold text-white font-mono">80K Readers</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Rate & Floor Safeguards */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-[#E11D48]" />
                <h2 className="text-base sm:text-lg font-bold text-white">3. Commercial Rates & Confidential Floor</h2>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Your floor rate is strictly encrypted and confidential. It powers the autonomous screening bot to reject lowballs without revealing your price.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-white">Target Public Starting Rate</label>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    ${startingRate.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={15000}
                  step={250}
                  value={startingRate}
                  onChange={(e) => setStartingRate(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
                <span className="text-[10px] text-[#94A3B8] block">
                  Displayed on your public landing page as "Starting at ${startingRate.toLocaleString()}".
                </span>
              </div>

              <div className="p-4 bg-[#090D16] border border-rose-900/40 rounded-2xl space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span>Confidential Floor Rate (Private)</span>
                  </label>
                  <span className="text-sm font-bold text-[#E11D48] font-mono">
                    ${floorRate.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={startingRate}
                  step={200}
                  value={floorRate}
                  onChange={(e) => setFloorRate(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
                <span className="text-[10px] text-[#94A3B8] block">
                  Offers below this rate are hard-blocked by VALLU before reaching your inbox.
                </span>
              </div>
            </div>

            {/* Payment Terms (3 options + Other write-in) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Preferred Payment Terms (Select 1 or enter custom):
              </label>
              <div className="space-y-2">
                {paymentOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPayment(opt);
                      setIsOtherPayment(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      !isOtherPayment && selectedPayment === opt
                        ? 'bg-[#1E293B] text-white border-[#E11D48]'
                        : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {!isOtherPayment && selectedPayment === opt && (
                      <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />
                    )}
                  </button>
                ))}

                {/* Other Option */}
                <button
                  type="button"
                  onClick={() => setIsOtherPayment(true)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isOtherPayment
                      ? 'bg-[#1E293B] text-white border-[#E11D48]'
                      : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:text-white'
                  }`}
                >
                  <span>Other (Write your custom terms)</span>
                  {isOtherPayment && <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />}
                </button>

                {isOtherPayment && (
                  <input
                    type="text"
                    value={customPayment}
                    onChange={(e) => setCustomPayment(e.target.value)}
                    placeholder="e.g. 30% upfront, 70% upon live link"
                    className="w-full bg-[#090D16] border border-[#E11D48] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Deal Boundaries (Wants & Rejects) */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-[#E11D48]" />
                <h2 className="text-base sm:text-lg font-bold text-white">4. Deal Preferences & Rejection Rules</h2>
              </div>
              <p className="text-xs text-[#94A3B8]">
                These rules populate your public landing page "Working Process & Safeguards" sections.
              </p>
            </div>

            {/* WHAT YOU WANT (3 options + Other) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-emerald-400">
                What Collaborations Do You WANT? (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {wantOptions.map((opt, idx) => {
                  const isChecked = selectedWants.includes(opt);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleWant(opt)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all flex flex-col justify-between gap-2 ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                          : 'bg-[#090D16] border-[#1E293B] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="text-[10px] font-mono">{isChecked ? '✓ Selected' : '+ Add'}</span>
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={customWant}
                onChange={(e) => setCustomWant(e.target.value)}
                placeholder="Other preference (e.g. Newsletter primary sponsor, Live Keynotes)..."
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* WHAT YOU REJECT (3 options + Other) */}
            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-semibold text-rose-400">
                What Do You INSTANTLY REJECT? (Automated Red-Flag Radar)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {rejectOptions.map((opt, idx) => {
                  const isChecked = selectedRejects.includes(opt);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleReject(opt)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all flex flex-col justify-between gap-2 ${
                        isChecked
                          ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                          : 'bg-[#090D16] border-[#1E293B] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="text-[10px] font-mono">{isChecked ? '⛔ Blocked' : '+ Add'}</span>
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={customReject}
                onChange={(e) => setCustomReject(e.target.value)}
                placeholder="Other dealbreakers (e.g. Uncapped video revisions, Whitelisting ads without approval)..."
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Past Collabs & Social Proof */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-[#E11D48]" />
                <h2 className="text-base sm:text-lg font-bold text-white">5. Past Brand Collabs & Case Studies</h2>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Powers the "Trusted By" brand logo ticker and Case Studies section shown in both reference styles.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Select Notable Past Brand Collabs (or enter your own):
              </label>
              <div className="space-y-2">
                {pastBrandOptions.map((brandStr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPastGroup(brandStr);
                      setIsOtherPast(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      !isOtherPast && selectedPastGroup === brandStr
                        ? 'bg-[#1E293B] text-white border-[#E11D48]'
                        : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:text-white'
                    }`}
                  >
                    <span className="font-mono">{brandStr}</span>
                    {!isOtherPast && selectedPastGroup === brandStr && (
                      <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />
                    )}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsOtherPast(true)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isOtherPast
                      ? 'bg-[#1E293B] text-white border-[#E11D48]'
                      : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:text-white'
                  }`}
                >
                  <span>Other (Type your exact past brands, comma separated)</span>
                  {isOtherPast && <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />}
                </button>

                {isOtherPast && (
                  <input
                    type="text"
                    value={customPastBrands}
                    onChange={(e) => setCustomPastBrands(e.target.value)}
                    placeholder="e.g. Supabase, Linear, Vercel, Raycast"
                    className="w-full bg-[#090D16] border border-[#E11D48] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Past Average Deal Payout ($ USD)
              </label>
              <div className="flex items-center bg-[#090D16] border border-[#1E293B] rounded-xl px-3 py-2.5 max-w-xs">
                <span className="text-xs text-emerald-400 font-mono mr-1">$</span>
                <input
                  type="number"
                  value={pastAvgPayout}
                  onChange={(e) => setPastAvgPayout(Number(e.target.value))}
                  placeholder="3500"
                  className="bg-transparent border-none text-xs text-white focus:outline-none font-mono w-full"
                />
                <span className="text-xs text-[#94A3B8] font-mono">USD</span>
              </div>
              <span className="text-[10px] text-[#94A3B8] mt-1 block">
                Used to calculate uplift metrics and average past ROI.
              </span>
            </div>
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="pt-6 mt-6 border-t border-[#1E293B] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="py-2.5 px-4 rounded-xl border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="py-2.5 px-5 rounded-xl bg-[#E11D48] hover:bg-rose-600 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-md"
            >
              <span>Next Step ({step + 1}/{totalSteps})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSynthesizeAndPreview}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(225,29,72,0.45)] hover:shadow-[0_4px_26px_rgba(225,29,72,0.6)] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize & Preview Landing Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
