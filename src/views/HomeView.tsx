import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronRight,
  CircleDollarSign, Clock3, Instagram, LockKeyhole, MessageCircle, Play,
  ShieldCheck, Sparkles, TrendingUp, Youtube, Zap
} from 'lucide-react';

interface HomeViewProps { onNavigate: (route: PageRoute) => void; }

const flow = [
  { n: '01', title: 'Share one link', copy: 'A polished home for every brand that wants to work with you.', icon: ArrowUpRight },
  { n: '02', title: 'Let the assistant ask', copy: 'Campaign details arrive in one clear, guided conversation.', icon: MessageCircle },
  { n: '03', title: 'Review with context', copy: 'See the terms, the score and the full conversation. You decide.', icon: ShieldCheck },
];

const features = [
  { n: '01', icon: Sparkles, title: 'A page that feels like you', copy: 'A personal landing page built around your work, audience and point of view.', tag: 'YOUR PRESENCE' },
  { n: '02', icon: MessageCircle, title: 'A better first conversation', copy: 'The inquiry assistant gathers the details you would otherwise chase in DMs.', tag: 'LESS BACK-AND-FORTH' },
  { n: '03', icon: LockKeyhole, title: 'Your rules stay private', copy: 'Set your rates, boundaries and deal-breakers. Your private minimum stays private.', tag: 'CREATOR CONTROL' },
  { n: '04', icon: TrendingUp, title: 'Offers with a reason', copy: 'Understand the money, usage rights, exclusivity and payment terms at a glance.', tag: 'CLEAR DECISIONS' },
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [phase, setPhase] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setPhase((value) => (value + 1) % 3), 3200);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  const cta = () => onNavigate('signup');

  return (
    <div className="site-home">
      <section className="home-hero">
        <div className="hero-grid-glow" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-pulse" /> CREATOR-FIRST DEAL DESK <span className="eyebrow-line" /></div>
          <h1>Make every<br />brand enquiry <span>work harder.</span></h1>
          <p className="hero-lede">One link for your work. One assistant for the first conversation. Every deal stays in your hands.</p>
          <div className="hero-actions">
            <button className="button-primary" onClick={cta}>Build my page <ArrowUpRight size={16} /></button>
            <button className="button-quiet" onClick={() => onNavigate('how-it-works')}><span className="play-disc"><Play size={10} fill="currentColor" /></span> See how it works</button>
          </div>
          <div className="hero-note"><ShieldCheck size={14} /> Your rules. Your review. Your final decision.</div>
        </div>

        <div className="hero-visual" aria-label="Illustrative preview of the brand inquiry workflow">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="float-label float-label-top"><span className="mini-dot red-dot" /> INQUIRY RECEIVED <span>NOW</span></div>
          <div className="inbox-window">
            <div className="window-top">
              <div className="window-dots"><i /><i /><i /></div>
              <span>BRAND ASSISTANT <b>• LIVE PREVIEW</b></span>
              <span className="window-more">···</span>
            </div>
            <div className="chat-body">
              <div className="chat-meta"><span className="brand-avatar">N</span><span><b>Northstar Audio</b><small>Brand enquiry</small></span><span className="chat-time">10:42 AM</span></div>
              <div className="chat-bubble brand-bubble">We’re planning a creator campaign for our new headphones. Could you share your rates?</div>
              <div className="assistant-line"><span className="assistant-avatar"><Sparkles size={13} /></span><span>VALLU assistant</span><i /></div>
              <div className="chat-bubble assistant-bubble" key={phase}>
                {phase === 0 && 'Happy to help. What deliverables are you considering for this campaign?'}
                {phase === 1 && 'Thanks. What budget range has been allocated for the collaboration?'}
                {phase === 2 && 'And would the content need paid usage or organic-only rights?'}
              </div>
              <div className="quick-replies"><span>1 Instagram Reel</span><span>Organic only</span></div>
            </div>
            <div className="chat-compose"><span>Message the assistant…</span><span className="send-button"><ArrowUpRight size={14} /></span></div>
          </div>
          <div className="offer-float">
            <div className="offer-top"><span className="offer-check"><Check size={12} /></span><span>OFFER REVIEW</span><span className="offer-ready">READY</span></div>
            <div className="offer-price"><small>Proposed collaboration</small><strong>$3,100</strong><span>USD · one campaign</span></div>
            <div className="score-row"><span>Offer fit</span><strong>8.6 <small>/ 10</small></strong></div>
            <div className="score-track"><i /></div>
            <div className="offer-foot"><ShieldCheck size={12} /> Creator approval required</div>
          </div>
          <div className="float-label float-label-bottom"><span className="mini-dot orange-dot" /> PRIVATE RATE SETTINGS <LockKeyhole size={11} /></div>
          <div className="hero-cross cross-a">✳</div><div className="hero-cross cross-b">✦</div>
        </div>
        <div className="hero-bottomline"><span>ONE CREATOR LINK</span><i /><span>BETTER BRAND ENQUIRIES</span><i /><span>YOU MAKE THE CALL</span></div>
      </section>

      <section className="signal-strip" data-reveal>
        <span className="signal-label">BUILT AROUND THE WAY CREATORS WORK</span>
        <div><Youtube size={17} /> YouTube</div><div><Instagram size={17} /> Instagram</div><div><Play size={15} /> Short-form</div><div><CircleDollarSign size={17} /> Paid partnerships</div>
      </section>

      <section className="section-workflow page-section" data-reveal>
        <div className="section-heading">
          <div><span className="section-index">01 / THE FLOW</span><h2>From “hey, interested?”<br /><em>to a deal worth reviewing.</em></h2></div>
          <p>No scattered DMs. No guessing what the brand actually wants. Just a clearer way to start.</p>
        </div>
        <div className="flow-steps">
          {flow.map((step, index) => {
            const Icon = step.icon;
            return <article className="flow-step" key={step.n}>
              <div className="flow-top"><span>{step.n}</span><Icon size={19} /></div>
              <h3>{step.title}</h3><p>{step.copy}</p>
              {index < 2 && <ArrowDownRight className="flow-arrow" size={22} />}
            </article>;
          })}
        </div>
      </section>

      <section className="section-interface page-section" data-reveal>
        <div className="section-heading compact-heading">
          <div><span className="section-index">02 / THE WORKSPACE</span><h2>Know what’s on<br /><em>the table.</em></h2></div>
          <p>A useful overview, not a wall of dashboards. Every important detail has a place.</p>
        </div>
        <div className="workspace-demo">
          <div className="workspace-sidebar">
            <div className="workspace-brand"><span className="brand-glyph">✳</span> VALLU</div>
            <div className="workspace-user"><div className="user-orb">JS</div><span><b>Jamie Smith</b><small>Creator workspace</small></span><span className="side-dots">···</span></div>
            <div className="side-nav active"><span className="side-icon">▦</span> Overview</div>
            <div className="side-nav"><span className="side-icon">◫</span> Brand enquiries <b>2</b></div>
            <div className="side-nav"><span className="side-icon">↗</span> Public page</div>
            <div className="side-nav"><span className="side-icon">◎</span> Deal settings</div>
            <div className="sidebar-bottom"><span className="mini-dot red-dot" /> YOUR WORKSPACE</div>
          </div>
          <div className="workspace-main">
            <div className="workspace-title"><div><small>MONDAY, 06 NOVEMBER</small><h3>Your workspace<span>.</span></h3></div><button onClick={cta}>Get your link <ArrowUpRight size={13} /></button></div>
            <div className="workspace-stats">
              <div><small>PAGE STATUS</small><strong><span className="status-dot" /> Draft</strong><em>Ready to publish</em></div>
              <div><small>NEW ENQUIRIES</small><strong>02</strong><em>Awaiting your review</em></div>
              <div><small>ACTIVE OFFERS</small><strong>01</strong><em>One needs a decision</em></div>
            </div>
            <div className="workspace-lower">
              <div className="enquiry-panel">
                <div className="panel-head"><b>Recent enquiries</b><span>VIEW ALL <ChevronRight size={12} /></span></div>
                <div className="enquiry-row"><div className="brand-mark">N</div><div><b>Northstar Audio</b><small>Campaign proposal · 12 min ago</small></div><span className="score-pill">8.6</span></div>
                <div className="enquiry-row"><div className="brand-mark brand-mark-alt">M</div><div><b>Monument Studio</b><small>Product seeding · Yesterday</small></div><span className="score-pill score-muted">Review</span></div>
              </div>
              <div className="workspace-sidecard"><div className="panel-head"><b>Page readiness</b><span>72%</span></div><div className="readiness-ring"><strong>72<small>%</small></strong></div><p>Two more details will make your page more useful to brands.</p><span className="complete-line"><Check size={12} /> Profile basics complete</span></div>
            </div>
            <div className="workspace-disclaimer">Illustrative product preview · Values shown are sample interface content, not live account data.</div>
          </div>
        </div>
      </section>

      <section className="section-features page-section" data-reveal>
        <div className="section-heading">
          <div><span className="section-index">03 / WHAT YOU GET</span><h2>Your work deserves<br /><em>a better front door.</em></h2></div>
          <p>Everything begins with a single link. The useful parts happen behind it.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return <button className={`feature-card ${activeFeature === index ? 'feature-active' : ''}`} key={feature.n} onMouseEnter={() => setActiveFeature(index)} onFocus={() => setActiveFeature(index)} onClick={() => setActiveFeature(index)}>
              <div className="feature-card-top"><span>{feature.n}</span><Icon size={20} /></div>
              <div><span className="feature-tag">{feature.tag}</span><h3>{feature.title}</h3><p>{feature.copy}</p></div>
              <div className="feature-card-foot"><span>EXPLORE FEATURE</span><ArrowUpRight size={15} /></div>
              <div className="feature-glow" />
            </button>;
          })}
        </div>
      </section>

      <section className="section-guardrails page-section" data-reveal>
        <div className="guardrail-copy">
          <span className="section-index">04 / YOUR RULES</span>
          <h2>Helpful by design.<br /><em>Never in control.</em></h2>
          <p>The assistant can collect, clarify and negotiate within your settings. It cannot accept a deal for you.</p>
          <button className="button-outline" onClick={() => onNavigate('how-it-works')}>How creator control works <ArrowUpRight size={15} /></button>
        </div>
        <div className="guardrail-list">
          <div><span className="guardrail-icon"><LockKeyhole size={16} /></span><span><b>Your minimum stays private</b><small>Internal settings are never shown to brands.</small></span><BadgeCheck size={16} /></div>
          <div><span className="guardrail-icon"><Zap size={16} /></span><span><b>Negotiation has limits</b><small>Creator-defined boundaries and counter limits.</small></span><BadgeCheck size={16} /></div>
          <div><span className="guardrail-icon"><Clock3 size={16} /></span><span><b>Every term stays visible</b><small>Usage, exclusivity and payment are surfaced.</small></span><BadgeCheck size={16} /></div>
          <div><span className="guardrail-icon red-icon"><Check size={16} /></span><span><b>You make the final decision</b><small>No automatic acceptance. Ever.</small></span><BadgeCheck size={16} /></div>
        </div>
      </section>

      <section className="section-final page-section" data-reveal>
        <div className="final-orb" aria-hidden="true" />
        <span className="section-index">YOUR NEXT COLLABORATION STARTS HERE</span>
        <h2>Give good brands<br /><em>a better way in.</em></h2>
        <p>One link. A more considered first conversation.</p>
        <button className="button-primary button-large" onClick={cta}>Create your creator page <ArrowUpRight size={17} /></button>
        <span className="final-foot"><ShieldCheck size={13} /> Free to start · You stay in control</span>
      </section>
    </div>
  );
};
