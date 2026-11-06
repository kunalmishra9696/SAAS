import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useCreatorStore, InboundDeal } from '../store/creatorStore';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Eye,
  XCircle,
  FileText,
  Sliders,
  Globe,
  Plus,
  Share2,
  Check,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    creator,
    deals,
    updateDealStatus,
    publishLandingPage,
    saveDraftLandingPage,
    updateCreator,
    addProposal,
  } = useCreatorStore();

  const [activeTab, setActiveTab] = useState<'visible' | 'on_hold' | 'accepted' | 'declined'>('visible');
  const [selectedDeal, setSelectedDeal] = useState<InboundDeal | null>(null);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [tempTarget, setTempTarget] = useState(creator.startingRate);
  const [tempFloor, setTempFloor] = useState(creator.floorRate);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic Pipeline Metric Calculations
  const visibleDeals = deals.filter((d) => d.status === 'visible');
  const onHoldDeals = deals.filter((d) => d.status === 'on_hold');
  const acceptedDeals = deals.filter((d) => d.status === 'accepted');
  const declinedDeals = deals.filter((d) => d.status === 'declined');

  const activePipelineValue = visibleDeals.reduce((sum, d) => sum + d.offeredBudget, 0);
  const acceptedEarningsValue = acceptedDeals.reduce((sum, d) => sum + d.offeredBudget, 0);

  const avgDealValue = deals.length > 0
    ? Math.round(deals.reduce((sum, d) => sum + d.offeredBudget, 0) / deals.length)
    : creator.startingRate;

  const currentTabDeals = deals.filter((d) => d.status === activeTab);

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(`https://vallu.bio/@${creator.handle}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveRates = () => {
    updateCreator({
      startingRate: Number(tempTarget),
      floorRate: Number(tempFloor),
    });
    setIsEditingRates(false);
  };

  const handleSimulateNewInquiry = () => {
    const brands = ['Figma', 'Vercel', 'Raycast', 'OpenAI', 'Arc Browser'];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomBudget = Math.round((creator.floorRate + Math.random() * 2500) / 100) * 100;

    addProposal({
      brandName: randomBrand,
      brandEmail: `partnerships@${randomBrand.toLowerCase().replace(' ', '')}.com`,
      campaignName: `${randomBrand} Q3 Creator Feature`,
      deliverable: '1x Dedicated Video + X Thread Breakdown',
      offeredBudget: randomBudget,
      dealScore: randomBudget >= creator.startingRate ? 94 : 82,
      redFlags: [],
      paymentWindow: 'Net-15',
      usageRights: '60-day digital organic',
      transcript: [
        { sender: 'brand', text: `Hi ${creator.name}, we'd love to partner on our upcoming release with a budget of $${randomBudget.toLocaleString()}.`, time: 'Just now' },
        { sender: 'assistant', text: `Offer passed the autonomous rate screen ($${randomBudget.toLocaleString()}) and has been delivered to ${creator.name}'s inbox.`, time: 'Just now' },
      ],
    });
  };

  return (
    <div className="pt-24 sm:pt-28 pb-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Creator Top Bar & Bio Publication State */}
      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(9,13,22,0.9)]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#1E293B]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#131926]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                {creator.name}
              </h1>
              <span className="text-xs font-mono text-[#94A3B8] bg-[#090D16] px-2.5 py-0.5 rounded-full border border-[#1E293B]">
                vallu.bio/@{creator.handle}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#94A3B8]">
              {creator.isPublished ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live on vallu.bio/@{creator.handle}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Page Draft Saved (Unpublished)
                </span>
              )}
              <span>·</span>
              <span>{creator.followersTotal} Audience</span>
              <span>·</span>
              <span className="text-white font-mono font-semibold">0% Commission Active</span>
            </div>
          </div>
        </div>

        {/* Public Link & Publication Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {creator.isPublished ? (
            <>
              <button
                onClick={handleCopyPublicLink}
                className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-slate-500 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#E11D48]" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Bio Link'}</span>
              </button>

              <button
                onClick={() => onNavigate('public-landing')}
                className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Live Bio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={publishLandingPage}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publish Bio Page Now</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('landing-preview')}
            className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-[#090D16] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            Customize Template
          </button>
        </div>
      </div>

      {/* 2. Dynamic Real-Time Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Deal Pipeline */}
        <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block mb-1">
            Active Deal Pipeline
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            ${activePipelineValue.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">USD</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>{visibleDeals.length} active inbounds</span>
          </div>
        </div>

        {/* Metric 2: Verified Earnings (Accepted) */}
        <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block mb-1">
            Accepted Revenue
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
            ${acceptedEarningsValue.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">USD</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono mt-1">
            {acceptedDeals.length} deals confirmed
          </div>
        </div>

        {/* Metric 3: Starting Target Rate */}
        <div className="bg-[#131926] border border-[#1E293B] rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block mb-1">
            Public Starting Rate
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            ${creator.startingRate.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">USD</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Avg deal size: ${avgDealValue.toLocaleString()}
          </div>
        </div>

        {/* Metric 4: Confidential Floor Rate */}
        <div className="bg-[#131926] border border-rose-900/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <span className="text-[11px] font-mono text-rose-300 uppercase block mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
            Rate Floor (Confidential)
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#E11D48]">
            ${creator.floorRate.toLocaleString()} <span className="text-xs font-normal text-[#94A3B8]">USD</span>
          </div>
          <button
            onClick={() => setIsEditingRates(!isEditingRates)}
            className="text-[10px] text-rose-400 underline font-mono mt-1 hover:text-rose-300"
          >
            {isEditingRates ? 'Close Editor' : 'Edit Rate Limits'}
          </button>
        </div>
      </div>

      {/* Inline Rate Editor drawer */}
      {isEditingRates && (
        <div className="bg-[#131926] border border-[#E11D48]/50 rounded-2xl p-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#E11D48]" />
              <span>Adjust Commercial Rate Parameters</span>
            </h3>
            <span className="text-[11px] text-[#94A3B8]">Instant sync to public landing page</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#94A3B8]">Public Starting Rate</span>
                <span className="font-mono text-white font-bold">${tempTarget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={250}
                value={tempTarget}
                onChange={(e) => setTempTarget(Number(e.target.value))}
                className="w-full accent-[#E11D48] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#94A3B8]">Confidential Floor Rate (Private)</span>
                <span className="font-mono text-[#E11D48] font-bold">${tempFloor.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={tempTarget}
                step={200}
                value={tempFloor}
                onChange={(e) => setTempFloor(Number(e.target.value))}
                className="w-full accent-[#E11D48] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#1E293B]">
            <button
              onClick={() => setIsEditingRates(false)}
              className="px-3.5 py-1.5 text-xs text-[#94A3B8] hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRates}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#E11D48] hover:bg-rose-600 rounded-lg transition-colors"
            >
              Save Rate Limits
            </button>
          </div>
        </div>
      )}

      {/* 3. Deal Inbox Section with 4 Tabs */}
      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Sponsor Proposal Inbox
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Screened inbound inquiries from your public bio page.
            </p>
          </div>

          {/* Quick Simulation Button */}
          <button
            onClick={handleSimulateNewInquiry}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#E11D48] text-rose-300 hover:text-white transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>Simulate Brand Offer</span>
          </button>
        </div>

        {/* 4 Inbox Tabs */}
        <div className="flex items-center gap-1 border-b border-[#1E293B] pb-2 text-xs font-medium overflow-x-auto">
          {[
            { id: 'visible', label: 'Visible Pipeline', count: visibleDeals.length },
            { id: 'on_hold', label: 'On Hold', count: onHoldDeals.length },
            { id: 'accepted', label: 'Accepted Deals', count: acceptedDeals.length },
            { id: 'declined', label: 'Declined', count: declinedDeals.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#1E293B] text-white font-bold shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/40'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-[#E11D48] text-white' : 'bg-[#090D16] text-[#94A3B8]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Deals List */}
        {currentTabDeals.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#94A3B8] space-y-2">
            <p>No proposals currently in the {activeTab.replace('_', ' ')} queue.</p>
            <p className="text-[11px] text-slate-500">
              When brands submit through your public link, proposals automatically populate here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentTabDeals.map((deal) => {
              const uplift = deal.offeredBudget - creator.floorRate;
              return (
                <div
                  key={deal.id}
                  className="bg-[#090D16] border border-[#1E293B] hover:border-slate-600 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-white">
                        {deal.brandName}
                      </span>
                      <span className="text-[11px] text-[#94A3B8] font-mono">
                        {deal.campaignName}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          deal.dealScore >= 80
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60'
                            : 'bg-rose-950/40 text-rose-400 border border-rose-900/60'
                        }`}
                      >
                        Score: {deal.dealScore}/100
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                      <span className="text-slate-300">{deal.deliverable}</span>
                      <span>·</span>
                      <span>{deal.submittedAt}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-mono">
                        {uplift >= 0 ? `+$${uplift.toLocaleString()} above floor` : `Below floor`}
                      </span>
                    </div>
                  </div>

                  {/* Financial & Status Action Zone */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#1E293B]">
                    <div className="text-right">
                      <span className="text-[10px] text-[#94A3B8] uppercase block font-mono">Offer Amount</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">
                        ${deal.offeredBudget.toLocaleString()} <span className="text-xs font-normal">USD</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeTab === 'visible' && (
                        <>
                          <button
                            onClick={() => updateDealStatus(deal.id, 'accepted')}
                            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#E11D48] hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                            title="Accept Deal & Send Invoice"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Accept</span>
                          </button>

                          <button
                            onClick={() => updateDealStatus(deal.id, 'on_hold')}
                            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs text-[#94A3B8] hover:text-white transition-colors"
                            title="Put On Hold"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => updateDealStatus(deal.id, 'declined')}
                            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#1E293B] hover:bg-rose-950/40 text-xs text-rose-400 transition-colors"
                            title="Decline Deal"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {activeTab === 'on_hold' && (
                        <button
                          onClick={() => updateDealStatus(deal.id, 'visible')}
                          className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs text-white transition-colors"
                        >
                          Move to Inbox
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedDeal(deal)}
                        className="p-2 rounded-xl bg-[#131926] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white transition-colors"
                        title="Inspect Deal Scope & Transcript"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Deal Inspection Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1E293B]">
              <div>
                <h3 className="text-base font-bold text-white">{selectedDeal.brandName}</h3>
                <span className="text-xs text-[#94A3B8] font-mono">{selectedDeal.brandEmail}</span>
              </div>
              <span className="text-base font-mono font-bold text-emerald-400">
                ${selectedDeal.offeredBudget.toLocaleString()} USD
              </span>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="bg-[#090D16] p-3 rounded-xl border border-[#1E293B] space-y-1">
                <span className="text-[#94A3B8] uppercase text-[10px] font-mono block">Deliverables Scope</span>
                <p className="text-white font-medium">{selectedDeal.deliverable}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#090D16] p-3 rounded-xl border border-[#1E293B]">
                  <span className="text-[#94A3B8] text-[10px] font-mono block">Rights Duration</span>
                  <span className="text-white">{selectedDeal.usageRights}</span>
                </div>
                <div className="bg-[#090D16] p-3 rounded-xl border border-[#1E293B]">
                  <span className="text-[#94A3B8] text-[10px] font-mono block">Payment Terms</span>
                  <span className="text-white">{selectedDeal.paymentWindow}</span>
                </div>
              </div>

              {/* Negotiation Transcript */}
              <div className="bg-[#090D16] p-3 rounded-xl border border-[#1E293B] space-y-2">
                <span className="text-[#94A3B8] text-[10px] font-mono block">Negotiation Log</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedDeal.transcript.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg text-[11px] ${
                        msg.sender === 'brand'
                          ? 'bg-[#131926] text-slate-300'
                          : 'bg-[#E11D48]/15 text-rose-200 border border-rose-500/20'
                      }`}
                    >
                      <span className="text-[9px] font-bold font-mono block text-[#94A3B8]">
                        {msg.sender === 'brand' ? selectedDeal.brandName : 'VALLU Assistant'} · {msg.time}
                      </span>
                      {msg.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDeal(null)}
                className="flex-1 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#090D16] transition-colors"
              >
                Close
              </button>

              {selectedDeal.status !== 'accepted' && (
                <button
                  onClick={() => {
                    updateDealStatus(selectedDeal.id, 'accepted');
                    setSelectedDeal(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#E11D48] hover:bg-rose-600 rounded-xl transition-colors shadow-md"
                >
                  Accept Deal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
