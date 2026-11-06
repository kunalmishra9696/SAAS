import React, { useMemo, useState } from 'react';
import { PageRoute } from '../types';
import { CreatorData, useCreatorStore } from '../store/creatorStore';
import {
  ArrowLeft, ArrowRight, Check, CircleHelp, Plus, Sparkles, Trash2,
  UserRound, PanelsTopLeft, BarChart3, HeartHandshake, Wallet, ShieldCheck, BriefcaseBusiness
} from 'lucide-react';

interface OnboardingViewProps { onNavigate: (route: PageRoute) => void; }

const steps = [
  { title: 'The basics', eyebrow: '01 / IDENTITY', description: 'Let brands know who they’re looking for.', optional: false },
  { title: 'Your introduction', eyebrow: '02 / YOUR STORY', description: 'A few real details make the page sound like you.', optional: false },
  { title: 'Where you create', eyebrow: '03 / PLATFORMS', description: 'Add the channels and audience details you want to show.', optional: true },
  { title: 'Your audience', eyebrow: '04 / REACH', description: 'Only add numbers you’re comfortable sharing.', optional: true },
  { title: 'Collaboration fit', eyebrow: '05 / PREFERENCES', description: 'Tell the assistant what is a good fit—and what is not.', optional: true },
  { title: 'Your rate rules', eyebrow: '06 / PRIVATE SETTINGS', description: 'These numbers are private. Brands never see your minimum.', optional: true },
  { title: 'Past collaborations', eyebrow: '07 / EXPERIENCE', description: 'A little context, only when you have it.', optional: true },
];

const platformOptions = ['Instagram', 'YouTube', 'TikTok', 'X', 'Twitch', 'Newsletter', 'Other'];
const nicheOptions = ['Lifestyle', 'Technology', 'Beauty', 'Fashion', 'Fitness', 'Food', 'Travel', 'Gaming', 'Education', 'Finance', 'Other'];
const preferenceOptions = ['Product features', 'Long-term partnerships', 'Tutorials & reviews', 'Events', 'Affiliate', 'UGC'];

function ProgressRing({ progress, remaining }: { progress: number; remaining: number }) {
  const circumference = 2 * Math.PI * 43;
  return <div className="onboard-progress" aria-label={`${progress}% complete, ${remaining} questions remaining`}>
    <svg viewBox="0 0 100 100"><circle className="progress-track" cx="50" cy="50" r="43" /><circle className="progress-value" cx="50" cy="50" r="43" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} /></svg>
    <div><strong>{remaining}</strong><span>LEFT</span></div>
  </div>;
}

const TextField = ({ label, value, onChange, placeholder, required = false, hint, multiline = false }: {
  label: string; value: string; onChange: (value: string) => void; placeholder: string;
  required?: boolean; hint?: string; multiline?: boolean;
}) => <label className="onboard-field">
  <span>{label}{required && <i>REQUIRED</i>}</span>
  {multiline
    ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} />
    : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}
  {hint && <small>{hint}</small>}
