import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { supabase } from '../lib/supabase';
import { CreatorPortfolioPage } from '../components/CreatorPortfolioPage';
import { ArrowLeft, Check, Copy, ExternalLink, Globe, LoaderCircle, Save, Share2 } from 'lucide-react';

interface Props { onNavigate:(route:PageRoute)=>void; }
type PageRecord={id:string;creator_id:string;handle:string;status:string;page_data:Record<string,any>;theme:Record<string,any>;published_data:Record<string,any>|null;published_theme:Record<string,any>|null};

export const LandingPreviewView:React.FC<Props>=({onNavigate})=>{
  const [page,setPage]=useState<PageRecord|null>(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const [published,setPublished]=useState(false);

  useEffect(()=>{
    let active=true;
    const load=async()=>{
      if(!supabase){setError('Supabase is not configured.');setLoading(false);return;}
      try{
        const {data:{user},error:authError}=await supabase.auth.getUser();
        if(authError)throw authError;
        if(!user)throw new Error('Please log in to preview your page.');
        const {data,error:pageError}=await supabase.from('creator_pages').select('*').eq('creator_id',user.id).maybeSingle();
        if(pageError)throw pageError;
        if(!data)throw new Error('Your saved creator page could not be found. Complete onboarding first.');
        if(active){const record=data as PageRecord;const hasLiveVersion=record.status==='published'&&Boolean(record.published_data);const unchanged=hasLiveVersion&&JSON.stringify(record.page_data)===JSON.stringify(record.published_data)&&JSON.stringify(record.theme)===JSON.stringify(record.published_theme);setPage(record);setPublished(Boolean(unchanged));}
      }catch(e){if(active)setError(e instanceof Error?e.message:'Could not load your preview.');}
      finally{if(active)setLoading(false);}
    };
    load();
    return()=>{active=false;};
  },[]);

  const publicUrl=page?window.location.origin+`/c/${page.handle}`:'';
  const copy=async()=>{
    if(!publicUrl)return;
    try{await navigator.clipboard.writeText(publicUrl);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}catch{setError('Copy failed. Select and copy the link manually.');}
  };

  const publish=async()=>{
    if(!supabase||!page)return;
    setSaving(true);setError('');
    try{
      const {data:{user}}=await supabase.auth.getUser();
      if(!user)throw new Error('Your session expired. Please log in again.');
      if(!page.page_data.display_name||!page.handle)throw new Error('Add your public name and handle before publishing.');
      const {error:publishError}=await supabase.rpc('publish_creator_page');
      if(publishError)throw publishError;
      setPage(current=>current?{
        ...current,
        status:'published',
        published_at:new Date().toISOString(),
        published_data:current.page_data,
        published_theme:current.theme,
      }:current);
      setPublished(true);
    }catch(e){setError(e instanceof Error?e.message:'Could not publish your page.');}
    finally{setSaving(false);}
  };

  const saveDraft=async()=>{
    if(!supabase||!page)return;
    setSaving(true);setError('');
    try{
      const {data:{user}}=await supabase.auth.getUser();
      if(!user)throw new Error('Your session expired. Please log in again.');
      // The current page_data is already saved as the draft. Keep the last published snapshot live.
      onNavigate('dashboard');
    }catch(e){setError(e instanceof Error?e.message:'Could not save your draft.');}
    finally{setSaving(false);}
  };

  if(loading)return <main className="flex min-h-screen items-center justify-center bg-[#090A0D] text-xs text-[#A3A4AA]"><LoaderCircle className="mr-3 animate-spin" size={16}/>Loading your page…</main>;
  if(!page)return <main className="flex min-h-screen items-center justify-center bg-[#090A0D] px-5 text-center"><div><p className="text-sm text-[#FF9B95]">{error||'Page unavailable'}</p><button onClick={()=>onNavigate('onboarding')} className="site-button site-button-primary mt-5">Return to setup</button></div></main>;

  return <div className="min-h-screen bg-[#090A0D]">
    <div className="sticky top-0 z-50 border-b border-white/[0.09] bg-[#111216]/95 px-4 py-3 backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
        <button onClick={()=>onNavigate('onboarding')} className="inline-flex items-center gap-2 text-[10px] text-[#A3A4AA] hover:text-white"><ArrowLeft size={13}/> Edit your details</button>
        <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[9px] text-[#A3A4AA]"><Globe size={12} className="text-[#FF963F]"/><span className="hidden sm:inline">YOUR PAGE</span><span className="font-mono text-white">/c/{page.handle}</span><span className={`rounded-full px-2 py-1 ${page.status==='published'&&page.published_data?'bg-emerald-400/10 text-emerald-300':'bg-[#FF963F]/10 text-[#FFB36B]'}`}>{published?'LIVE':page.status==='published'&&page.published_data?'DRAFT CHANGES':'DRAFT'}</span></div>
        <div className="flex items-center gap-2">
          {page.status==='published'&&page.published_data&&<button onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-[10px] text-[#D0D0D2] hover:bg-white/5">{copied?<Check size={12}/>:<Copy size={12}/>} {copied?'Copied':'Copy link'}</button>}
          <button onClick={saveDraft} disabled={saving} className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-[10px] text-[#B1B2B7] hover:bg-white/5 sm:inline-flex"><Save size={12}/> Save draft</button>
          <button onClick={publish} disabled={saving||published} className="inline-flex items-center gap-1.5 rounded-full bg-[#F0443E] px-4 py-2.5 text-[10px] font-semibold text-white hover:bg-[#FF554D] disabled:opacity-50">{saving?<LoaderCircle size={12} className="animate-spin"/>:<Share2 size={12}/>} {published?'Published':page.status==='published'&&page.published_data?'Publish changes':'Publish page'}</button>
        </div>
      </div>
      {error&&<p role="alert" className="mx-auto mt-2 max-w-[1200px] text-[10px] text-[#FF9B95]">{error}</p>}
    </div>
    <CreatorPortfolioPage pageData={{...page.page_data,visual_style:page.theme?.visual_style||page.page_data.visual_style,writing_tone:page.theme?.writing_tone||page.page_data.writing_tone}} handle={page.handle} preview/>
    <div className="fixed bottom-4 right-4 z-40"><button onClick={()=>onNavigate('dashboard')} className="flex items-center gap-2 rounded-full border border-white/10 bg-[#17181D] px-4 py-3 text-[10px] text-white shadow-xl hover:border-[#F0443E]/50">Workspace <ExternalLink size={12}/></button></div>
  </div>;
};
