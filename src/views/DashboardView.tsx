import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageRoute } from '../types';
import { supabase } from '../lib/supabase';
import {
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, Check, CheckCircle2,
  Clock3, Copy, ExternalLink, Eye, FileText, Globe, Inbox, LoaderCircle,
  LockKeyhole, LogOut, MessageCircle, MoreHorizontal, Pause, RefreshCw,
  ShieldCheck, Sparkles, TrendingUp, X, XCircle
} from 'lucide-react';

interface Props { onNavigate:(route:PageRoute)=>void; }
type Inquiry=Record<string,any>;
type Deal=Record<string,any>;
type Tab='visible'|'hidden'|'unfinished'|'on_hold'|'accepted'|'declined';

const tabs:{id:Tab;label:string}[]=[
  {id:'visible',label:'Visible'}, {id:'hidden',label:'Hidden'}, {id:'unfinished',label:'Unfinished'},
  {id:'on_hold',label:'On hold'}, {id:'accepted',label:'Accepted'}, {id:'declined',label:'Declined'}
];
const money=(amount:number,currency:string)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:currency||'INR',maximumFractionDigits:0}).format(Number(amount)||0);
const timeLeft=(date:string|null)=>{
  if(!date)return 'No deadline';
  const diff=new Date(date).getTime()-Date.now();
  if(diff<=0)return 'Expired';
  const days=Math.floor(diff/86400000);
  const hours=Math.floor((diff%86400000)/3600000);
  return days>0?`${days}d ${hours}h left`:`${hours}h left`;
};

