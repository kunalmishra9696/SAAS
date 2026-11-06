import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import {
  valluApi,
  Profile,
  CreatorSettings,
  isSupabaseConfigured,
} from '../lib/supabase';
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Bot,
  FileText,
} from 'lucide-react';

interface PublicBioViewProps {
  onNavigate: (route: PageRoute) => void;
}

interface ChatMessage {
  sender: 'bot' | 'brand';
  text: string;
  timestamp: string;
  badge?: string;
}

export const PublicBioView: React.FC<PublicBioViewProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<CreatorSettings | null>(null);

  // Brand Inquiry Form State
  const [brandName, setBrandName] = useState('');
  const [brandEmail, setBrandEmail] = useState('');
  const [campaignName, setCampaignName] = useState('Q3 Product Launch');
  const [deliverables, setDeliverables] = useState('1x Dedicated Video + X Thread');
  const [budget, setBudget] = useState(3800);
  const [usageRights, setUsageRights] = useState('30-day organic social');
  const [exclusivity, setExclusivity] = useState('None');
  const [paymentWindow, setPaymentWindow] = useState('Net-15');

  // Interactive Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [brandInput, setBrandInput] = useState('');
  const [counterRound, setCounterRound] = useState(0);
  const [currentScore, setCurrentScore] = useState(82);
  const [detectedRedFlags, setDetectedRedFlags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDealId, setSubmittedDealId] = useState<string | null>(null);

  // Load creator profile & settings
  useEffect(() => {
    async function loadData() {
      const p = await valluApi.getProfileByHandle('marcus');
      if (p) {
        setProfile(p);
        const s = await valluApi.getCreatorSettings(p.id);
        setSettings(s);

        // Initial bot welcome message
        setMessages([
          {
            sender: 'bot',
            text: `Hi there! I'm ${p.display_name}'s autonomous brand inquiry assistant. State your proposed deliverables and budget below—I will check availability, screen contract terms, and verify Marcus's private floor guidelines.`,
            timestamp: 'Just now',
            badge: 'Autonomous Screener',
          },
        ]);
      }
    }
    loadData();
  }, []);

  // Compute live deal score & red flag radar whenever options change
  useEffect(() => {
    let score = 50;
    const flags: string[] = [];

    // Rate score (starting rate is $4,500, floor is $2,800)
    const floor = settings?.floor_rate_usd || 2800;
    const target = settings?.starting_rate_usd || 4500;

    if (budget >= target) {
      score += 35;
    } else if (budget >= floor) {
      const ratio = (budget - floor) / (target - floor);
      score += Math.round(15 + ratio * 20);
    } else {
      score += 5;
      flags.push(`Budget ($${budget.toLocaleString()}) is below confidential threshold`);
    }

    // Terms score
    if (usageRights.includes('Perpetual') || usageRights.includes('Full Buyout')) {
      score -= 20;
      flags.push('Uncompensated perpetual usage rights requested');
    } else if (usageRights.includes('90-day')) {
      score -= 5;
    } else {
      score += 8;
    }

    // Exclusivity
    if (exclusivity.includes('60 days') || exclusivity.includes('Perpetual')) {
      score -= 15;
      flags.push('Excessive category exclusivity period');
    } else {
      score += 5;
    }

    // Payment Window
    if (paymentWindow === 'Net-60') {
      score -= 10;
      flags.push('Delayed Net-60 payout beyond 30-day policy');
    } else if (paymentWindow === 'Net-15') {
      score += 5;
    }

    setCurrentScore(Math.max(10, Math.min(99, score)));
    setDetectedRedFlags(flags);
  }, [budget, deliverables, usageRights, exclusivity, paymentWindow, settings]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brandInput.trim()) return;

    const userText = brandInput.trim();
    setBrandInput('');

    const newMsgs: ChatMessage[] = [
      ...messages,
      {
        sender: 'brand',
        text: userText,
        timestamp: 'Just now',
      },
    ];
    setMessages(newMsgs);

    // AI Bot Reply
    setTimeout(() => {
      let botResponse = '';
      const floor = settings?.floor_rate_usd || 2800;
      const target = settings?.starting_rate_usd || 4500;

      if (userText.toLowerCase().includes('budget') || userText.includes('$') || !isNaN(Number(userText))) {
        const parsed = parseInt(userText.replace(/[^0-9]/g, ''), 10);
        if (parsed && parsed > 0) {
          setBudget(parsed);
          if (parsed < floor) {
            botResponse = `Offer received for $${parsed.toLocaleString()}. That is below ${profile?.display_name || 'the creator'}'s required baseline for ${deliverables}. To qualify for expedited review, would you consider adjusting to $${floor.toLocaleString()} or reducing secondary deliverables?`;
            setCounterRound((r) => r + 1);
          } else if (parsed < target) {
            botResponse = `Got it. $${parsed.toLocaleString()} is within acceptable bounds. With 30-day usage rights, this yields an offer score of ${currentScore}/100. Ready to submit to Marcus's private inbox?`;
          } else {
            botResponse = `Excellent proposal of $${parsed.toLocaleString()}. This meets top-tier priority status (${currentScore}/100 score). Submit below to trigger instant notification.`;
          }
        } else {
          botResponse = `Acknowledged. I have updated the proposal terms. You can also fine-tune the deliverables and compensation sliders on the left.`;
        }
      } else if (userText.toLowerCase().includes('exclusive') || userText.toLowerCase().includes('rights')) {
        botResponse = `Noted on rights/exclusivity terms. Please confirm that usage remains restricted to digital paid advertising, without broadcast or sub-licensing rights.`;
      } else {
        botResponse = `Thank you. I have logged "${userText}" into the deal audit sheet. Everything is verified against Marcus's 2026 commercial charter. Click "Submit Official Proposal" when ready!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          timestamp: 'Just now',
          badge: 'Verified Autonomous Response',
        },
      ]);
    }, 600);
  };

  const handleSubmitProposal = async () => {
    if (!brandName.trim()) {
      alert('Please enter your Brand or Agency name before submitting.');
      return;
    }
    if (!brandEmail.trim()) {
      alert('Please enter your contact email address.');
      return;
    }
    if (!profile) return;

    setIsSubmitting(true);
    try {
      const deal = await valluApi.submitBrandInquiry(
        profile.id,
        {
          brandName: brandName.trim(),
          brandEmail: brandEmail.trim(),
          campaignName: campaignName.trim(),
          initialBudget: budget,
          finalAgreedRate: budget,
          deliverables,
          rightsDuration: usageRights,
          dealScore: currentScore,
        },
        messages.map((m) => ({
          sender: m.sender === 'bot' ? 'assistant' : 'brand',
          text: m.text,
        }))
      );

      setSubmittedDealId(deal.id);
    } catch (err: unknown) {
      console.error('Error submitting deal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner: Public Bio Indicator */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#131926]/80 border border-[#1E293B] rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-[#94A3B8]">
            vallu.bio/<span className="text-white font-semibold">@{profile?.handle || 'marcus'}</span>
          </span>
          <span className="text-[10px] font-semibold bg-[#1E293B] text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/20">
            Verified Autonomous Bio
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#94A3B8] hidden sm:inline">
            Creator: <strong className="text-white">{profile?.display_name || 'Marcus Vance'}</strong>
          </span>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 text-xs text-[#E11D48] hover:text-rose-400 font-semibold transition-colors"
          >
            <span>Open Creator Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Creator Profile Hero Card */}
      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E11D48]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'}
                alt={profile?.display_name || 'Creator'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#1E293B] shadow-xl"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-[#E11D48] text-white p-1 rounded-full border-2 border-[#131926]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  {profile?.display_name || 'Marcus Vance'}
                </h1>
                <span className="text-xs bg-[#1E293B] text-[#94A3B8] font-mono px-2 py-0.5 rounded-full border border-[#1E293B]">
                  @{profile?.handle || 'marcus'}
                </span>
              </div>
              <p className="text-sm text-[#94A3B8] mt-1 max-w-xl">
                {profile?.bio || 'Building autonomous tools and tech reviews. 320k+ combined audience across YouTube, X, and Newsletter.'}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[#94A3B8]">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {profile?.categories?.[0] || 'Tech & Engineering'}
                </span>
                <span>•</span>
                <span>240K YouTube</span>
                <span>•</span>
                <span>95K on X</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Accepting Q2/Q3 Brand Inquiries</span>
              </div>
            </div>
          </div>

          <div className="bg-[#090D16]/80 border border-[#1E293B] rounded-2xl p-4 sm:w-64 shrink-0">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
              <span>Standard Response:</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E11D48]" /> &lt; 24 Hours
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
              <span>Minimum Timeline:</span>
              <span className="text-white font-medium">14 Business Days</span>
            </div>
            <div className="h-px bg-[#1E293B] my-2" />
            <div className="text-[11px] text-[#94A3B8]">
              Inquiries are filtered by Marcus's VALLU Assistant to prevent contract friction.
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Offer Details & Parameters Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#E11D48]" />
              <span>Step 1: Proposal Specification</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Brand or Agency Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Supabase, Linear, Notion"
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  value={brandEmail}
                  onChange={(e) => setBrandEmail(e.target.value)}
                  placeholder="partnerships@company.com"
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Q3 Developer Tools Launch"
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Deliverables</label>
                <select
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E11D48]"
                >
                  <option value="1x Dedicated Video + X Thread">1x Dedicated Video + X Thread</option>
                  <option value="60s Mid-roll Integration (YouTube)">60s Mid-roll Integration (YouTube)</option>
                  <option value="Multi-platform Blitz (YouTube + X + Newsletter)">Multi-platform Blitz (YouTube + X + Newsletter)</option>
                  <option value="Newsletter Primary Sponsor Feature">Newsletter Primary Sponsor Feature</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#94A3B8] font-medium">Proposed Budget Offer</label>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    ${budget.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={9000}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono mt-1">
                  <span>$1,000</span>
                  <span>Target: ${settings?.starting_rate_usd?.toLocaleString() || '4,500'}</span>
                  <span>$9,000+</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[#94A3B8] font-medium mb-1">Usage Rights</label>
                  <select
                    value={usageRights}
                    onChange={(e) => setUsageRights(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="30-day organic social">30d Organic</option>
                    <option value="30-day paid whitelisting">30d Paid Whitelist</option>
                    <option value="90-day multi-channel paid">90d Paid Multi</option>
                    <option value="Perpetual buyout rights">Perpetual Buyout (High Flag)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-medium mb-1">Payment Payout</label>
                  <select
                    value={paymentWindow}
                    onChange={(e) => setPaymentWindow(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="Net-15">Net-15 (Preferred)</option>
                    <option value="Net-30">Net-30 (Standard)</option>
                    <option value="Net-60">Net-60 (High Flag)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Category Exclusivity</label>
                <select
                  value={exclusivity}
                  onChange={(e) => setExclusivity(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#E11D48]"
                >
                  <option value="None">None (Standard)</option>
                  <option value="14 days category exclusivity">14 days</option>
                  <option value="30 days category exclusivity">30 days</option>
                  <option value="60 days category exclusivity">60 days (High Flag)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Deal Radar & Score Card */}
          <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
                Live Offer Score
              </span>
              <span
                className={`text-lg font-bold font-mono px-2.5 py-0.5 rounded-full ${
                  currentScore >= 75
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : currentScore >= 50
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {currentScore}/100
              </span>
            </div>

            {/* Red Flags Detector */}
            {detectedRedFlags.length > 0 ? (
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-rose-300 font-semibold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{detectedRedFlags.length} Clause Warning(s)</span>
                </div>
                <ul className="text-[11px] text-rose-300/80 space-y-1 list-disc list-inside">
                  {detectedRedFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3 mb-4 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero clause violations detected against Marcus's commercial policy.</span>
              </div>
            )}

            <button
              onClick={handleSubmitProposal}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4)] hover:shadow-[0_4px_22px_rgba(225,29,72,0.6)] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting to Marcus's Inbox...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Official Proposal (${budget.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Screening Chat Assistant (7 Cols) */}
        <div className="lg:col-span-7 bg-[#131926] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
          {/* Chat Header */}
          <div className="bg-[#090D16]/90 border-b border-[#1E293B] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-rose-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">VALLU Screening Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Autonomous pre-screening for <span className="text-white font-medium">@{profile?.handle || 'marcus'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono">
              <span className="bg-[#1E293B] px-2.5 py-1 rounded-full text-slate-300">
                Turn {counterRound + 1}/3
              </span>
            </div>
          </div>

          {/* Transcript Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-[#94A3B8]">
                      {isBot ? `Marcus's Assistant` : brandName || 'Visiting Brand'}
                    </span>
                    {msg.badge && (
                      <span className="text-[9px] bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">
                        {msg.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                      isBot
                        ? 'bg-[#090D16] border border-[#1E293B] text-slate-200'
                        : 'bg-[#E11D48] text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Counter Chips */}
          <div className="px-4 py-2 bg-[#090D16]/50 border-t border-[#1E293B] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] text-[#94A3B8] uppercase font-mono shrink-0">Quick Options:</span>
            <button
              onClick={() => {
                setBrandInput(`Our target budget is $${settings?.starting_rate_usd || 4500} for 1x dedicated video.`);
              }}
              className="bg-[#1E293B] hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg shrink-0 transition-colors text-[11px]"
            >
              Match Target (${settings?.starting_rate_usd || 4500})
            </button>
            <button
              onClick={() => {
                setBrandInput('We agree to 30-day organic rights with zero category exclusivity.');
              }}
              className="bg-[#1E293B] hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg shrink-0 transition-colors text-[11px]"
            >
              Remove Exclusivity
            </button>
            <button
              onClick={() => {
                setBrandInput('Can we expedite review for a launch in 10 days?');
              }}
              className="bg-[#1E293B] hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg shrink-0 transition-colors text-[11px]"
            >
              Expedited Timeline
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 bg-[#090D16] border-t border-[#1E293B] flex items-center gap-2"
          >
            <input
              type="text"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              placeholder="Ask a question, propose terms, or state target budget..."
              className="flex-1 bg-[#131926] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
            />
            <button
              type="submit"
              disabled={!brandInput.trim()}
              className="bg-[#E11D48] hover:bg-rose-600 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Submission Success Modal */}
      {submittedDealId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-display text-white text-center mb-1">
              Proposal Transmitted to Marcus's Inbox!
            </h3>
            <p className="text-xs text-[#94A3B8] text-center mb-6">
              Your deal has been scored (<strong className="text-white">{currentScore}/100</strong>) and placed in the creator's live review queue.
            </p>

            <div className="bg-[#090D16] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs mb-6 font-mono">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Deal ID:</span>
                <span className="text-white font-semibold">{submittedDealId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Offer Amount:</span>
                <span className="text-emerald-400 font-bold">${budget.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Deliverables:</span>
                <span className="text-slate-300">{deliverables}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Database Status:</span>
                <span className="text-rose-400">
                  {isSupabaseConfigured() ? 'Synced to Supabase Cloud' : 'Persisted to Local Storage'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSubmittedDealId(null);
                  onNavigate('dashboard');
                }}
                className="flex-1 bg-[#E11D48] hover:bg-rose-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>View in Creator Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSubmittedDealId(null)}
                className="px-4 py-2.5 text-xs text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#1E293B] transition-colors"
              >
                Submit Another Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
