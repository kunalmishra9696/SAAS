import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Shield, FileText, Clock, Lock, CheckCircle2 } from 'lucide-react';

interface LegalViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'retention'>('terms');

  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-28 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
          <span>LEGAL & COMPLIANCE CENTER</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F1F5F9] tracking-tight">
          Trust, Privacy & <span className="text-[#E11D48]">Legal Terms</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          Last revised: November 2026 · Master Beta Specification
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10 pb-4 border-b border-[#1E293B] overflow-x-auto">
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'terms'
              ? 'bg-[#E11D48] text-white shadow-sm'
              : 'bg-[#131926] text-[#94A3B8] border border-[#1E293B] hover:text-[#F1F5F9]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Service</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'bg-[#E11D48] text-white shadow-sm'
              : 'bg-[#131926] text-[#94A3B8] border border-[#1E293B] hover:text-[#F1F5F9]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy & Confidentiality</span>
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'retention'
              ? 'bg-[#E11D48] text-white shadow-sm'
              : 'bg-[#131926] text-[#94A3B8] border border-[#1E293B] hover:text-[#F1F5F9]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>14-Day Expiry & Retention</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-5 sm:p-10 text-xs sm:text-sm text-[#94A3B8] space-y-6 leading-relaxed shadow-[0_20px_50px_rgba(9,13,22,0.9)]">
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-[#1E293B] pb-4">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#F1F5F9]">Terms of Service</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Please read these terms carefully before deploying a VALLU creator bio link.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">1. Nature of the Service & Non-Escrow Policy</h3>
              <p>
                VALLU provides software tools to facilitate brand inquiries and structured communication between content creators and commercial sponsors. VALLU is strictly a software provider. VALLU is <strong>NOT</strong> an escrow agent, payment processor, or financial intermediary. All payments, deliverables, and commercial engagements occur directly between the creator and the sponsor.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">2. Autonomous Assistant & Final Creator Authority</h3>
              <p>
                The VALLU Brand Inquiry Assistant operates under creator-defined instructions. While the assistant screens inquiries and provides counter-offers based on configured rate rules, <strong>the assistant never accepts a deal automatically on behalf of the creator</strong>. The creator retains 100% unilateral authority to approve, reject, or place on hold any brand offer.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">3. Zero Commission in V1 Beta</h3>
              <p>
                During the V1 Beta period, VALLU charges 0% commission on deal transactions. Creators receive 100% of the funds disbursed by collaborating brands.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-[#1E293B] pb-4">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#F1F5F9]">Privacy & Rate Confidentiality Policy</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Our strict policy regarding your financial settings and conversation transcripts.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">1. Absolute Confidentiality of Private Minimums</h3>
              <p>
                Your absolute minimum floor rate is never shared with, displayed to, or leaked to visiting brands or third-party advertisers. All negotiation heuristics operate on server-side functions with strict Row Level Security (RLS).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">2. Zero Third-Party Ad Tracking</h3>
              <p>
                VALLU does not embed cross-site advertising pixels, biometric fingerprinting, or behavioral trackers on public creator landing pages.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">3. Public Brand Chat Notice</h3>
              <p>
                Brands are notified prior to initiating an inquiry that their conversation is logged and made available to the creator for deal review and compliance purposes.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'retention' && (
          <div className="space-y-6">
            <div className="border-b border-[#1E293B] pb-4">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#F1F5F9]">14-Day Expiry & Auto-Decline Schedule</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Preventing stale proposals from cluttering creator and brand pipelines.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">1. Standard 14-Day Countdown</h3>
              <p>
                Every completed inquiry submitted through a creator’s VALLU link remains valid for exactly 14 calendar days from the receipt date. Reminders are triggered at 3 days and 24 hours remaining.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">2. "On Hold" Behavior</h3>
              <p>
                A creator may move an offer to the "On Hold" section to review with management. Under VALLU rules, moving an offer to On Hold does <strong>not</strong> restart the original 14-day clock. Upon expiration, the offer is automatically declined.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#F1F5F9] text-sm">3. Automated Brand Outcome Notification</h3>
              <p>
                When an offer expires without acceptance, a polite, automated outcome email is dispatched to the brand contact so neither party is left guessing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
