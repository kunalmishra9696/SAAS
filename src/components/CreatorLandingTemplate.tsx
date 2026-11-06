import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, Check, ChevronDown, Instagram, Link2,
  LockKeyhole, MessageCircle, Send, ShieldCheck, Sparkles, Youtube,
} from 'lucide-react';
import { CreatorData } from '../store/creatorStore';
import { supabase } from '../lib/supabase';

interface CreatorLandingTemplateProps {
  creator: CreatorData;
  isPublic?: boolean;
  onNavigateHome?: () => void;
}

type FormValues = {
  brandName: string;
  brandEmail: string;
  campaignName: string;
  compensationType: 'cash' | 'barter' | 'affiliate' | 'mixed';
  budget: string;
  currency: 'INR' | 'USD';
  deliverables: string;
  timeline: string;
  usageRights: string;
  exclusivity: string;
  whitelisting: boolean;
  paymentTerms: string;
  contentRequirements: string;
};

const initialValues = (currency: 'INR' | 'USD'): FormValues => ({
  brandName: '', brandEmail: '', campaignName: '', compensationType: 'cash',
  budget: '', currency, deliverables: '', timeline: '', usageRights: '',
  exclusivity: 'No exclusivity', whitelisting: false, paymentTerms: '',
  contentRequirements: '',
});

const questions = [
  { prompt: 'First, which brand or company are you reaching out from?', placeholder: 'Your brand name', key: 'brandName', required: true },
  { prompt: 'What email should the creator use to reach you?', placeholder: 'name@company.com · you can skip this', key: 'brandEmail', required: false },
  { prompt: 'Give this campaign a short name.', placeholder: 'Campaign or product launch', key: 'campaignName', required: true },
  { prompt: 'How is this collaboration structured?', placeholder: 'Choose one', key: 'compensationType', required: true },
  { prompt: 'What budget has been allocated for the collaboration?', placeholder: 'Enter an amount, or 0 if not decided', key: 'budget', required: true },
  { prompt: 'Which currency is the budget in?', placeholder: 'Choose currency', key: 'currency', required: true },
  { prompt: 'What content or deliverables are you looking for?', placeholder: 'e.g. 1 Instagram Reel, 2 Stories', key: 'deliverables', required: true },
  { prompt: 'What is the campaign timeline or deadline?', placeholder: 'e.g. Content live by 30 June', key: 'timeline', required: true },
  { prompt: 'How would the content be used?', placeholder: 'e.g. Organic social for 30 days', key: 'usageRights', required: true },
  { prompt: 'Is any category or competitor exclusivity required?', placeholder: 'Describe the exclusivity, or choose no exclusivity', key: 'exclusivity', required: true },
  { prompt: 'Will the brand run this content as paid ads or whitelist the creator account?', placeholder: 'Choose yes or no', key: 'whitelisting', required: true },
  { prompt: 'What are the proposed payment terms?', placeholder: 'e.g. 50% upfront, remainder within 15 days', key: 'paymentTerms', required: true },
  { prompt: 'Any creative direction, required talking points or restrictions?', placeholder: 'Add notes, or skip if there are none', key: 'contentRequirements', required: false },
] as const;

type Message = { sender: 'assistant' | 'brand'; body: string };

const platformIcon = (name: string) => {
  const value = name.toLowerCase();
  if (value.includes('instagram')) return <Instagram size={14} />;
  if (value.includes('youtube')) return <Youtube size={14} />;
  return <Link2 size={14} />;
};

