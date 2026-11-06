import React, { useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowRight, Check, LoaderCircle, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';

interface Props { creatorName:string; handle:string; onClose:()=>void; }
type Answers={
  brandName:string;brandEmail:string;campaignName:string;budget:string;currency:'INR'|'USD';
  compensationType:'cash'|'barter'|'affiliate'|'mixed';deliverables:string[];timeline:string;
  usageRights:string;exclusivity:string;whitelisting:boolean;paymentTerms:string;contentRequirements:string;
};
type Line={sender:'brand'|'assistant';body:string};
const initial:Answers={
  brandName:'',brandEmail:'',campaignName:'',budget:'',currency:'INR',compensationType:'cash',
  deliverables:[],timeline:'',usageRights:'',exclusivity:'No',whitelisting:false,paymentTerms:'',contentRequirements:'',
};
const deliverableOptions=['Instagram Reel','Instagram Story','Instagram Carousel','YouTube integration','Dedicated YouTube video','TikTok video','Short-form UGC','Other'];
const usageOptions=['Organic social · 30 days','Organic social · 60 days','Organic social · 90 days','Paid advertising','Perpetual / unlimited','Not sure yet'];
const paymentOptions=['50% advance · 50% on delivery','100% upfront','Net-15 after publishing','Net-30 after publishing','Net-60 after publishing','Discuss with creator'];
const steps=['brandName','brandEmail','campaignName','budget','deliverables','timeline','usageRights','exclusivity','whitelisting','paymentTerms','contentRequirements'] as const;
type Step=typeof steps[number];

const prompts:Record<Step,string>={
  brandName:'Which brand or company are you reaching out from?',
  brandEmail:'What is the best work email for the campaign contact?',
  campaignName:'What product, service or campaign would you like to discuss?',
  budget:'What budget have you set aside for this collaboration?',
  deliverables:'Which content deliverables are you considering?',
  timeline:'When would you like the content to go live?',
  usageRights:'How would you like to use the content?',
  exclusivity:'Will the creator need to avoid working with competing brands?',
  whitelisting:'Would you like to run paid ads through the creator’s social account?',
  paymentTerms:'What payment terms are you proposing?',
  contentRequirements:'Anything else the creator should know about the brief?',
};

const optionClass=(active:boolean)=>`rounded-full border px-3 py-2 text-[10px] transition-colors ${active?'border-[#F0443E]/60 bg-[#F0443E]/10 text-white':'border-white/10 text-[#A4A5AB] hover:border-white/25 hover:text-white'}`;

export const BrandInquiryAssistant:React.FC<Props>=({creatorName,handle,onClose})=>{
  const [answers,setAnswers]=useState<Answers>(initial);
  const [stepIndex,setStepIndex]=useState(0);
  const [lines,setLines]=useState<Line[]>([{sender:'assistant',body:`Hi, I’m ${creatorName}’s collaboration assistant. I’ll collect the campaign details one step at a time. ${creatorName} reviews every proposal and makes the final decision.`}]);
  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [error,setError]=useState('');
  const activeStep=steps[stepIndex];
  const progress=Math.round((stepIndex/steps.length)*100);
  const update=<K extends keyof Answers>(key:K,value:Answers[K])=>setAnswers(prev=>({...prev,[key]:value}));
  const toggleDeliverable=(value:string)=>update('deliverables',answers.deliverables.includes(value)?answers.deliverables.filter(item=>item!==value):[...answers.deliverables,value]);

  const currentAnswer=useMemo(()=>{
    switch(activeStep){
      case 'brandName':return answers.brandName;
      case 'brandEmail':return answers.brandEmail;
      case 'campaignName':return answers.campaignName;
      case 'budget':return answers.budget;
      case 'deliverables':return answers.deliverables.join(', ');
      case 'timeline':return answers.timeline;
      case 'usageRights':return answers.usageRights;
      case 'exclusivity':return answers.exclusivity;
      case 'whitelisting':return answers.whitelisting?'Yes':'No';
      case 'paymentTerms':return answers.paymentTerms;
      case 'contentRequirements':return answers.contentRequirements;
    }
  },[activeStep,answers]);

  const validate=()=>{
    if(activeStep==='brandName'&&answers.brandName.trim().length<2)return 'Enter your brand or company name.';
    if(activeStep==='brandEmail'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.brandEmail.trim()))return 'Enter a valid work email.';
    if(activeStep==='campaignName'&&!answers.campaignName.trim())return 'Add a product or campaign name.';
    if(activeStep==='budget'&&(!answers.budget.trim()||!Number.isFinite(Number(answers.budget))||Number(answers.budget)<0))return 'Enter the budget for this collaboration.';
    if(activeStep==='deliverables'&&answers.deliverables.length===0)return 'Choose at least one deliverable.';
    if(activeStep==='timeline'&&!answers.timeline.trim())return 'Add an expected campaign or posting timeline.';
    if(activeStep==='usageRights'&&!answers.usageRights)return 'Choose how the content may be used.';
    if(activeStep==='exclusivity'&&!answers.exclusivity)return 'Choose an exclusivity option.';
    if(activeStep==='paymentTerms'&&!answers.paymentTerms)return 'Choose the proposed payment terms.';
    return '';
  };

  const setCurrentValue=(value:string)=>{
    if(activeStep==='brandName')update('brandName',value);
    if(activeStep==='brandEmail')update('brandEmail',value);
    if(activeStep==='campaignName')update('campaignName',value);
    if(activeStep==='budget')update('budget',value);
    if(activeStep==='timeline')update('timeline',value);
    if(activeStep==='usageRights')update('usageRights',value);
    if(activeStep==='exclusivity')update('exclusivity',value);
    if(activeStep==='paymentTerms')update('paymentTerms',value);
    if(activeStep==='contentRequirements')update('contentRequirements',value);
  };

  const submit=async()=>{
    if(!supabase){setError('The enquiry service is not configured. Please try again later.');return;}
    setLoading(true);setError('');
    const nextLines=[...lines,{sender:'brand' as const,body:'Submitted the campaign details.'}];
    try{
      const {data,error:invokeError}=await supabase.functions.invoke('brand-inquiry',{
        body:{
          handle,brandName:answers.brandName,brandEmail:answers.brandEmail,campaignName:answers.campaignName,
          budget:Number(answers.budget),currency:answers.currency,compensationType:answers.compensationType,
          deliverables:answers.deliverables,timeline:answers.timeline,usageRights:answers.usageRights,
          exclusivity:answers.exclusivity,whitelisting:answers.whitelisting,paymentTerms:answers.paymentTerms,
          contentRequirements:answers.contentRequirements,
          transcript:nextLines.map(line=>({sender:line.sender,body:line.body})),
        },
      });
      if(invokeError)throw invokeError;
      if(data?.error)throw new Error(data.error);
      setLines([...nextLines,{sender:'assistant',body:data?.message||'Your enquiry has been received. The creator will review the proposal. You can close this window now.'}]);
      setSubmitted(true);
    }catch(e){
      setError(e instanceof Error?e.message:'We could not send your enquiry. Please try again.');
    }finally{setLoading(false);}
  };

  const next=async()=>{
    const validation=validate();if(validation){setError(validation);return;}
    setError('');
    if(stepIndex===steps.length-1){await submit();return;}
    const answer=currentAnswer||'Not specified';
    const assistantNext=prompts[steps[stepIndex+1]];
    setLines(prev=>[...prev,{sender:'brand',body:String(answer)},{sender:'assistant',body:assistantNext}]);
    setStepIndex(i=>i+1);
  };

  const back=()=>{
    if(stepIndex===0)return;
    setStepIndex(i=>i-1);
    setLines(prev=>prev.slice(0,-2));
    setError('');
  };

  const field=(content:React.ReactNode)=><div className="border-t border-white/[0.08] px-4 py-4 sm:px-5"><div className="mb-3 flex items-center justify-between"><span className="text-[9px] font-mono uppercase tracking-[.13em] text-[#777980]">YOUR RESPONSE</span><span className="text-[9px] text-[#696A71]">{stepIndex+1} / {steps.length}</span></div>{content}{error&&<p role="alert" className="mt-3 text-[10px] text-[#FF9B95]">{error}</p>}<div className="mt-4 flex items-center justify-between"><button onClick={back} disabled={stepIndex===0||loading} className="text-[10px] text-[#85868D] hover:text-white disabled:opacity-30">Back</button><button onClick={next} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-[#F0443E] px-4 py-2.5 text-[10px] font-semibold text-white hover:bg-[#FF554D] disabled:opacity-50">{loading?<><LoaderCircle size={12} className="animate-spin"/> Sending…</>:stepIndex===steps.length-1?<><Send size={12}/> Send enquiry</>:<>Continue <ArrowRight size={12}/></>}</button></div></div>;

  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6" onMouseDown={e=>{if(e.target===e.currentTarget&&!loading)onClose();}}>
    <section role="dialog" aria-modal="true" aria-label={`Collaboration enquiry for ${creatorName}`} className="flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#141519] shadow-[0_35px_100px_rgba(0,0,0,.6)]">
      <header className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0443E] text-white"><MessageCircle size={16}/></div><div><p className="text-[11px] font-semibold">Collaboration assistant</p><p className="mt-0.5 flex items-center gap-1.5 text-[9px] text-[#7C7D84]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> {creatorName} · Public enquiry</p></div></div>
        <button onClick={onClose} disabled={loading} aria-label="Close assistant" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#8E8F96] hover:text-white"><X size={14}/></button>
      </header>
      <div className="h-1 bg-white/[0.05]"><div className="h-full bg-[#F0443E] transition-all duration-500" style={{width:`${submitted?100:progress}%`}}/></div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-5">
        {lines.map((line,i)=><div key={i} className={`flex ${line.sender==='brand'?'justify-end':'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-3.5 py-3 ${line.sender==='brand'?'rounded-tr-md bg-[#F0443E] text-white':'rounded-tl-md border border-white/[0.07] bg-white/[0.045] text-[#E8E7E5]'}`}><p className="whitespace-pre-wrap text-[10px] leading-relaxed">{line.body}</p></div></div>)}
        {!submitted&&<div className="flex justify-start"><div className="rounded-2xl rounded-tl-md border border-white/[0.07] bg-white/[0.045] px-3.5 py-3"><p className="mb-2 text-[8px] font-mono uppercase tracking-[.12em] text-[#777980]">VALLU ASSISTANT</p><p className="text-[10px] leading-relaxed text-[#E8E7E5]">{prompts[activeStep]}</p></div></div>}
        {submitted&&<div className="flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-3 text-[9px] leading-relaxed text-emerald-200"><Check size={13} className="mt-0.5 shrink-0"/> This is a proposal, not an accepted deal. The creator makes the final decision.</div>}
      </div>

      {!submitted&&<>{activeStep==='brandName'&&field(<input className="auth-field" autoFocus value={answers.brandName} onChange={e=>update('brandName',e.target.value)} placeholder="Your brand or company name" maxLength={100}/>)}
        {activeStep==='brandEmail'&&field(<input className="auth-field" autoFocus type="email" value={answers.brandEmail} onChange={e=>update('brandEmail',e.target.value)} placeholder="name@company.com" maxLength={254}/>)}
        {activeStep==='campaignName'&&field(<textarea className="auth-field resize-none" autoFocus rows={2} value={answers.campaignName} onChange={e=>update('campaignName',e.target.value)} placeholder="Product name or campaign objective" maxLength={160}/>)}
        {activeStep==='budget'&&field(<div><div className="flex gap-2"><select className="auth-field w-[105px] shrink-0" value={answers.currency} onChange={e=>update('currency',e.target.value as 'INR'|'USD')}><option value="INR">INR ₹</option><option value="USD">USD $</option></select><input className="auth-field" type="number" min="0" value={answers.budget} onChange={e=>update('budget',e.target.value)} placeholder="Campaign budget"/></div><div className="mt-3 flex flex-wrap gap-2">{(['cash','barter','affiliate','mixed'] as const).map(value=><button key={value} onClick={()=>update('compensationType',value)} className={optionClass(answers.compensationType===value)}>{value==='cash'?'Cash':value==='barter'?'Product barter':value==='affiliate'?'Affiliate':'Mixed'}</button>)}</div><p className="mt-2 text-[9px] text-[#777980]">For non-cash collaborations, enter 0 as the cash budget.</p></div>)}
        {activeStep==='deliverables'&&field(<div className="flex flex-wrap gap-2">{deliverableOptions.map(value=><button key={value} onClick={()=>toggleDeliverable(value)} className={optionClass(answers.deliverables.includes(value))}>{answers.deliverables.includes(value)&&<Check size={10} className="mr-1 inline"/>}{value}</button>)}</div>)}
        {activeStep==='timeline'&&field(<input className="auth-field" autoFocus value={answers.timeline} onChange={e=>update('timeline',e.target.value)} placeholder="e.g. First week of December" maxLength={180}/>)}
        {activeStep==='usageRights'&&field(<div className="flex flex-wrap gap-2">{usageOptions.map(value=><button key={value} onClick={()=>update('usageRights',value)} className={optionClass(answers.usageRights===value)}>{value}</button>)}</div>)}
        {activeStep==='exclusivity'&&field(<div className="flex flex-wrap gap-2">{['No exclusivity','Yes · category exclusivity','To be discussed'].map(value=><button key={value} onClick={()=>update('exclusivity',value)} className={optionClass(answers.exclusivity===value)}>{value}</button>)}</div>)}
        {activeStep==='whitelisting'&&field(<div className="flex flex-wrap gap-2">{[false,true].map(value=><button key={String(value)} onClick={()=>update('whitelisting',value)} className={optionClass(answers.whitelisting===value)}>{value?'Yes, paid amplification':'No'}</button>)}</div>)}
        {activeStep==='paymentTerms'&&field(<div className="flex flex-wrap gap-2">{paymentOptions.map(value=><button key={value} onClick={()=>update('paymentTerms',value)} className={optionClass(answers.paymentTerms===value)}>{value}</button>)}</div>)}
        {activeStep==='contentRequirements'&&field(<div><textarea className="auth-field resize-none" rows={3} value={answers.contentRequirements} onChange={e=>update('contentRequirements',e.target.value)} placeholder="Campaign brief, key points, restrictions… (optional)" maxLength={1200}/><p className="mt-2 text-[9px] text-[#777980]">Optional · You can send without adding more notes.</p></div>)}
      </>}
      <footer className="flex items-center justify-center gap-2 border-t border-white/[0.07] px-4 py-3 text-[8px] leading-relaxed text-[#6C6D73]"><ShieldCheck size={11} className="shrink-0 text-[#FF963F]"/> Your enquiry is shared with this creator. It is not an agreement or acceptance of a deal.</footer>
    </section>
  </div>;
};
