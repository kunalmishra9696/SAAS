import React, { useEffect, useMemo, useState } from 'react';
import { PageRoute } from '../types';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleHelp, LoaderCircle, LockKeyhole, Sparkles } from 'lucide-react';

interface Props { onNavigate: (route: PageRoute) => void; }
type Draft = {
  displayName: string; handle: string; niche: string; location: string;
  headline: string; bio: string; topics: string;
  instagramUrl: string; instagramFollowers: string;
  youtubeUrl: string; youtubeFollowers: string;
  tiktokUrl: string; tiktokFollowers: string;
  xUrl: string; xFollowers: string;
  avgViews: string; monthlyViews: string; engagementRate: string;
  interestedIn: string; preferredFormats: string; avoidCategories: string;
  currency: 'INR'|'USD'; targetRate: string; minimumRate: string; publicStartingRate: string;
  compensation: string; paymentTerms: string; hardNoTerms: string;
  pastBrands: string; pastAverage: string; portraitUrl: string; visualStyle: string; writingTone: string;
};
const blank: Draft = {
  displayName:'',handle:'',niche:'',location:'',headline:'',bio:'',topics:'',
  instagramUrl:'',instagramFollowers:'',youtubeUrl:'',youtubeFollowers:'',
  tiktokUrl:'',tiktokFollowers:'',xUrl:'',xFollowers:'',
  avgViews:'',monthlyViews:'',engagementRate:'',
  interestedIn:'',preferredFormats:'',avoidCategories:'',
  currency:'INR',targetRate:'',minimumRate:'',publicStartingRate:'',
  compensation:'Cash',paymentTerms:'50% advance, remaining on delivery',hardNoTerms:'',
  pastBrands:'',pastAverage:'',portraitUrl:'',visualStyle:'Editorial',writingTone:'Confident',
};
const steps = [
  { title:'The essentials', kicker:'01 / IDENTITY', description:'A name and a clear lane. The starting point for your page.' },
  { title:'Your point of view', kicker:'02 / STORY', description:'A few words about what you make and why it matters.' },
  { title:'Where people find you', kicker:'03 / PLATFORMS', description:'Add only the profiles you want brands to see.' },
  { title:'Your audience', kicker:'04 / REACH', description:'Share the numbers you know. Leave the rest blank.' },
  { title:'The right work', kicker:'05 / FIT', description:'Tell the assistant what to look for and what to avoid.' },
  { title:'Set your rates', kicker:'06 / COMMERCIALS', description:'These commercial limits are private to your account.' },
  { title:'Your boundaries', kicker:'07 / RULES', description:'Set the rules your assistant must respect.' },
  { title:'A little more you', kicker:'08 / FINISH', description:'Optional details that make the page feel like yours.' },
];

const inputClass = "auth-field";
const Label: React.FC<{title:string;hint?:string;children:React.ReactNode}> = ({title,hint,children}) => <label className="block"><span className="text-[10px] font-medium text-[#D0CFD0]">{title}</span>{children}{hint&&<span className="mt-1.5 block text-[9px] leading-relaxed text-[#6E6F76]">{hint}</span>}</label>;
const TextInput: React.FC<{value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;required?:boolean}> = ({value,onChange,placeholder,type='text',required=false}) => <input className={`${inputClass} mt-2`} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} required={required}/>;
const TextArea: React.FC<{value:string;onChange:(v:string)=>void;placeholder?:string;rows?:number}> = ({value,onChange,placeholder,rows=3}) => <textarea className={`${inputClass} mt-2 resize-y`} rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>;