const cleanString = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export const CreatorLandingTemplate: React.FC<CreatorLandingTemplateProps> = ({
  creator,
  isPublic = false,
  onNavigateHome,
}) => {
  const [values, setValues] = useState<FormValues>(() => initialValues(creator.currency || 'INR'));
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'assistant', body: `Hi, I'm ${creator.name || 'the creator'}'s collaboration assistant. I'll collect the key campaign details so they can review your proposal.` },
  ]);
  const [step, setStep] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const publicPlatforms = useMemo(() => creator.platforms.filter((platform) => platform.name || platform.handle || platform.followers), [creator.platforms]);
  const hasStats = Boolean(creator.followersTotal || creator.avgViews || creator.monthlyReach);
  const hasStory = Boolean(creator.headline || creator.bio || creator.location);
  const hasExperience = creator.pastBrands.length > 0;
  const currentQuestion = questions[step];

  const updateValue = (key: keyof FormValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const trackEvent = async (event: 'inquiry_start' | 'inquiry_complete') => {
    if (!supabase || !creator.handle) return;
    try {
      await supabase.functions.invoke('track-creator-event', {
        body: { handle: creator.handle, event, visitorId: event === 'inquiry_start' ? crypto.randomUUID() : undefined },
      });
    } catch {
      // Analytics must never prevent a brand from sending an enquiry.
    }
  };

  const submitAnswer = async (rawAnswer?: string) => {
    if (!currentQuestion || submitted || submitting) return;
    const answer = (rawAnswer ?? draftAnswer).trim();
    if (currentQuestion.required && !answer) {
      setError('Add an answer to continue.');
      return;
    }
    setError('');
    setStarted(true);

    const key = currentQuestion.key;
    const nextValues = { ...values };
    if (key === 'whitelisting') nextValues.whitelisting = answer.toLowerCase() === 'yes';
    else if (key === 'compensationType') nextValues.compensationType = answer as FormValues['compensationType'];
    else if (key === 'currency') nextValues.currency = answer as FormValues['currency'];
    else (nextValues as any)[key] = answer;

    setValues(nextValues);
    const nextMessages: Message[] = [...messages];
    if (answer) nextMessages.push({ sender: 'brand', body: answer });
    setDraftAnswer('');

    if (step === questions.length - 1) {
      setMessages(nextMessages);
      await submitEnquiry(nextValues, nextMessages);
      return;
    }

    const nextStep = step + 1;
    nextMessages.push({ sender: 'assistant', body: questions[nextStep].prompt });
    setMessages(nextMessages);
    setStep(nextStep);
  };

  const submitEnquiry = async (form: FormValues, transcript: Message[]) => {
    if (!supabase) {
      setError('The enquiry service is not connected. Please contact the creator directly for now.');
      return;
    }
    const deliverables = form.deliverables.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean);
    const budget = Number(form.budget);
    if (!form.brandName.trim() || !form.campaignName.trim() || !deliverables.length ||
      !form.timeline.trim() || !form.usageRights.trim() || !form.exclusivity.trim() ||
      !form.paymentTerms.trim() || !Number.isFinite(budget) || budget < 0) {
      setError('One of the campaign details is missing or invalid. Please go back and review your answers.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const { data, error: functionError } = await supabase.functions.invoke('brand-inquiry', {
        body: {
          handle: creator.handle,
          brandName: form.brandName,
          brandEmail: form.brandEmail,
          campaignName: form.campaignName,
          compensationType: form.compensationType,
          budget,
          currency: form.currency,
          deliverables,
          timeline: form.timeline,
          usageRights: form.usageRights,
          exclusivity: form.exclusivity,
          whitelisting: form.whitelisting,
          paymentTerms: form.paymentTerms,
          contentRequirements: form.contentRequirements,
          transcript: transcript.map((message) => ({ sender: message.sender, body: message.body })),
        },
      });
      if (functionError) throw functionError;
      if (!data?.received) throw new Error(data?.error || 'The enquiry could not be submitted.');
      await trackEvent('inquiry_complete');
      setSubmitted(true);
      setMessages((current) => [...current, { sender: 'assistant', body: 'Thank you. Your proposal has been sent to the creator for review. This is not an accepted agreement; the creator will make the final decision.' }]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not send your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const beginInquiry = async () => {
    if (started) return;
    setStarted(true);
    setMessages((current) => [...current, { sender: 'assistant', body: questions[0].prompt }]);
    await trackEvent('inquiry_start');
  };

  const quickOptions = currentQuestion?.key === 'compensationType'
    ? [{ label: 'Cash payment', value: 'cash' }, { label: 'Product barter', value: 'barter' }, { label: 'Affiliate', value: 'affiliate' }, { label: 'Mixed', value: 'mixed' }]
    : currentQuestion?.key === 'currency'
      ? [{ label: 'INR · ₹', value: 'INR' }, { label: 'USD · $', value: 'USD' }]
      : currentQuestion?.key === 'whitelisting'
        ? [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
        : [];

  const currentTypedValue = currentQuestion ? String(values[currentQuestion.key] ?? '') : '';
  const questionAnswer = currentQuestion ? (currentQuestion.key === 'whitelisting' ? values.whitelisting ? 'yes' : '' : currentTypedValue) : '';

  return <div className="creator-page">
    <nav className="creator-nav">
      <button className="creator-nav-name" onClick={onNavigateHome}>{creator.name || 'Creator'}<span>✳</span></button>
      <div className="creator-nav-links">
        {hasStory && <a href="#about">About</a>}
        {publicPlatforms.length > 0 && <a href="#platforms">Platforms</a>}
        {hasExperience && <a href="#experience">Experience</a>}
        <a className="creator-nav-cta" href="#work">Work together <ArrowUpRight size={13} /></a>
      </div>
    </nav>

    <main className="creator-page-main">
      <section className="creator-hero">
        <div className="creator-hero-copy">
          <span className="creator-page-eyebrow"><i /> INDEPENDENT CREATOR <span>/{creator.niche || 'CREATIVE WORK'}</span></span>
          <h1>{creator.name || 'Creator'}<span className="creator-period">.</span></h1>
          {creator.headline && <h2>{creator.headline}</h2>}
          {creator.location && <div className="creator-location"><span>BASED IN</span> {creator.location}</div>}
          <a href="#work" className="creator-hero-cta">Start a collaboration <ArrowUpRight size={15} /></a>
        </div>
        <div className="creator-portrait-wrap">
          {creator.avatarUrl
            ? <img className="creator-portrait" src={creator.avatarUrl} alt={creator.name ? `${creator.name} portrait` : 'Creator portrait'} />
            : <div className="creator-portrait creator-portrait-placeholder"><span>{creator.name?.slice(0, 1).toUpperCase() || '✳'}</span></div>}
          <span className="creator-portrait-outline" />
          <span className="creator-portrait-cross">✳</span>
          <span className="creator-portrait-mark">CREATOR / PORTFOLIO</span>
        </div>
        <span className="creator-hero-index">01 — 04</span>
      </section>

      {hasStats && <section className="creator-stats" aria-label="Creator audience statistics">
        {creator.followersTotal && <div><strong>{creator.followersTotal}</strong><span>TOTAL FOLLOWERS</span></div>}
        {creator.avgViews && <div><strong>{creator.avgViews}</strong><span>AVERAGE VIEWS</span></div>}
        {creator.monthlyReach && <div><strong>{creator.monthlyReach}</strong><span>MONTHLY REACH</span></div>}
        <small className="creator-self-report"><span>i</span> Creator-reported information</small>
      </section>}

      {hasStory && <section className="creator-about" id="about">
        <div className="creator-section-kicker">01 / ABOUT</div>
        <div className="creator-about-content">
          <h2>{creator.headline || 'A little about my work.'}</h2>
          {creator.bio && <p>{creator.bio}</p>}
        </div>
      </section>}

      {publicPlatforms.length > 0 && <section className="creator-platforms" id="platforms">
        <div className="creator-section-kicker">02 / WHERE I CREATE</div>
        <div className="creator-platform-grid">{publicPlatforms.map((platform, index) => <article key={`${platform.name}-${index}`}>
          <div className="creator-platform-icon">{platformIcon(platform.name)}</div>
          <div><b>{platform.name}</b>{platform.handle && <span>{platform.handle}</span>}</div>
          {platform.followers && <strong>{platform.followers}<small>FOLLOWERS</small></strong>}
          {platform.url && <a href={platform.url} target="_blank" rel="noreferrer" aria-label={`Visit ${platform.name}`}><ArrowUpRight size={14} /></a>}
        </article>)}</div>
      </section>}

      {hasExperience && <section className="creator-experience" id="experience">
        <div className="creator-section-kicker">03 / SELECTED COLLABORATIONS</div>
        <h2>Some of the brands<br /><em>I've worked with.</em></h2>
        <div className="creator-brand-list">{creator.pastBrands.map((brand, index) => <span key={`${brand}-${index}`}>{brand}</span>)}</div>
        <small>Past collaborations are self-reported by the creator.</small>
      </section>}

      <section className="creator-work" id="work">
        <div className="creator-section-kicker">04 / WORK WITH ME</div>
        <div className="creator-work-layout">
          <div className="creator-work-copy">
            <h2>Have something<br /><em>good in mind?</em></h2>
            <p>Share the campaign details. The assistant will organise the first conversation so the creator can focus on the proposal.</p>
            <div className="creator-work-points"><span><ShieldCheck size={14} /> Creator reviews every proposal</span><span><LockKeyhole size={14} /> Private rate rules stay private</span></div>
          </div>
          <div className="creator-chat-card">
            <div className="creator-chat-head"><div className="creator-chat-avatar"><Sparkles size={15} /></div><div><b>{creator.name || 'Creator'}'s assistant</b><small><i /> Collaboration enquiries</small></div><span className="creator-chat-live">GUIDED FLOW</span></div>
            <div className="creator-chat-disclosure"><ShieldCheck size={13} /><span>This guided assistant collects your campaign details. The conversation is stored and shared with the creator. It may make mistakes; it cannot accept a deal.</span></div>
            {!isPublic
              ? <div className="creator-chat-preview"><MessageCircle size={19} /><b>Your inquiry assistant appears here when the page is published.</b><span>Preview mode · Brands cannot submit to a draft page.</span></div>
              : <div className="creator-chat-content">
                <div className="creator-chat-messages">{messages.map((message, index) => <div key={index} className={`creator-chat-message ${message.sender === 'brand' ? 'brand' : 'assistant'}`}><small>{message.sender === 'brand' ? 'YOU' : 'ASSISTANT'}</small>{message.body}</div>)}
                  {submitting && <div className="creator-typing"><i /><i /><i /> Sending proposal</div>}
                  {submitted && <div className="creator-submit-success"><Check size={13} /> Enquiry submitted</div>}
                </div>
                {!submitted && <div className="creator-chat-question">
                  {!started
                    ? <button className="creator-chat-start" type="button" onClick={() => void beginInquiry()}>Start enquiry <ArrowUpRight size={14} /></button>
                    : <>
                      {quickOptions.length > 0 && <div className="creator-quick-options">{quickOptions.map((option) => <button type="button" key={option.value} onClick={() => void submitAnswer(option.value)} disabled={submitting}>{option.label}</button>)}</div>}
                      {currentQuestion?.key === 'whitelisting'
                        ? <div className="creator-chat-input-row"><span className="creator-chat-hint">Choose one of the options above.</span></div>
                        : <div className="creator-chat-input-row">{currentQuestion?.key === 'deliverables' || currentQuestion?.key === 'contentRequirements'
                          ? <textarea rows={2} value={draftAnswer} onChange={(event) => setDraftAnswer(event.target.value)} placeholder={currentQuestion.placeholder} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submitAnswer(); } }} />
                          : <input value={draftAnswer} onChange={(event) => setDraftAnswer(event.target.value)} placeholder={currentQuestion?.placeholder || 'Your answer'} type={currentQuestion?.key === 'brandEmail' ? 'email' : currentQuestion?.key === 'budget' ? 'number' : 'text'} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void submitAnswer(); } }} />}
                          <button type="button" onClick={() => void submitAnswer()} disabled={submitting}><Send size={14} /></button>
                        </div>}
                      {currentQuestion && !currentQuestion.required && <button type="button" className="creator-chat-skip" onClick={() => void submitAnswer('')} disabled={submitting}>Skip this question</button>}
                      {error && <div className="creator-chat-error">{error}</div>}
                      <div className="creator-chat-step">QUESTION {step + 1} OF {questions.length}</div>
                    </>}
                </div>}
                {submitted && <div className="creator-chat-after"><ShieldCheck size={13} /> The creator will review the proposal. No agreement has been accepted.</div>}
              </div>}
          </div>
        </div>
      </section>
    </main>

    <footer className="creator-page-footer"><button onClick={onNavigateHome}>VALLU <span>✳</span></button><span>Made with VALLU</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>BACK TO TOP ↑</a></footer>
  </div>;
};
