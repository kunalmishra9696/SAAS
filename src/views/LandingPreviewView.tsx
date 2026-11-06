import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useCreatorStore } from '../store/creatorStore';
import { CreatorLandingTemplate } from '../components/CreatorLandingTemplate';
import { ArrowLeft, ArrowUpRight, Check, Copy, ExternalLink, Globe, LayoutDashboard, Share2 } from 'lucide-react';

interface LandingPreviewViewProps { onNavigate: (route: PageRoute) => void; }

export const LandingPreviewView: React.FC<LandingPreviewViewProps> = ({ onNavigate }) => {
  const { creator, publishLandingPage, saveDraftLandingPage, isLoading, error: storeError } = useCreatorStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const publicUrl = `${window.location.origin}/c/${creator.handle}`;

  const handlePublish = async () => {
    setSaving(true); setError('');
    try {
      await publishLandingPage();
      setShowPublishModal(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your page could not be published.');
    } finally { setSaving(false); }
  };

  const handleSaveDraft = async () => {
    setSaving(true); setError('');
    try {
      await saveDraftLandingPage();
      onNavigate('dashboard');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your draft could not be saved.');
    } finally { setSaving(false); }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Your browser blocked copying. You can copy the page link from the address field.');
    }
  };

  if (isLoading) return <div className="preview-loading"><span className="auth-spinner" /> Loading your page preview…</div>;

  return <div className="preview-shell">
    <div className="preview-toolbar">
      <button onClick={() => onNavigate('onboarding')}><ArrowLeft size={14} /> Edit details</button>
      <div className="preview-url"><Globe size={13} /><span>PREVIEW</span><b>/c/{creator.handle || 'your-handle'}</b><i>PRIVATE</i></div>
      <div className="preview-actions"><button className="preview-save" onClick={() => void handleSaveDraft()} disabled={saving}>Save draft</button><button className="preview-publish" onClick={() => void handlePublish()} disabled={saving || !creator.name || !creator.handle}>{saving ? 'Saving…' : 'Publish page'} <Share2 size={13} /></button></div>
    </div>
    {(error || storeError) && <div className="preview-error">{error || storeError}</div>}
    <CreatorLandingTemplate creator={creator} isPublic={false} />
    {showPublishModal && <div className="preview-modal-backdrop">
      <section className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="publish-heading">
        <div className="preview-success-icon"><Check size={23} /></div>
        <span className="preview-modal-eyebrow">PUBLISHED SUCCESSFULLY</span>
        <h2 id="publish-heading">Your page is live.</h2>
        <p>Anyone with this link can view your published creator page and send a collaboration enquiry. Your workspace stays private.</p>
        <div className="preview-share-link"><span>{publicUrl}</span><button onClick={() => void handleCopyLink()}><Copy size={13} />{copied ? 'Copied' : 'Copy'}</button></div>
        <div className="preview-modal-actions"><button onClick={() => onNavigate('dashboard')}><LayoutDashboard size={14} /> Open workspace</button><button onClick={() => window.location.assign(publicUrl)}>View public page <ExternalLink size={13} /></button></div>
      </section>
    </div>}
  </div>;
};