export const OnboardingView: React.FC<Props> = ({onNavigate}) => {
  const [draft,setDraft] = useState<Draft>(blank);
  const [step,setStep] = useState(0);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [loadedUserId,setLoadedUserId] = useState<string|null>(null);
  const progress = ((step+1)/steps.length)*100;

  const update = (key:keyof Draft,value:string) => setDraft(prev=>({...prev,[key]:value}));
  const parseLinks = (url:string,followers:string,name:string) => url.trim() ? [{platform:name,url:url.trim(),followers:followers.trim()||null}] : [];
  const publicPageData = useMemo(()=>({
    display_name:draft.displayName.trim(),
    headline:draft.headline.trim(),
    bio:draft.bio.trim(),
    niche:draft.niche.trim(),
    location:draft.location.trim(),
    topics:draft.topics.split(',').map(s=>s.trim()).filter(Boolean),
    platforms:[
      ...parseLinks(draft.instagramUrl,draft.instagramFollowers,'Instagram'),
      ...parseLinks(draft.youtubeUrl,draft.youtubeFollowers,'YouTube'),
      ...parseLinks(draft.tiktokUrl,draft.tiktokFollowers,'TikTok'),
      ...parseLinks(draft.xUrl,draft.xFollowers,'X'),
    ],
    audience:{
      average_views:draft.avgViews.trim()||null,
      monthly_views:draft.monthlyViews.trim()||null,
      engagement_rate:draft.engagementRate.trim()||null,
    },
    interested_in:draft.interestedIn.split(',').map(s=>s.trim()).filter(Boolean),
    preferred_formats:draft.preferredFormats.split(',').map(s=>s.trim()).filter(Boolean),
    past_brands:draft.pastBrands.split(',').map(s=>s.trim()).filter(Boolean),
    portrait_url:draft.portraitUrl.trim()||null,
    visual_style:draft.visualStyle,
    writing_tone:draft.writingTone,
  }),[draft]);

  useEffect(()=>{
    let active=true;
    const load=async()=>{
      if(!supabase){setError('Supabase is not configured.');setLoading(false);return;}
      try{
        const {data:{user},error:authError}=await supabase.auth.getUser();
        if(authError)throw authError;
        if(!user)throw new Error('Please log in to continue.');
        const [profileRes,pageRes,settingsRes]=await Promise.all([
          supabase.from('creator_profiles').select('*').eq('id',user.id).maybeSingle(),
          supabase.from('creator_pages').select('*').eq('creator_id',user.id).maybeSingle(),
          supabase.from('creator_settings').select('*').eq('creator_id',user.id).maybeSingle(),
        ]);
        if(profileRes.error)throw profileRes.error;
        if(pageRes.error)throw pageRes.error;
        if(settingsRes.error)throw settingsRes.error;
        if(!active)return;

        // Email-confirmation signups can reach onboarding without having had a
        // client session during sign-up. Make sure their private rows exist now.
        const initialName=String(profileRes.data?.display_name||user.user_metadata?.display_name||user.email?.split('@')[0]||'Creator').trim();
        const initialHandle=String(pageRes.data?.handle||user.user_metadata?.handle||initialName.toLowerCase().replace(/[^a-z0-9]+/g,'-')).toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,30);
        if(!profileRes.data){
          const {error}=await supabase.from('creator_profiles').upsert({
            id:user.id,display_name:initialName,email:user.email||'',onboarding_completed:false
          },{onConflict:'id'});
          if(error)throw error;
        }
        if(!settingsRes.data){
          const {error}=await supabase.from('creator_settings').upsert({
            creator_id:user.id,currency:'INR',target_rate:0,minimum_rate:0,allowed_compensation:['cash']
          },{onConflict:'creator_id'});
          if(error)throw error;
        }
        if(!pageRes.data){
          if(initialHandle.length<3)throw new Error('Your signup handle is invalid. Please contact support so we can reserve a new one.');
          const {error}=await supabase.from('creator_pages').upsert({
            creator_id:user.id,handle:initialHandle,status:'draft',page_data:{display_name:initialName}
          },{onConflict:'creator_id'});
          if(error)throw error;
        }

        const page=(pageRes.data?.page_data||{}) as Record<string,any>;
        const audience=(page.audience||{}) as Record<string,any>;
        const platforms=(page.platforms||[]) as {platform:string;url:string;followers?:string|null}[];
        const getPlatform=(name:string)=>platforms.find(p=>p.platform===name);
        const profile=profileRes.data||{};
        const settings=settingsRes.data||{};
        setDraft({
          ...blank,
          displayName:profile.display_name||page.display_name||user.user_metadata?.display_name||'',
          handle:pageRes.data?.handle||user.user_metadata?.handle||'',
          niche:profile.niche||page.niche||'',
          location:page.location||'',
          headline:page.headline||'',
          bio:page.bio||'',
          topics:(page.topics||[]).join(', '),
          instagramUrl:getPlatform('Instagram')?.url||'',instagramFollowers:getPlatform('Instagram')?.followers||'',
          youtubeUrl:getPlatform('YouTube')?.url||'',youtubeFollowers:getPlatform('YouTube')?.followers||'',
          tiktokUrl:getPlatform('TikTok')?.url||'',tiktokFollowers:getPlatform('TikTok')?.followers||'',
          xUrl:getPlatform('X')?.url||'',xFollowers:getPlatform('X')?.followers||'',
          avgViews:audience.average_views||'',monthlyViews:audience.monthly_views||'',engagementRate:audience.engagement_rate||'',
          interestedIn:(settings.preferred_categories||[]).join(', '),
          preferredFormats:(settings.preferences?.preferred_formats||[]).join(', '),
          avoidCategories:(settings.excluded_categories||[]).join(', '),
          currency:settings.currency||'INR',
          targetRate:settings.target_rate?String(settings.target_rate):'',
          minimumRate:settings.minimum_rate?String(settings.minimum_rate):'',
          publicStartingRate:settings.public_starting_rate?String(settings.public_starting_rate):'',
          compensation:(settings.allowed_compensation||['cash']).join(', '),
          paymentTerms:settings.preferences?.payment_terms||blank.paymentTerms,
          hardNoTerms:(settings.hard_no_terms||[]).join(', '),
          pastBrands:(page.past_brands||[]).join(', '),
          pastAverage:settings.preferences?.past_average_payment?String(settings.preferences.past_average_payment):'',
          portraitUrl:page.portrait_url||'',
          visualStyle:page.visual_style||'Editorial',
          writingTone:page.writing_tone||'Confident',
        });
        setStep(Math.min(profile.onboarding_step||0,7));
        setLoadedUserId(user.id);
      }catch(e){if(active)setError(e instanceof Error?e.message:'Could not load your saved details.');}
      finally{if(active)setLoading(false);}
    };
    load();
    return()=>{active=false;};
  },[]);

  const saveProgress=async(nextStep:number,complete=false)=>{
    if(!supabase||!loadedUserId)throw new Error('Your session has expired. Please log in again.');
    setSaving(true);setError('');
    try{
      const cleanHandle=draft.handle.toLowerCase().trim();
      if(cleanHandle.length<3||cleanHandle.length>30||!/^[a-z0-9][a-z0-9_-]+$/.test(cleanHandle))throw new Error('Your public handle must be 3–30 characters and use letters, numbers, - or _.');
      if(!draft.displayName.trim())throw new Error('Please add your name.');
      if(!draft.niche.trim())throw new Error('Please add your creator category.');
      if(!draft.targetRate||!Number.isFinite(Number(draft.targetRate))||Number(draft.targetRate)<=0)throw new Error('Add your target rate so the assistant has a real reference point.');
      if(draft.minimumRate===''||!Number.isFinite(Number(draft.minimumRate))||Number(draft.minimumRate)<0)throw new Error('Set your private minimum rate. Enter 0 if you are not setting a hard floor yet.');
      if(Number(draft.minimumRate)>Number(draft.targetRate))throw new Error('Your minimum rate cannot be higher than your target rate.');

      const profileUpdate:Record<string,unknown>={
        display_name:draft.displayName.trim(),
        niche:draft.niche.trim(),
        onboarding_step:nextStep,
      };
      if(complete)profileUpdate.onboarding_completed=true;
      const {error:profileError}=await supabase.from('creator_profiles').update(profileUpdate).eq('id',loadedUserId);
      if(profileError)throw profileError;

      const pagePayload={
        creator_id:loadedUserId,
        handle:cleanHandle,
        page_data:publicPageData,
        theme:{visual_style:draft.visualStyle,writing_tone:draft.writingTone},
      };
      const {error:pageError}=await supabase.from('creator_pages').upsert(pagePayload,{onConflict:'creator_id'});
      if(pageError)throw pageError;

      const {error:settingsError}=await supabase.from('creator_settings').upsert({
        creator_id:loadedUserId,
        currency:draft.currency,
        target_rate:Number(draft.targetRate)||0,
        minimum_rate:Number(draft.minimumRate)||0,
        public_starting_rate:draft.publicStartingRate?Number(draft.publicStartingRate):null,
        allowed_compensation:draft.compensation.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean),
        preferred_categories:draft.interestedIn.split(',').map(s=>s.trim()).filter(Boolean),
        excluded_categories:draft.avoidCategories.split(',').map(s=>s.trim()).filter(Boolean),
        hard_no_terms:draft.hardNoTerms.split(',').map(s=>s.trim()).filter(Boolean),
        negotiation_counter_limit:2,
        decision_window_days:14,
        preferences:{
          preferred_formats:draft.preferredFormats.split(',').map(s=>s.trim()).filter(Boolean),
          payment_terms:draft.paymentTerms.trim(),
          past_average_payment:draft.pastAverage?Number(draft.pastAverage):null,
        },
      },{onConflict:'creator_id'});
      if(settingsError)throw settingsError;
      return true;
    }finally{setSaving(false);}
  };

  const next=async()=>{
    try{
      const complete=step===steps.length-1;
      await saveProgress(step+1,complete);
      if(complete){onNavigate('landing-preview');return;}
      setStep(s=>Math.min(s+1,steps.length-1));
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(e){setError(e instanceof Error?e.message:'Could not save this step. Please try again.');}
  };
  const previous=()=>{setError('');setStep(s=>Math.max(0,s-1));window.scrollTo({top:0,behavior:'smooth'});};
  const skip=async()=>{setError('');try{await saveProgress(step+1,false);setStep(s=>Math.min(s+1,steps.length-1));}catch(e){setError(e instanceof Error?e.message:'Could not save this step.');}};

  if(loading)return <main className="flex min-h-screen items-center justify-center bg-[#090A0D] text-xs text-[#A3A4AA]"><LoaderCircle className="mr-3 animate-spin" size={16}/>Loading your saved answers…</main>;

  return <main className="relative min-h-screen overflow-hidden px-4 pb-20 pt-28 sm:px-6">
    <div className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-[#F0443E]/[0.07] blur-[130px]"/>
    <div className="relative mx-auto max-w-[920px]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <button onClick={()=>onNavigate('home')} className="inline-flex items-center gap-2 text-[10px] text-[#82838A] hover:text-white"><ArrowLeft size={13}/> Exit setup</button>
        <span className="text-[9px] font-mono uppercase tracking-[.16em] text-[#777980]">CREATOR SETUP / PRIVATE</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[24px] border border-white/[0.09] bg-[#141519] p-5 sm:p-6">
          <div className="mx-auto flex h-[124px] w-[124px] items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="5"/>
              <circle cx="50" cy="50" r="43" fill="none" stroke="#F0443E" strokeWidth="5" strokeLinecap="round" strokeDasharray={270} strokeDashoffset={270-(270*progress/100)} style={{transition:'stroke-dashoffset .55s cubic-bezier(.2,.8,.2,1)'}}/>
            </svg>
            <div className="absolute flex flex-col items-center"><span className="font-display text-3xl font-semibold">{steps.length-step}</span><span className="text-[8px] font-mono uppercase tracking-[.15em] text-[#777980]">steps left</span></div>
          </div>
          <p className="mt-4 text-center text-[10px] leading-relaxed text-[#8E8F96]">Your page takes shape as you go. Optional details can be skipped and added later.</p>
          <div className="mt-7 space-y-2">{steps.map((item,i)=><div key={item.kicker} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${step===i?'bg-white/[0.055]':'opacity-50'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] ${i<step?'border-[#F0443E] bg-[#F0443E] text-white':i===step?'border-[#F0443E] text-[#F0443E]':'border-white/15 text-[#8B8C92]'}`}>{i<step?<Check size={11}/>:i+1}</span><span className="text-[9px] text-[#C1C0C2]">{item.title}</span></div>)}</div>
          <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[9px] text-[#777980]"><LockKeyhole size={12} className="text-[#FF963F]"/> Private commercial settings</div>
        </aside>

        <section className="rounded-[24px] border border-white/[0.09] bg-[#141519] p-5 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between"><span className="font-mono text-[9px] tracking-[.16em] text-[#F0443E]">{steps[step].kicker}</span><span className="text-[9px] text-[#72737A]">STEP {step+1} OF {steps.length}</span></div>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-[-.06em] sm:text-[42px]">{steps[step].title}</h1>
          <p className="mt-2 text-[11px] leading-relaxed text-[#919198]">{steps[step].description}</p>

          <div className="mt-9 space-y-5">
            {step===0&&<>
              <div className="grid gap-4 sm:grid-cols-2"><Label title="Public name"><TextInput value={draft.displayName} onChange={v=>update('displayName',v)} placeholder="Your name" required/></Label><Label title="Creator category"><TextInput value={draft.niche} onChange={v=>update('niche',v)} placeholder="e.g. Fitness, tech, beauty" required/></Label></div>
              <Label title="Your public handle" hint="This becomes your shareable creator address."><div className="mt-2 flex items-center rounded-xl border border-[#36373D] bg-[#0D0E11]"><span className="pl-3.5 text-[11px] text-[#7D7E84]">/c/</span><input className="min-w-0 flex-1 bg-transparent px-2 py-[13px] text-[13px] outline-none" value={draft.handle} onChange={e=>update('handle',e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,''))} placeholder="yourname"/></div></Label>
              <Label title="Based in (optional)"><TextInput value={draft.location} onChange={v=>update('location',v)} placeholder="City, country"/></Label>
            </>}
            {step===1&&<>
              <Label title="Your headline" hint="One line that helps a brand understand what you do."><TextInput value={draft.headline} onChange={v=>update('headline',v)} placeholder="e.g. Story-led fitness creator"/></Label>
              <Label title="A short introduction" hint="A few natural sentences. We will not invent claims or audience numbers."><TextArea value={draft.bio} onChange={v=>update('bio',v)} placeholder="I create content about…" rows={4}/></Label>
              <Label title="Topics you create around (optional)" hint="Separate topics with commas."><TextInput value={draft.topics} onChange={v=>update('topics',v)} placeholder="Strength training, nutrition, daily routines"/></Label>
            </>}
            {step===2&&<>
              <Label title="Instagram profile URL"><TextInput value={draft.instagramUrl} onChange={v=>update('instagramUrl',v)} placeholder="https://instagram.com/yourname" type="url"/></Label>
              <Label title="YouTube channel URL"><TextInput value={draft.youtubeUrl} onChange={v=>update('youtubeUrl',v)} placeholder="https://youtube.com/@yourname" type="url"/></Label>
              <div className="grid gap-4 sm:grid-cols-2"><Label title="TikTok profile URL"><TextInput value={draft.tiktokUrl} onChange={v=>update('tiktokUrl',v)} placeholder="https://tiktok.com/@you" type="url"/></Label><Label title="X profile URL"><TextInput value={draft.xUrl} onChange={v=>update('xUrl',v)} placeholder="https://x.com/you" type="url"/></Label></div>
              <p className="text-[9px] text-[#777980]">You can add follower counts in the next step. Any missing platform will stay hidden on your public page.</p>
            </>}
            {step===3&&<>
              <div className="grid gap-4 sm:grid-cols-2">
                {draft.instagramUrl&&<Label title="Instagram followers"><TextInput value={draft.instagramFollowers} onChange={v=>update('instagramFollowers',v)} placeholder="e.g. 24,000"/></Label>}
                {draft.youtubeUrl&&<Label title="YouTube subscribers"><TextInput value={draft.youtubeFollowers} onChange={v=>update('youtubeFollowers',v)} placeholder="e.g. 12,500"/></Label>}
                {draft.tiktokUrl&&<Label title="TikTok followers"><TextInput value={draft.tiktokFollowers} onChange={v=>update('tiktokFollowers',v)} placeholder="e.g. 18,000"/></Label>}
                {draft.xUrl&&<Label title="X followers"><TextInput value={draft.xFollowers} onChange={v=>update('xFollowers',v)} placeholder="e.g. 8,000"/></Label>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><Label title="Average views (optional)"><TextInput value={draft.avgViews} onChange={v=>update('avgViews',v)} placeholder="e.g. 18,000 per video"/></Label><Label title="Monthly views (optional)"><TextInput value={draft.monthlyViews} onChange={v=>update('monthlyViews',v)} placeholder="e.g. 420,000"/></Label></div>
              <Label title="Average engagement (optional)"><TextInput value={draft.engagementRate} onChange={v=>update('engagementRate',v)} placeholder="e.g. 4.8%"/></Label>
              <p className="rounded-xl border border-[#FF963F]/15 bg-[#FF963F]/[0.05] p-3 text-[9px] leading-relaxed text-[#B3A18F]"><CircleHelp size={11} className="mr-1 inline text-[#FF963F]"/> These are creator-provided figures. We will label them as self-reported and never fill missing metrics with estimates.</p>
            </>}
            {step===4&&<>
              <Label title="What kinds of collaborations interest you?" hint="Separate choices with commas."><TextArea value={draft.interestedIn} onChange={v=>update('interestedIn',v)} placeholder="Fitness gear, nutrition, wellness brands…" rows={3}/></Label>
              <Label title="Preferred content formats (optional)"><TextInput value={draft.preferredFormats} onChange={v=>update('preferredFormats',v)} placeholder="Reels, dedicated videos, stories…"/></Label>
              <Label title="Categories you do not want to work with (optional)"><TextInput value={draft.avoidCategories} onChange={v=>update('avoidCategories',v)} placeholder="Gambling, tobacco, misleading supplements…"/></Label>
            </>}
            {step===5&&<>
              <div className="grid gap-4 sm:grid-cols-2"><Label title="Currency"><select className={`${inputClass} mt-2`} value={draft.currency} onChange={e=>update('currency',e.target.value)}><option value="INR">INR · Indian rupee</option><option value="USD">USD · US dollar</option></select></Label><Label title="Target rate" hint="Your preferred fee for the typical collaboration you have in mind."><TextInput type="number" value={draft.targetRate} onChange={v=>update('targetRate',v)} placeholder="e.g. 25000"/></Label></div>
              <Label title="Minimum acceptable rate" hint="Private. Never shown to brands. Enter 0 if you are not setting a hard floor yet."><TextInput type="number" value={draft.minimumRate} onChange={v=>update('minimumRate',v)} placeholder="e.g. 15000"/></Label>
              <Label title="Public starting rate (optional)" hint="Only shown if you choose to provide it. This is not your private minimum."><TextInput type="number" value={draft.publicStartingRate} onChange={v=>update('publicStartingRate',v)} placeholder="Leave blank to keep pricing private"/></Label>
              <p className="rounded-xl border border-[#F0443E]/20 bg-[#F0443E]/[0.06] p-3 text-[9px] leading-relaxed text-[#D0AAA7]"><LockKeyhole size={11} className="mr-1 inline"/> Your target and minimum remain private. The assistant will never disclose your minimum to a brand.</p>
            </>}
            {step===6&&<>
              <Label title="Accepted compensation types"><select className={`${inputClass} mt-2`} value={draft.compensation} onChange={e=>update('compensation',e.target.value)}><option>Cash</option><option>Cash, product barter</option><option>Cash, affiliate</option><option>Cash, product barter, affiliate</option></select></Label>
              <Label title="Preferred payment terms"><select className={`${inputClass} mt-2`} value={draft.paymentTerms} onChange={e=>update('paymentTerms',e.target.value)}><option>50% advance, remaining on delivery</option><option>100% upfront</option><option>Net-15 after publishing</option><option>Net-30 after publishing</option><option>Discuss for each campaign</option></select></Label>
              <Label title="Hard no terms (optional)" hint="Separate terms with commas. These are treated as deal-breakers."><TextArea value={draft.hardNoTerms} onChange={v=>update('hardNoTerms',v)} placeholder="Perpetual usage, unlimited exclusivity, unpaid work…"/></Label>
            </>}
            {step===7&&<>
              <Label title="Previous brand collaborations (optional)" hint="Only enter brands you have actually worked with. Separate with commas."><TextArea value={draft.pastBrands} onChange={v=>update('pastBrands',v)} placeholder="Brand A, Brand B, Brand C" rows={2}/></Label>
              <Label title="Average past payment (optional)"><TextInput value={draft.pastAverage} onChange={v=>update('pastAverage',v)} placeholder="Amount in selected currency" type="number"/></Label>
              <Label title="Portrait image URL (optional)"><TextInput value={draft.portraitUrl} onChange={v=>update('portraitUrl',v)} placeholder="https://…" type="url"/></Label>
              <div className="grid gap-4 sm:grid-cols-2"><Label title="Visual direction"><select className={`${inputClass} mt-2`} value={draft.visualStyle} onChange={e=>update('visualStyle',e.target.value)}><option>Editorial</option><option>Minimal</option><option>Bold</option><option>Warm</option></select></Label><Label title="Writing tone"><select className={`${inputClass} mt-2`} value={draft.writingTone} onChange={e=>update('writingTone',e.target.value)}><option>Confident</option><option>Friendly</option><option>Playful</option><option>Professional</option></select></Label></div>
            </>}
          </div>

          {error&&<div role="alert" className="mt-6 rounded-xl border border-[#F0443E]/25 bg-[#F0443E]/[0.08] px-3.5 py-3 text-[10px] leading-relaxed text-[#FF9B95]">{error}</div>}
          <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6">
            <button onClick={previous} disabled={step===0||saving} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-[10px] text-[#A2A3A9] transition-colors hover:text-white disabled:opacity-30"><ArrowLeft size={13}/> Back</button>
            <div className="flex items-center gap-3">
              {step>1&&step!==5&&<button onClick={skip} disabled={saving} className="text-[10px] text-[#777980] hover:text-white">Skip optional</button>}
              <button onClick={next} disabled={saving} className="site-button site-button-primary min-w-[150px]">{saving?<><LoaderCircle size={14} className="animate-spin"/> Saving…</>:step===7?<>Build my page <Sparkles size={14}/></>:<>Save & continue <ArrowRight size={14}/></>}</button>
            </div>
          </div>
          <p className="mt-5 text-center text-[9px] text-[#62636A]">Your answers save as you continue. You can edit your public details later.</p>
        </section>
      </div>
    </div>
  </main>;
};
