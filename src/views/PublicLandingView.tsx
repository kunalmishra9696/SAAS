import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { supabase } from '../lib/supabase';
import { CreatorPortfolioPage } from '../components/CreatorPortfolioPage';
import { trackCreatorEvent } from '../lib/analytics';
import { LoaderCircle, Search, ArrowLeft } from 'lucide-react';

interface Props { onNavigate:(route:PageRoute)=>void; }

export const PublicLandingView:React.FC<Props>=({onNavigate})=>{
  const [page,setPage]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [notFound,setNotFound]=useState(false);

  useEffect(()=>{
    let active=true;
    const path=window.location.pathname;
    const raw=path.startsWith('/c/')?path.slice(3):path.startsWith('/@')?path.slice(2):'';
    const handle=decodeURIComponent(raw.split('/')[0]||'').toLowerCase();
    const load=async()=>{
      if(!supabase||!handle){setNotFound(true);setLoading(false);return;}
      try{
        const {data,error}=await supabase.from('creator_pages').select('handle,page_data,theme').eq('handle',handle).eq('status','published').maybeSingle();
        if(error)throw error;
        if(active){if(data){setPage(data);void trackCreatorEvent(handle,'page_view');}else setNotFound(true);}
      }catch{if(active)setNotFound(true);}
      finally{if(active)setLoading(false);}
    };
    load();
    return()=>{active=false;};
  },[]);

  if(loading)return <main className="flex min-h-screen items-center justify-center bg-[#090A0D] text-xs text-[#A3A4AA]"><LoaderCircle className="mr-3 animate-spin" size={16}/>Loading creator page…</main>;
  if(notFound||!page)return <main className="flex min-h-screen items-center justify-center bg-[#090A0D] px-6 text-center text-white"><div><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Search size={18} className="text-[#F0443E]"/></div><h1 className="mt-5 font-display text-3xl font-semibold">This page isn't available.</h1><p className="mt-2 max-w-sm text-[11px] leading-relaxed text-[#8F9096]">The link may be incorrect, or the creator has not published this page.</p><button onClick={()=>onNavigate('home')} className="site-button site-button-secondary mt-7"><ArrowLeft size={13}/> Back to VALLU</button></div></main>;
  return <CreatorPortfolioPage pageData={{...page.page_data,visual_style:page.theme?.visual_style||page.page_data.visual_style,writing_tone:page.theme?.writing_tone||page.page_data.writing_tone}} handle={page.handle}/>;
};
