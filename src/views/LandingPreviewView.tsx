import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useCreatorStore } from '../store/creatorStore';
import { CreatorLandingTemplate } from '../components/CreatorLandingTemplate';
import { ArrowLeft, Check, Copy, ExternalLink, Globe, LayoutDashboard, Share2 } from 'lucide-react';

interface LandingPreviewViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const LandingPreviewView: React.FC<LandingPreviewViewProps> = ({ onNavigate }) => {
  const { creator, publishLandingPage, saveDraftLandingPage } = useCreatorStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = `https://vallu.bio/@${creator.handle}`;

  const handlePublish = () => {
    publishLandingPage();
    setShowPublishModal(true);
  };

  const handleSaveDraft = () => {
    saveDraftLandingPage();
    onNavigate('dashboard');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090D16]">
      {/* Sticky Top Control Toolbar */}
      <div className="sticky top-0 z-50 bg-[#131926]/95 backdrop-blur-xl border-b border-[#1E293B] px-4 sm:px-6 py-3 shadow-[0_10px_30px_rgba(9,13,22,0.9)]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Onboarding */}
          <button
            onClick={() => onNavigate('onboarding')}
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-xl hover:bg-[#1E293B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit In Onboarding</span>
          </button>

          {/* Center: Live URL Preview pill */}
          <div className="flex items-center gap-2 bg-[#090D16] border border-[#1E293B] rounded-full px-3.5 py-1 text-xs font-mono text-[#94A3B8]">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Previewing:</span>
            <span className="text-white font-semibold">vallu.bio/@{creator.handle}</span>
            <span className="text-[10px] bg-[#1E293B] text-rose-300 px-1.5 py-0.5 rounded">
              Draft
            </span>
          </div>

          {/* Right: Draft vs Publish Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-1.5 rounded-full border border-[#1E293B] hover:border-slate-500 bg-[#090D16] text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
            >
              Save as Draft
            </button>

            <button
              onClick={handlePublish}
              className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs shadow-[0_2px_14px_rgba(225,29,72,0.4)] transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Publish Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render the full combined Landing Template */}
      <CreatorLandingTemplate creator={creator} isPublic={false} />

      {/* Publish Success Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-2">
              Your Public Landing Page is Live!
            </h3>
            <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
              Anyone with this link can now view your bespoke creator portfolio, check packages, and submit sponsorship proposals directly into your private dashboard.
            </p>

            {/* Copyable Share URL Bar */}
            <div className="bg-[#090D16] border border-[#1E293B] rounded-2xl p-2.5 flex items-center justify-between gap-2 mb-6">
              <span className="text-xs font-mono text-white truncate pl-2">{publicUrl}</span>
              <button
                onClick={handleCopyLink}
                className="bg-[#1E293B] hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-xl transition-colors shrink-0 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Enter Creator Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('public-landing')}
                className="w-full py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1E293B] text-xs text-[#94A3B8] hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Public Visitor Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