</label>;

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onNavigate }) => {
  const { creator, saveStep, completeOnboarding, isLoading, error: storeError } = useCreatorStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CreatorData>(creator);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [platformName, setPlatformName] = useState('Instagram');

  React.useEffect(() => setDraft(creator), [creator]);

  const update = (updates: Partial<CreatorData>) => setDraft((current) => ({ ...current, ...updates }));
  const answered = useMemo(() => [
    Boolean(draft.name.trim()), Boolean(draft.handle.trim()), Boolean(draft.niche.trim()),
    Boolean(draft.headline.trim()), Boolean(draft.bio.trim()),
    draft.platforms.length > 0,
    Boolean(draft.startingRate > 0), Boolean(draft.paymentTerms.trim()),
  ].filter(Boolean).length, [draft]);
  const totalQuestions = 8;
  const remaining = totalQuestions - answered;
  const progress = Math.round((answered / totalQuestions) * 100);

  const addPlatform = () => {
    if (draft.platforms.some((platform) => platform.name === platformName)) return;
    update({ platforms: [...draft.platforms, { name: platformName, handle: '', followers: '' }] });
  };
  const updatePlatform = (index: number, field: 'handle' | 'followers', value: string) => {
    update({ platforms: draft.platforms.map((platform, i) => i === index ? { ...platform, [field]: value } : platform) });
  };
  const removePlatform = (index: number) => update({ platforms: draft.platforms.filter((_, i) => i !== index) });
  const toggleList = (key: 'wants' | 'rejects', value: string) => {
    const current = draft[key];
    update({ [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] } as Partial<CreatorData>);
  };

  const saveAndContinue = async (skip = false) => {
    setError('');
    if (step === 0 && !skip) {
      if (!draft.name.trim() || !draft.handle.trim() || !draft.niche.trim()) {
        setError('Add your name, public handle and creator category to continue.');
        return;
      }
      if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(draft.handle.trim().toLowerCase())) {
        setError('Your handle needs 3–30 lowercase letters, numbers, hyphens or underscores.');
        return;
      }
    }
    if (step === 1 && !skip && (!draft.headline.trim() || !draft.bio.trim())) {
      setError('Add a short headline and introduction. You can refine the wording later.');
      return;
    }

    setSaving(true);
    try {
      if (step === steps.length - 1) {
        await completeOnboarding(draft);
        onNavigate('landing-preview');
      } else {
        await saveStep(step + 1, draft);
        setStep((value) => Math.min(steps.length - 1, value + 1));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your progress could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const back = () => { setError(''); setStep((value) => Math.max(0, value - 1)); };
  const StepIcon = [UserRound, PanelsTopLeft, BarChart3, BarChart3, HeartHandshake, Wallet, BriefcaseBusiness][step];

  if (isLoading) return <div className="onboard-shell"><div className="onboard-loading"><span className="auth-spinner" /> Loading your saved progress…</div></div>;

  return <div className="onboard-shell">
    <div className="onboard-topbar">
      <button className="auth-logo" onClick={() => onNavigate('home')}><span>✳</span> VALLU</button>
      <div className="onboard-top-status"><span /> PRIVATE SETUP <span className="onboard-time">ABOUT 3 MIN</span></div>
    </div>
    <div className="onboard-layout">
      <aside className="onboard-aside">
        <div className="onboard-aside-kicker">YOUR CREATOR PAGE <span>✳</span></div>
        <h1>Make it<br /><em>yours.</em></h1>
        <p>Give brands the context they need to start a better conversation.</p>
        <ProgressRing progress={progress} remaining={remaining} />
        <div className="onboard-step-list">
          {steps.map((item, index) => <div className={`onboard-step-item ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`} key={item.eyebrow}>
            <span>{index < step ? <Check size={12} /> : String(index + 1).padStart(2, '0')}</span>{item.title}
          </div>)}
        </div>
        <div className="onboard-private-note"><ShieldCheck size={14} /> Your rate rules are only visible to you.</div>
      </aside>

      <main className="onboard-card">
        <div className="onboard-card-head">
          <span className="onboard-eyebrow">{steps[step].eyebrow}</span>
          <span className="onboard-count">{String(step + 1).padStart(2, '0')} <i>/</i> 07</span>
        </div>
        <div className="onboard-title-row">
          <div><h2>{steps[step].title}<span>.</span></h2><p>{steps[step].description}</p></div>
          <div className="onboard-step-icon"><StepIcon size={19} /></div>
        </div>

        {step === 0 && <div className="onboard-fields">
          <TextField label="YOUR PUBLIC NAME" value={draft.name} onChange={(value) => update({ name: value })} placeholder="Name people know you by" required />
          <TextField label="YOUR LINK HANDLE" value={draft.handle} onChange={(value) => update({ handle: value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30) })} placeholder="yourname" required hint={`Your public page will use /c/${draft.handle || 'yourname'}`} />
          <label className="onboard-field"><span>CREATOR CATEGORY <i>REQUIRED</i></span>
            <select value={draft.niche} onChange={(event) => update({ niche: event.target.value })}><option value="">Choose your category</option>{nicheOptions.map((option) => <option key={option}>{option}</option>)}</select>
          </label>
        </div>}

        {step === 1 && <div className="onboard-fields">
          <TextField label="YOUR HEADLINE" value={draft.headline} onChange={(value) => update({ headline: value })} placeholder="e.g. I make thoughtful tech videos for curious people" required />
          <TextField label="A SHORT INTRODUCTION" value={draft.bio} onChange={(value) => update({ bio: value })} placeholder="What do you create? What should a brand know about your work?" multiline required hint="Write naturally. No need to make it sound like a media kit." />
          <TextField label="LOCATION (OPTIONAL)" value={draft.location} onChange={(value) => update({ location: value })} placeholder="City, country" />
        </div>}

        {step === 2 && <div className="onboard-fields">
          <div className="onboard-platform-add"><label className="onboard-field"><span>PLATFORM</span><select value={platformName} onChange={(event) => setPlatformName(event.target.value)}>{platformOptions.map((option) => <option key={option}>{option}</option>)}</select></label><button onClick={addPlatform} type="button"><Plus size={15} /> Add platform</button></div>
          {draft.platforms.map((platform, index) => <div className="onboard-platform-row" key={`${platform.name}-${index}`}>
            <div className="onboard-platform-heading"><b>{platform.name}</b><button type="button" aria-label={`Remove ${platform.name}`} onClick={() => removePlatform(index)}><Trash2 size={14} /></button></div>
            <TextField label="HANDLE OR PAGE NAME" value={platform.handle} onChange={(value) => updatePlatform(index, 'handle', value)} placeholder="@yourhandle" />
            <TextField label="FOLLOWERS / SUBSCRIBERS" value={platform.followers} onChange={(value) => updatePlatform(index, 'followers', value)} placeholder="e.g. 24,500" />
          </div>)}
          {draft.platforms.length === 0 && <div className="onboard-empty"><CircleHelp size={17} /> No platform added yet. You can skip this and add one later.</div>}
        </div>}

        {step === 3 && <div className="onboard-fields onboard-fields-two">
          <TextField label="TOTAL FOLLOWERS" value={draft.followersTotal} onChange={(value) => update({ followersTotal: value })} placeholder="e.g. 85,000" hint="Optional · across your platforms" />
          <TextField label="AVERAGE VIEWS" value={draft.avgViews} onChange={(value) => update({ avgViews: value })} placeholder="e.g. 12,000 per reel" />
          <TextField label="MONTHLY REACH / VIEWS" value={draft.monthlyReach} onChange={(value) => update({ monthlyReach: value })} placeholder="e.g. 250,000 per month" />
          <div className="onboard-info-note"><CircleHelp size={14} /> These are self-reported details. Leave any field blank rather than guessing.</div>
        </div>}

        {step === 4 && <div className="onboard-fields">
          <div><span className="onboard-label">WHAT KIND OF COLLABORATIONS INTEREST YOU?</span><p className="onboard-hint">Choose any that fit.</p><div className="onboard-chip-grid">{preferenceOptions.map((option) => <button type="button" key={option} className={draft.wants.includes(option) ? 'selected' : ''} onClick={() => toggleList('wants', option)}>{draft.wants.includes(option) && <Check size={12} />}{option}</button>)}</div></div>
          <TextField label="OTHER INTERESTS (OPTIONAL)" value={draft.customWant || ''} onChange={(value) => update({ customWant: value })} placeholder="Add another type of collaboration" />
          <div><span className="onboard-label">WHAT SHOULD THE ASSISTANT AVOID?</span><p className="onboard-hint">Select any hard boundaries.</p><div className="onboard-chip-grid">{['Gambling & betting', 'Perpetual content rights', 'Unpaid usage rights', 'Affiliate-only offers', 'Unrelated categories', 'Unreasonable deadlines'].map((option) => <button type="button" key={option} className={draft.rejects.includes(option) ? 'selected danger' : ''} onClick={() => toggleList('rejects', option)}>{draft.rejects.includes(option) && <Check size={12} />}{option}</button>)}</div></div>
          <TextField label="OTHER NON-NEGOTIABLES (OPTIONAL)" value={draft.customReject || ''} onChange={(value) => update({ customReject: value })} placeholder="Add a boundary the assistant should respect" />
        </div>}

        {step === 5 && <div className="onboard-fields">
          <div className="onboard-private-banner"><LockKeyholeIcon /> Only you can see these numbers. They are never shared with brands.</div>
          <label className="onboard-field"><span>CURRENCY</span><select value={draft.currency} onChange={(event) => update({ currency: event.target.value as 'INR' | 'USD' })}><option value="INR">INR · Indian Rupee</option><option value="USD">USD · US Dollar</option></select></label>
          <div className="onboard-fields-two">
            <TextField label="TARGET RATE" value={draft.startingRate ? String(draft.startingRate) : ''} onChange={(value) => update({ startingRate: value === '' ? 0 : Number(value) })} placeholder="Your ideal amount" hint="Private target for negotiation" />
            <TextField label="PRIVATE MINIMUM" value={draft.floorRate ? String(draft.floorRate) : ''} onChange={(value) => update({ floorRate: value === '' ? 0 : Number(value) })} placeholder="Lowest acceptable amount" hint="Never shown to brands" />
          </div>
          <TextField label="PAYMENT PREFERENCE (OPTIONAL)" value={draft.paymentTerms} onChange={(value) => update({ paymentTerms: value })} placeholder="e.g. 50% upfront, balance within 15 days" />
          {draft.startingRate > 0 && draft.floorRate > draft.startingRate && <div className="auth-feedback auth-error">Your minimum cannot be higher than your target rate.</div>}
        </div>}

        {step === 6 && <div className="onboard-fields">
          <TextField label="PAST BRAND COLLABORATIONS" value={draft.pastBrands.join(', ')} onChange={(value) => update({ pastBrands: value.split(',').map((part) => part.trim()).filter(Boolean) })} placeholder="Add brand names, separated by commas" hint="Optional · only enter collaborations that actually happened" />
          <TextField label="AVERAGE PAST PAYOUT" value={draft.pastAvgPayout ? String(draft.pastAvgPayout) : ''} onChange={(value) => update({ pastAvgPayout: value === '' ? 0 : Number(value) })} placeholder="Optional amount" hint={`Optional · ${draft.currency}`} />
          <div className="onboard-last-note"><Sparkles size={17} /><span><b>That’s the foundation.</b><small>Next, you’ll see a preview. Missing details won’t appear on your public page.</small></span></div>
        </div>}

        {(error || storeError) && <div className="auth-feedback auth-error" role="alert">{error || storeError}</div>}

        <div className="onboard-actions">
          <button type="button" className="onboard-back" onClick={back} disabled={step === 0 || saving}><ArrowLeft size={15} /> Back</button>
          <div className="onboard-action-right">
            {steps[step].optional && <button type="button" className="onboard-skip" onClick={() => saveAndContinue(true)} disabled={saving}>Skip for now</button>}
            <button type="button" className="onboard-next" onClick={() => saveAndContinue(false)} disabled={saving}>{saving ? 'Saving…' : step === 6 ? 'Preview my page' : 'Save & continue'} {saving ? null : <ArrowRight size={15} />}</button>
          </div>
        </div>
        <div className="onboard-save-note"><ShieldCheck size={12} /> Your progress is saved privately as you go.</div>
      </main>
    </div>
  </div>;
};

function LockKeyholeIcon() {
  return <span className="onboard-lock-icon">⌑</span>;
}
