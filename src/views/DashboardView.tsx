import React, { useEffect, useMemo, useState } from 'react';
import { PageRoute } from '../types';
import { InboundDeal, useCreatorStore } from '../store/creatorStore';
import { supabase } from '../lib/supabase';
import {
  ArrowUpRight, BarChart3, Check, CheckCircle2, Clock3, Copy, Eye,
  FileText, Globe2, LayoutDashboard, LockKeyhole, LogOut, MessageSquare,
  MoreHorizontal, Pause, ShieldCheck, Sparkles, TrendingUp, X, XCircle
} from 'lucide-react';

interface DashboardViewProps { onNavigate: (route: PageRoute) => void; }
type InboxTab = 'visible' | 'hidden' | 'unfinished' | 'on_hold' | 'accepted' | 'declined';

const tabLabels: { id: InboxTab; label: string }[] = [
  { id: 'visible', label: 'Visible' }, { id: 'hidden', label: 'Hidden' },
  { id: 'unfinished', label: 'Unfinished' }, { id: 'on_hold', label: 'On hold' },
  { id: 'accepted', label: 'Accepted' }, { id: 'declined', label: 'Declined' },
];

const currency = (amount: number, code: string) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: code, maximumFractionDigits: 0,
}).format(amount);

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { creator, deals, isLoading, error: storeError, updateCreator, updateDealStatus, refresh } = useCreatorStore();
  const [tab, setTab] = useState<InboxTab>('visible');
  const [selected, setSelected] = useState<InboundDeal | null>(null);
  const [editingRates, setEditingRates] = useState(false);
  const [target, setTarget] = useState('');
  const [minimum, setMinimum] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [copied, setCopied] = useState(false);
  const [analytics, setAnalytics] = useState<{ day: string; page_views: number; unique_visitors: number; link_clicks: number; inquiry_starts: number; completed_inquiries: number }[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    setTarget(creator.startingRate ? String(creator.startingRate) : '');
    setMinimum(creator.floorRate ? String(creator.floorRate) : '');
  }, [creator.startingRate, creator.floorRate]);

  useEffect(() => {
    let active = true;
    const loadAnalytics = async () => {
      if (!supabase) { setAnalyticsLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAnalyticsLoading(false); return; }
      const from = new Date(); from.setDate(from.getDate() - 29);
      const { data, error } = await supabase.from('analytics_daily')
        .select('day,page_views,unique_visitors,link_clicks,inquiry_starts,completed_inquiries')
        .eq('creator_id', user.id)
        .gte('day', from.toISOString().slice(0, 10))
        .order('day', { ascending: true });
      if (!active) return;
      if (!error) setAnalytics((data || []) as typeof analytics);
      setAnalyticsLoading(false);
    };
    void loadAnalytics();
    return () => { active = false; };
  }, []);

  const totals = useMemo(() => analytics.reduce((sum, day) => ({
    views: sum.views + day.page_views,
    visitors: sum.visitors + day.unique_visitors,
    clicks: sum.clicks + day.link_clicks,
    starts: sum.starts + day.inquiry_starts,
    completed: sum.completed + day.completed_inquiries,
  }), { views: 0, visitors: 0, clicks: 0, starts: 0, completed: 0 }), [analytics]);

  const visible = deals.filter((deal) => deal.status === 'visible');
  const accepted = deals.filter((deal) => deal.status === 'accepted');
  const activeDeals = deals.filter((deal) => ['visible', 'hidden', 'on_hold'].includes(deal.status));
  const pipelineValue = visible.reduce((sum, deal) => sum + (deal.currency === creator.currency ? deal.offeredBudget : 0), 0);
  const currentDeals = deals.filter((deal) => deal.status === tab);
  const peakViews = Math.max(1, ...analytics.map((day) => day.page_views));

  const publicUrl = `${window.location.origin}/c/${creator.handle}`;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setActionError('Copying was blocked by your browser. Copy the link from the address field instead.');
    }
  };

  const saveRates = async () => {
    setSaving(true); setActionError('');
    try {
      await updateCreator({ startingRate: Number(target) || 0, floorRate: Number(minimum) || 0 });
      setEditingRates(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Rates could not be saved.');
    } finally { setSaving(false); }
  };

  const changeStatus = async (deal: InboundDeal, status: InboundDeal['status']) => {
    setSaving(true); setActionError('');
    try {
      await updateDealStatus(deal.id, status);
      setSelected(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'The offer could not be updated.');
    } finally { setSaving(false); }
  };

  const currencyCode = creator.currency || 'INR';

  return <div className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <button className="dashboard-wordmark" onClick={() => onNavigate('home')}><span>✳</span> VALLU</button>
      <div className="dashboard-profile"><div className="dashboard-avatar">{creator.name ? creator.name.slice(0, 1).toUpperCase() : 'C'}</div><span><b>{creator.name || 'Creator'}</b><small>Creator workspace</small></span><MoreHorizontal size={16} /></div>
      <div className="dashboard-nav-label">WORKSPACE</div>
      <div className="dashboard-nav-item active"><LayoutDashboard size={15} /> Overview</div>
      <button className="dashboard-nav-item" onClick={() => { setTab('visible'); document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' }); }}><MessageSquare size={15} /> Brand enquiries <span>{deals.filter((deal) => ['visible', 'hidden', 'unfinished'].includes(deal.status)).length}</span></button>
      <button className="dashboard-nav-item" onClick={() => onNavigate('landing-preview')}><Globe2 size={15} /> Public page <ArrowUpRight size={12} /></button>
      <button className="dashboard-nav-item" onClick={() => setEditingRates(true)}><LockKeyhole size={15} /> Private rate rules</button>
      <div className="dashboard-sidebar-bottom">
        <div className="dashboard-sidebar-note"><ShieldCheck size={14} /><span>Your rules stay private.<small>Every deal needs your approval.</small></span></div>
        <button className="dashboard-nav-item" onClick={async () => { await supabase?.auth.signOut(); onNavigate('login'); }}><LogOut size={15} /> Sign out</button>
      </div>
    </aside>

    <main className="dashboard-main">
      <div className="dashboard-mobile-head"><span>✳ VALLU</span><button onClick={async () => { await supabase?.auth.signOut(); onNavigate('login'); }}><LogOut size={15} /></button></div>
      <div className="dashboard-topline"><div><span>YOUR CREATOR WORKSPACE</span><div className="dashboard-live-indicator"><i /> PRIVATE SESSION</div></div><button className="dashboard-quiet-button" onClick={() => void refresh()}>Refresh data</button></div>

      <header className="dashboard-heading">
        <div><small>OVERVIEW / TODAY</small><h1>Good to see you{creator.name ? `, ${creator.name.split(' ')[0]}.` : '.'}</h1><p>Your creator page and brand conversations, in one place.</p></div>
        <div className="dashboard-page-state"><span className={creator.isPublished ? 'published' : ''} />{creator.isPublished ? 'PAGE PUBLISHED' : 'PAGE IN DRAFT'}<button onClick={() => onNavigate('landing-preview')}>{creator.isPublished ? 'View page' : 'Finish page'} <ArrowUpRight size={13} /></button></div>
      </header>

      {(storeError || actionError) && <div className="dashboard-alert"><XCircle size={15} /> {actionError || storeError}</div>}

      <section className="dashboard-metric-grid">
        <article className="dashboard-metric"><div><span>PAGE VIEWS</span><Eye size={15} /></div><strong>{analyticsLoading ? '—' : totals.views.toLocaleString('en-IN')}</strong><small>Last 30 days</small></article>
        <article className="dashboard-metric"><div><span>UNIQUE VISITORS*</span><TrendingUp size={15} /></div><strong>{analyticsLoading ? '—' : totals.visitors.toLocaleString('en-IN')}</strong><small>Privacy-friendly estimate</small></article>
        <article className="dashboard-metric"><div><span>INQUIRY STARTS</span><MessageSquare size={15} /></div><strong>{analyticsLoading ? '—' : totals.starts.toLocaleString('en-IN')}</strong><small>{totals.completed} completed</small></article>
        <article className="dashboard-metric"><div><span>ACTIVE OFFERS</span><FileText size={15} /></div><strong>{deals.filter((deal) => ['visible', 'hidden', 'on_hold'].includes(deal.status)).length.toString().padStart(2, '0')}</strong><small>{visible.length} ready for review</small></article>
      </section>

      <section className="dashboard-analytics-panel">
        <div className="dashboard-section-head"><div><span>PAGE PERFORMANCE</span><h2>Visitors over time</h2></div><div className="analytics-period">LAST 30 DAYS</div></div>
        {analyticsLoading ? <div className="dashboard-chart-empty">Loading your analytics…</div> : analytics.length === 0 || totals.views === 0
          ? <div className="dashboard-chart-empty"><BarChart3 size={22} /><b>Your page analytics will appear here.</b><span>Publish your page and share its link to start recording views.</span></div>
          : <div className="dashboard-bar-chart" aria-label="Page views per day for the last thirty days">{analytics.map((day) => <div className="dashboard-bar-column" key={day.day} title={`${day.day}: ${day.page_views} views`}><span style={{ height: `${Math.max(3, day.page_views / peakViews * 100)}%` }} /><small>{new Date(day.day).getDate()}</small></div>)}</div>}
        <div className="dashboard-chart-foot"><span>*Unique visitor counts are privacy-friendly daily estimates, not cross-site tracking.</span><span><i /> Page views</span></div>
      </section>

      <section className="dashboard-offers" id="offers">
        <div className="dashboard-section-head"><div><span>THE INBOX</span><h2>Brand enquiries</h2></div><span className="dashboard-count">{deals.length} TOTAL</span></div>
        <div className="dashboard-tabs">{tabLabels.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>{item.label}<span>{deals.filter((deal) => deal.status === item.id).length}</span></button>)}</div>
        {isLoading ? <div className="dashboard-empty">Loading your enquiries…</div> : currentDeals.length === 0
          ? <div className="dashboard-empty"><div className="dashboard-empty-icon"><MessageSquare size={19} /></div><b>{tab === 'visible' ? 'No offers need your attention.' : `No ${tab.replace('_', ' ')} enquiries.`}</b><p>{tab === 'visible' ? 'When a brand completes an enquiry on your published page, it will appear here.' : 'This section will fill when there is something to review.'}</p></div>
          : <div className="dashboard-offer-list">{currentDeals.map((deal) => <button className="dashboard-offer-row" key={deal.id} onClick={() => setSelected(deal)}>
              <span className="dashboard-brand-square">{deal.brandName.slice(0, 1).toUpperCase()}</span>
              <span className="dashboard-offer-main"><b>{deal.brandName}</b><small>{deal.campaignName || 'Collaboration enquiry'} · {new Date(deal.submittedAt).toLocaleDateString()}</small></span>
              <span className="dashboard-offer-value">{currency(deal.offeredBudget, deal.currency)}<small>{deal.deliverable}</small></span>
              <span className={`dashboard-offer-score ${deal.dealScore >= 50 ? 'good' : 'low'}`}>{(deal.dealScore / 10).toFixed(1)}<small>/10</small></span>
              <ArrowUpRight size={15} />
            </button>)}</div>}
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-settings-card"><div className="dashboard-section-head"><div><span>PRIVATE SETTINGS</span><h2>Your rate boundaries</h2></div><LockKeyhole size={16} /></div>
          {editingRates ? <div className="dashboard-rate-edit"><label>Target rate <input type="number" min="0" value={target} onChange={(event) => setTarget(event.target.value)} /></label><label>Private minimum <input type="number" min="0" value={minimum} onChange={(event) => setMinimum(event.target.value)} /></label><div><button onClick={() => setEditingRates(false)}>Cancel</button><button onClick={() => void saveRates()} disabled={saving}>{saving ? 'Saving…' : 'Save rates'}</button></div></div>
          : <><div className="dashboard-rate-values"><div><small>TARGET</small><b>{creator.startingRate ? currency(creator.startingRate, currencyCode) : 'Not set'}</b></div><div><small>PRIVATE MINIMUM</small><b>{creator.floorRate ? currency(creator.floorRate, currencyCode) : 'Not set'}</b></div></div><button className="dashboard-text-link" onClick={() => setEditingRates(true)}>Edit private rate rules <ArrowUpRight size={13} /></button></>}
        </article>
        <article className="dashboard-settings-card"><div className="dashboard-section-head"><div><span>YOUR PUBLIC PRESENCE</span><h2>Creator page</h2></div><Globe2 size={16} /></div>
          <p>{creator.isPublished ? 'Your page is live. Share it with the brands you want to hear from.' : 'Your page is still private. Preview it and publish when you’re ready.'}</p>
          <div className="dashboard-public-link"><span>{creator.handle ? `${window.location.host}/c/${creator.handle}` : 'Add your public handle'}</span><button onClick={() => creator.handle && void handleCopyLink()} disabled={!creator.isPublished || !creator.handle}><Copy size={13} />{copied ? 'Copied' : 'Copy'}</button></div>
          <button className="dashboard-text-link" onClick={() => onNavigate('landing-preview')}>Edit and preview page <ArrowUpRight size={13} /></button>
        </article>
      </section>
      <footer className="dashboard-footer"><span>VALLU WORKSPACE</span><span>Private by design · Creator decides</span></footer>
    </main>

    {selected && <div className="dashboard-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section className="dashboard-deal-modal" role="dialog" aria-modal="true" aria-labelledby="deal-title">
        <div className="dashboard-modal-head"><div><span>COLLABORATION REVIEW</span><h2 id="deal-title">{selected.brandName}</h2><p>{selected.campaignName || 'Brand enquiry'}</p></div><button onClick={() => setSelected(null)} aria-label="Close offer"><X size={18} /></button></div>
        <div className="dashboard-deal-scoreline"><div><small>OFFER SCORE</small><strong>{(selected.dealScore / 10).toFixed(1)}<span>/10</span></strong></div><div><small>PROPOSED AMOUNT</small><strong>{currency(selected.offeredBudget, selected.currency)}</strong></div></div>
        <div className="dashboard-deal-details"><div><small>DELIVERABLES</small><b>{selected.deliverable}</b></div><div><small>USAGE RIGHTS</small><b>{selected.usageRights}</b></div><div><small>PAYMENT TERMS</small><b>{selected.paymentWindow}</b></div><div><small>BRAND CONTACT</small><b>{selected.brandEmail || 'Not provided'}</b></div><div><small>DECISION DEADLINE</small><b>{selected.expiresAt ? new Date(selected.expiresAt).toLocaleString() : 'Not set'}</b></div></div>
        {selected.redFlags.length > 0 && <div className="dashboard-red-flags"><b>Points to review</b>{selected.redFlags.map((flag) => <span key={flag}><i />{flag}</span>)}</div>}
        <div className="dashboard-transcript"><div className="dashboard-transcript-head"><span>FULL CONVERSATION</span><small>{selected.transcript.length} MESSAGES</small></div>
          {selected.transcript.length === 0 ? <p>No transcript was stored for this enquiry.</p> : selected.transcript.map((message, index) => <div className={`dashboard-message ${message.sender === 'brand' ? 'from-brand' : 'from-assistant'}`} key={`${selected.id}-${index}`}><small>{message.sender === 'brand' ? selected.brandName : 'VALLU assistant'} · {message.time}</small>{message.text}</div>)}
        </div>
        <div className="dashboard-modal-actions">
          <button onClick={() => setSelected(null)} className="dashboard-modal-close">Close</button>
          {selected.status !== 'on_hold' && !['accepted','declined','unfinished'].includes(selected.status) && <button onClick={() => void changeStatus(selected, 'on_hold')} disabled={saving} className="dashboard-modal-hold"><Pause size={13} /> Hold</button>}
          {!['accepted','declined','unfinished'].includes(selected.status) && <button onClick={() => void changeStatus(selected, 'declined')} disabled={saving} className="dashboard-modal-decline"><XCircle size={13} /> Decline</button>}
          {!['accepted','declined','unfinished'].includes(selected.status) && <button onClick={() => void changeStatus(selected, 'accepted')} disabled={saving} className="dashboard-modal-accept"><Check size={13} /> Accept proposal</button>}
        </div>
        <p className="dashboard-decision-note"><ShieldCheck size={12} /> Accepting creates a deal record. The platform does not collect or transfer the payment.</p>
      </section>
    </div>}
  </div>;
};