export const DashboardView:React.FC<Props>=({onNavigate})=>{
  const [userId,setUserId]=useState('');
  const [profile,setProfile]=useState<any>(null);
  const [page,setPage]=useState<any>(null);
  const [inquiries,setInquiries]=useState<Inquiry[]>([]);
  const [deals,setDeals]=useState<Deal[]>([]);
  const [analytics,setAnalytics]=useState<any[]>([]);
  const [tab,setTab]=useState<Tab>('visible');
  const [selected,setSelected]=useState<Inquiry|null>(null);
  const [transcript,setTranscript]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [actionLoading,setActionLoading]=useState(false);
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const [currency,setCurrency]=useState('INR');
  const [target,setTarget]=useState('');
  const [minimum,setMinimum]=useState('');
  const [savingSettings,setSavingSettings]=useState(false);

  const load=useCallback(async()=>{
    if(!supabase){setError('Supabase is not configured.');setLoading(false);return;}
    setError('');
    const {data:{user},error:authError}=await supabase.auth.getUser();
    if(authError)throw authError;
    if(!user){onNavigate('login');return;}
    setUserId(user.id);
    const [profileRes,pageRes,inquiryRes,dealRes,analyticsRes,settingsRes]=await Promise.all([
      supabase.from('creator_profiles').select('*').eq('id',user.id).maybeSingle(),
      supabase.from('creator_pages').select('*').eq('creator_id',user.id).maybeSingle(),
      supabase.from('brand_inquiries').select('*').eq('creator_id',user.id).order('created_at',{ascending:false}),
      supabase.from('creator_deals').select('*').eq('creator_id',user.id).order('created_at',{ascending:false}),
      supabase.from('analytics_daily').select('*').eq('creator_id',user.id).order('day',{ascending:true}).limit(30),
      supabase.from('creator_settings').select('*').eq('creator_id',user.id).maybeSingle(),
    ]);
    for(const result of [profileRes,pageRes,inquiryRes,dealRes,analyticsRes,settingsRes])if(result.error)throw result.error;
    if(!profileRes.data?.onboarding_completed||!pageRes.data){onNavigate('onboarding');return;}
    setProfile(profileRes.data);setPage(pageRes.data);setInquiries(inquiryRes.data||[]);setDeals(dealRes.data||[]);setAnalytics(analyticsRes.data||[]);
    setCurrency(settingsRes.data?.currency||'INR');setTarget(settingsRes.data?.target_rate?String(settingsRes.data.target_rate):'');setMinimum(settingsRes.data?.minimum_rate?String(settingsRes.data.minimum_rate):'');
  },[onNavigate]);

  useEffect(()=>{
    let active=true;
    load().catch(e=>{if(active)setError(e instanceof Error?e.message:'Could not load your workspace.');}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[load]);

  const counts=useMemo(()=>tabs.reduce((acc,t)=>({...acc,[t.id]:inquiries.filter(i=>i.status===t.id).length}),{} as Record<Tab,number>),[inquiries]);
  const visible=inquiries.filter(i=>i.status==='visible');
  const pipeline=visible.reduce((sum,i)=>sum+Number(i.proposed_amount||i.budget_max||i.budget_min||0),0);
  const acceptedRevenue=deals.filter(d=>d.status!=='cancelled').reduce((sum,d)=>sum+Number(d.agreed_amount||0),0);
  const pageViews=analytics.reduce((sum,a)=>sum+Number(a.page_views||0),0);
  const unique=analytics.reduce((sum,a)=>sum+Number(a.unique_visitors||0),0);
  const clicks=analytics.reduce((sum,a)=>sum+Number(a.link_clicks||0),0);
  const chartMax=Math.max(1,...analytics.map(a=>Number(a.page_views||0)));
  const filtered=inquiries.filter(i=>i.status===tab).sort((a,b)=>Number(b.score||0)-Number(a.score||0));

  const copyLink=async()=>{
    if(!page?.handle)return;
    try{await navigator.clipboard.writeText(window.location.origin+`/c/${page.handle}`);setCopied(true);window.setTimeout(()=>setCopied(false),1700);}
    catch{setError('Could not copy the public link.');}
  };

  const openInquiry=async(inquiry:Inquiry)=>{
    setSelected(inquiry);setTranscript([]);
    if(!supabase)return;
    const {data,error:messageError}=await supabase.from('inquiry_messages').select('id,sender,body,created_at').eq('inquiry_id',inquiry.id).order('created_at',{ascending:true});
    if(messageError){setError(messageError.message);return;}
    setTranscript(data||[]);
  };

  const setInquiryStatus=async(inquiry:Inquiry,status:Tab)=>{
    if(!supabase)return;
    setActionLoading(true);setError('');
    try{
      if(status==='accepted'){
        if(!inquiry.proposed_amount||Number(inquiry.proposed_amount)<=0)throw new Error('This enquiry has no confirmed amount. It cannot become a deal yet.');
        const {error:dealError}=await supabase.from('creator_deals').upsert({
          creator_id:userId,inquiry_id:inquiry.id,brand_name:inquiry.brand_name,brand_email:inquiry.brand_email,
          campaign_name:inquiry.campaign_name,currency:inquiry.currency||'INR',agreed_amount:Number(inquiry.proposed_amount),
          deliverables:inquiry.deliverables||[],usage_rights:inquiry.usage_rights,exclusivity:inquiry.exclusivity,
          whitelisting:inquiry.whitelisting||false,payment_terms:inquiry.payment_terms,status:'accepted',
        },{onConflict:'inquiry_id'});
        if(dealError)throw dealError;
      }
      const {error:updateError}=await supabase.from('brand_inquiries').update({status,decision_at:new Date().toISOString()}).eq('id',inquiry.id).eq('creator_id',userId);
      if(updateError)throw updateError;
      setInquiries(prev=>prev.map(i=>i.id===inquiry.id?{...i,status,decision_at:new Date().toISOString()}:i));
      if(status==='accepted'){
        const {data}=await supabase.from('creator_deals').select('*').eq('creator_id',userId).order('created_at',{ascending:false});
        setDeals(data||[]);
      }
      setSelected(null);
    }catch(e){setError(e instanceof Error?e.message:'Could not update this enquiry.');}
    finally{setActionLoading(false);}
  };

  const saveRates=async()=>{
    if(!supabase)return;
    if(Number(minimum||0)>Number(target||0)) {setError('Your minimum rate cannot be higher than the target rate.');return;}
    setSavingSettings(true);setError('');
    try{
      const {error:saveError}=await supabase.from('creator_settings').upsert({
        creator_id:userId,currency,target_rate:Number(target)||0,minimum_rate:Number(minimum)||0
      },{onConflict:'creator_id'});
      if(saveError)throw saveError;
    }catch(e){setError(e instanceof Error?e.message:'Could not save your rates.');}
    finally{setSavingSettings(false);}
  };

  const logout=async()=>{
    if(!supabase)return;
    await supabase.auth.signOut();
    onNavigate('login');
  };

  if(loading)return <main className="flex min-h-screen items-center justify-center bg-[#090A0D] text-xs text-[#A3A4AA]"><LoaderCircle className="mr-3 animate-spin" size={16}/>Loading your workspace…</main>;

  return <main className="min-h-screen bg-[#090A0D] px-4 pb-20 pt-28 text-[#F4F3F0] sm:px-6">
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="site-eyebrow">Your private workspace</div><h1 className="mt-4 font-display text-4xl font-semibold tracking-[-.06em] sm:text-5xl">Good to see you, {profile?.display_name||'creator'}.</h1><p className="mt-2 text-[11px] text-[#85868D]">Your page, your enquiries, your decisions.</p></div>
        <div className="flex flex-wrap items-center gap-2"><button onClick={()=>onNavigate('onboarding')} className="rounded-full border border-white/10 px-4 py-2.5 text-[10px] text-[#C5C5C8] hover:bg-white/5">Edit page</button><button onClick={copyLink} className="inline-flex items-center gap-2 rounded-full bg-[#F0443E] px-4 py-2.5 text-[10px] font-semibold text-white hover:bg-[#FF554D]">{copied?<Check size={12}/>:<Copy size={12}/>} {copied?'Copied':'Copy creator link'}</button><button onClick={logout} title="Log out" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#8D8E95] hover:text-white"><LogOut size={14}/></button></div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {label:'Page views',value:pageViews.toLocaleString(),hint:'Recorded page visits',icon:Eye,color:'text-[#FF963F]'},
          {label:'Unique visitors',value:unique.toLocaleString(),hint:'Privacy-friendly estimate',icon:Globe,color:'text-[#F0443E]'},
          {label:'Visible offers',value:String(visible.length),hint:'Awaiting your decision',icon:Inbox,color:'text-[#FF963F]'},
          {label:'Accepted value',value:money(acceptedRevenue,currency),hint:'Across accepted deals',icon:TrendingUp,color:'text-emerald-300'},
        ].map(item=>{const Icon=item.icon;return <div key={item.label} className="rounded-2xl border border-white/[0.09] bg-[#141519] p-5"><div className="flex items-center justify-between"><span className="text-[10px] text-[#909198]">{item.label}</span><Icon size={15} className={item.color}/></div><p className="mt-5 font-display text-3xl font-semibold tracking-[-.05em]">{item.value}</p><p className="mt-1 text-[9px] text-[#6F7076]">{item.hint}</p></div>})}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
        <section className="rounded-2xl border border-white/[0.09] bg-[#141519] p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold">Page activity</p><p className="mt-1 text-[9px] text-[#74757C]">Daily views · recent 30 days</p></div><BarChart3 size={16} className="text-[#F0443E]"/></div>
          {analytics.length===0?<div className="flex min-h-[178px] flex-col items-center justify-center text-center"><Activity size={19} className="text-[#65666C]"/><p className="mt-3 text-[11px] text-[#B9B9BC]">No page activity yet.</p><p className="mt-1 text-[9px] text-[#73747A]">Share your public creator link to start learning what works.</p></div>:<div className="mt-7 flex h-[150px] items-end gap-1.5">{analytics.map((day)=><div key={day.day} title={`${day.day}: ${day.page_views} views`} className="group relative flex-1 rounded-t-[3px] bg-[#F0443E]/70 transition-colors hover:bg-[#FF963F]" style={{height:`${Math.max(3,(Number(day.page_views||0)/chartMax)*100)}%`}}/>)}</div>}
          <div className="mt-5 flex flex-wrap gap-6 border-t border-white/[0.08] pt-4"><div><p className="text-[9px] text-[#73747A]">Link clicks</p><p className="mt-1 text-sm font-semibold">{clicks.toLocaleString()}</p></div><div><p className="text-[9px] text-[#73747A]">Inquiry starts</p><p className="mt-1 text-sm font-semibold">{inquiries.length.toLocaleString()}</p></div><div><p className="text-[9px] text-[#73747A]">Completed enquiries</p><p className="mt-1 text-sm font-semibold">{inquiries.filter(i=>i.submitted_at).length.toLocaleString()}</p></div></div>
        </section>

        <section className="rounded-2xl border border-white/[0.09] bg-[#141519] p-5 sm:p-6">
          <div className="flex items-center justify-between"><p className="text-[10px] font-semibold">Your public page</p><span className={`rounded-full px-2.5 py-1 text-[9px] ${page?.status==='published'?'bg-emerald-400/10 text-emerald-300':'bg-[#FF963F]/10 text-[#FFB36B]'}`}>{page?.status==='published'?'Published':'Draft'}</span></div>
          <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#0D0E11] p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0443E] font-display text-sm font-bold">{String(profile?.display_name||'C').slice(0,1)}</div><div><p className="text-[11px] font-semibold">{profile?.display_name}</p><p className="text-[9px] text-[#75767C]">/c/{page?.handle}</p></div></div><p className="mt-4 line-clamp-2 text-[10px] leading-relaxed text-[#8C8D94]">{page?.page_data?.headline||'Your creator headline will appear here.'}</p><div className="mt-4 flex items-center gap-2 text-[9px] text-[#777980]"><LockKeyhole size={11}/> Private settings stay private</div></div>
          <div className="mt-4 flex gap-2"><button onClick={()=>onNavigate('landing-preview')} className="flex-1 rounded-full border border-white/10 py-2.5 text-[10px] text-[#C9C9CC] hover:bg-white/5">Preview page</button><button onClick={()=>onNavigate('onboarding')} className="flex-1 rounded-full border border-white/10 py-2.5 text-[10px] text-[#C9C9CC] hover:bg-white/5">Edit details</button></div>
          {page?.status==='published'&&<button onClick={()=>window.open(`/c/${page.handle}`,'_blank','noopener,noreferrer')} className="mt-3 flex w-full items-center justify-center gap-2 text-[9px] text-[#FF963F] hover:text-white">Open public page <ExternalLink size={11}/></button>}
        </section>
      </div>

      <section className="mt-7 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#141519]">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><div className="site-eyebrow">Brand inbox</div><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-.05em]">Every enquiry, in context.</h2></div><button onClick={()=>load().catch(e=>setError(e.message))} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#85868D] hover:text-white" title="Refresh"><RefreshCw size={13}/></button></div>
          <div className="flex gap-1 overflow-x-auto pb-1">{tabs.map(item=><button key={item.id} onClick={()=>setTab(item.id)} className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[9px] transition-colors ${tab===item.id?'bg-[#F0443E] text-white':'bg-white/[0.035] text-[#92939A] hover:bg-white/[0.08]'}`}>{item.label}<span className={`font-mono ${tab===item.id?'text-white/70':'text-[#66676D]'}`}>{counts[item.id]}</span></button>)}</div>
        </div>
        {filtered.length===0?<div className="flex min-h-[210px] flex-col items-center justify-center px-5 text-center"><Inbox size={20} className="text-[#66676D]"/><p className="mt-4 text-[12px] font-medium">{tab==='visible'?'No offers to review.':`No ${tabs.find(t=>t.id===tab)?.label.toLowerCase()} items.`}</p><p className="mt-1 max-w-[320px] text-[9px] leading-relaxed text-[#74757C]">{tab==='visible'?'When a brand completes an enquiry on your public page, its proposal will appear here.':'This inbox section will populate when there is something to show.'}</p></div>:<div className="divide-y divide-white/[0.07]">{filtered.map(inquiry=><div key={inquiry.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-[12px] font-semibold">{inquiry.brand_name}</p>{inquiry.score!==null&&<span className="rounded-full bg-[#FF963F]/10 px-2 py-1 text-[9px] text-[#FFB36B]">Score {Number(inquiry.score).toFixed(1)}/10</span>}</div><p className="mt-1 text-[10px] text-[#92939A]">{inquiry.campaign_name||'Brand collaboration enquiry'}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#777980]"><span>{inquiry.proposed_amount?money(inquiry.proposed_amount,inquiry.currency):'Budget not confirmed'}</span><span>{Array.isArray(inquiry.deliverables)?inquiry.deliverables.length+' deliverables':'Scope pending'}</span>{inquiry.expires_at&&<span className="inline-flex items-center gap-1"><Clock3 size={10}/>{timeLeft(inquiry.expires_at)}</span>}</div></div><div className="flex shrink-0 items-center gap-2"><button onClick={()=>openInquiry(inquiry)} className="rounded-full border border-white/10 px-3.5 py-2.5 text-[9px] text-[#C6C6C8] hover:bg-white/5">Inspect details</button>{tab==='visible'&&<><button onClick={()=>setInquiryStatus(inquiry,'on_hold')} disabled={actionLoading} title="Place on hold" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#92939A] hover:text-white"><Pause size={12}/></button><button onClick={()=>setInquiryStatus(inquiry,'accepted')} disabled={actionLoading} className="rounded-full bg-[#F0443E] px-4 py-2.5 text-[9px] font-semibold text-white hover:bg-[#FF554D]">Accept</button></>}</div></div>)}</div>}
      </section>

      <section className="mt-7 rounded-2xl border border-white/[0.09] bg-[#141519] p-5 sm:p-6">
        <div className="flex items-center gap-2"><LockKeyhole size={14} className="text-[#FF963F]"/><p className="text-[10px] font-semibold">Private rate settings</p></div><p className="mt-1 text-[9px] text-[#74757C]">Your floor is never visible to brands or on your public page.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:items-end"><label className="text-[9px] text-[#92939A]">Currency<select value={currency} onChange={e=>setCurrency(e.target.value)} className="auth-field mt-2"><option value="INR">INR</option><option value="USD">USD</option></select></label><label className="text-[9px] text-[#92939A]">Target rate<input type="number" min="0" value={target} onChange={e=>setTarget(e.target.value)} className="auth-field mt-2" placeholder="Your target"/></label><label className="text-[9px] text-[#92939A]">Minimum rate<input type="number" min="0" value={minimum} onChange={e=>setMinimum(e.target.value)} className="auth-field mt-2" placeholder="Private minimum"/></label></div>
        <button onClick={saveRates} disabled={savingSettings} className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[9px] text-[#C7C7CA] hover:bg-white/5 disabled:opacity-50">{savingSettings?<LoaderCircle size={12} className="animate-spin"/>:<Check size={12}/>} Save private rates</button>
      </section>

      {error&&<div role="alert" className="mt-5 rounded-xl border border-[#F0443E]/25 bg-[#F0443E]/[0.08] px-4 py-3 text-[10px] text-[#FF9B95]">{error}</div>}
    </div>

    {selected&&<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
      <section className="flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#15161A] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6"><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#F0443E]">BRAND PROPOSAL</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-.05em]">{selected.brand_name}</h2><p className="mt-1 text-[10px] text-[#8C8D93]">{selected.campaign_name||'Collaboration enquiry'}</p></div><button onClick={()=>setSelected(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#92939A] hover:text-white"><X size={14}/></button></header>
        <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto md:grid-cols-[.88fr_1.12fr]">
          <div className="space-y-4 border-b border-white/[0.08] p-5 md:border-b-0 md:border-r sm:p-6">
            <div className="rounded-xl border border-[#FF963F]/20 bg-[#FF963F]/[0.06] p-4"><p className="text-[9px] text-[#9A8B7C]">PROPOSED COMPENSATION</p><p className="mt-2 font-display text-3xl font-semibold">{selected.proposed_amount?money(selected.proposed_amount,selected.currency):'Not provided'}</p><p className="mt-1 text-[9px] text-[#7D7E84]">Currency: {selected.currency||'INR'}</p></div>
            {[['Deliverables',Array.isArray(selected.deliverables)?selected.deliverables.join(', '):String(selected.deliverables||'Not provided')],['Usage rights',selected.usage_rights||'Not provided'],['Exclusivity',selected.exclusivity||'Not provided'],['Whitelisting',selected.whitelisting?'Requested':'Not requested'],['Payment terms',selected.payment_terms||'Not provided'],['Deadline',selected.campaign_timeline||'Not provided'],['Score explanation',selected.score_explanation||'Not available']].map(([label,value])=><div key={label}><p className="text-[9px] uppercase tracking-[.1em] text-[#707178]">{label}</p><p className="mt-1 text-[10px] leading-relaxed text-[#D0D0D2]">{value}</p></div>)}
            {selected.hard_block_reason&&<div className="rounded-lg border border-[#F0443E]/25 bg-[#F0443E]/[0.08] p-3 text-[9px] text-[#FF9B95]">Hard block: {selected.hard_block_reason}</div>}
          </div>
          <div className="flex min-h-[300px] flex-col p-5 sm:p-6"><div className="mb-4 flex items-center gap-2"><MessageCircle size={13} className="text-[#F0443E]"/><p className="text-[10px] font-semibold">Full conversation</p></div><div className="flex-1 space-y-3">{transcript.length===0?<p className="text-[10px] text-[#73747A]">No conversation messages are stored for this enquiry yet.</p>:transcript.map((message:any)=><div key={message.id} className={`flex ${message.sender==='brand'?'justify-start':'justify-end'}`}><div className={`max-w-[90%] rounded-xl px-3.5 py-3 ${message.sender==='brand'?'bg-white/[0.055]':'bg-[#F0443E]/15 border border-[#F0443E]/20'}`}><p className="mb-1 text-[8px] uppercase tracking-[.1em] text-[#85868D]">{message.sender}</p><p className="text-[10px] leading-relaxed text-[#E2E1E0]">{message.body}</p><p className="mt-2 text-[8px] text-[#74757A]">{new Date(message.created_at).toLocaleString()}</p></div></div>)}</div></div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] p-4 sm:p-5"><span className="text-[9px] text-[#73747A]">You make the final decision.</span><div className="flex gap-2"><button onClick={()=>setInquiryStatus(selected,'declined')} disabled={actionLoading} className="rounded-full border border-white/10 px-4 py-2.5 text-[9px] text-[#C3C3C6] hover:border-[#F0443E]/40">Decline</button><button onClick={()=>setInquiryStatus(selected,'accepted')} disabled={actionLoading||!selected.proposed_amount} className="rounded-full bg-[#F0443E] px-4 py-2.5 text-[9px] font-semibold text-white hover:bg-[#FF554D] disabled:opacity-40">{actionLoading?'Saving…':'Accept proposal'}</button></div></footer>
      </section>
    </div>}
  </main>;
};
