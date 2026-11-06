import React from 'react';
import { ArrowDown, ArrowUpRight, Instagram, Linkedin, Youtube, Globe2, Sparkles, Mail, MapPin } from 'lucide-react';

export interface CreatorPortfolioPageProps {
  pageData: Record<string, any>;
  handle: string;
  preview?: boolean;
}

const safeLink=(value:string)=>{try{const url=new URL(value);return url.protocol==='https:'||url.protocol==='http:'?url.toString():null;}catch{return null;}};

const socialIcon=(platform:string)=>{
  const name=platform.toLowerCase();
  if(name.includes('instagram'))return Instagram;
  if(name.includes('youtube'))return Youtube;
  if(name==='x'||name.includes('twitter'))return Globe2;
  if(name.includes('linkedin'))return Linkedin;
  return Globe2;
};

export const CreatorPortfolioPage:React.FC<CreatorPortfolioPageProps>=({pageData,handle,preview=false})=>{
  const name=String(pageData.display_name||'Creator');
  const headline=String(pageData.headline||'');
  const bio=String(pageData.bio||'');
  const niche=String(pageData.niche||'');
  const location=String(pageData.location||'');
  const topics=Array.isArray(pageData.topics)?pageData.topics.filter(Boolean):[];
  const platforms=Array.isArray(pageData.platforms)?pageData.platforms.filter((p:any)=>p?.url&&safeLink(String(p.url))):[];
  const audience=pageData.audience||{};
  const pastBrands=Array.isArray(pageData.past_brands)?pageData.past_brands.filter(Boolean):[];
  const portrait=safeLink(String(pageData.portrait_url||''));
  const visual=String(pageData.visual_style||'Editorial');
  const theme=visual==='Bold'
    ? {paper:'#101115',ink:'#F4F3F0',muted:'#B6B6B9',accent:'#F0443E',surface:'#1B1C21',border:'rgba(255,255,255,.14)'}
    : visual==='Minimal'
    ? {paper:'#F3F2EF',ink:'#17181C',muted:'#73757C',accent:'#D84A42',surface:'#EAE9E5',border:'rgba(23,24,28,.16)'}
    : visual==='Warm'
    ? {paper:'#F3E8D5',ink:'#34261F',muted:'#78685D',accent:'#C85B3F',surface:'#E9DCC8',border:'rgba(52,38,31,.16)'}
    : {paper:'#FBF6CB',ink:'#101044',muted:'#393B62',accent:'#D9F34A',surface:'#F5EDAC',border:'rgba(16,16,68,.20)'};

  const stats=[
    ['Instagram',pageData.platforms?.find((p:any)=>p.platform==='Instagram')?.followers],
    ['YouTube',pageData.platforms?.find((p:any)=>p.platform==='YouTube')?.followers],
    ['TikTok',pageData.platforms?.find((p:any)=>p.platform==='TikTok')?.followers],
    ['X',pageData.platforms?.find((p:any)=>p.platform==='X')?.followers],
  ].filter((row:any)=>row[1]);

  return <div style={{background:theme.paper,color:theme.ink,'--creator-ink':theme.ink,'--creator-muted':theme.muted,'--creator-accent':theme.accent,'--creator-surface':theme.surface,'--creator-border':theme.border} as React.CSSProperties & Record<string,string>} className="min-h-screen overflow-hidden">
    {preview&&<div className="sticky top-0 z-40 flex items-center justify-center gap-2 border-b border-black/10 bg-white/90 px-4 py-2 text-[10px] font-medium text-black/60 backdrop-blur-xl"><Sparkles size={12}/> Private preview · Only you can see this page</div>}
    <header className="relative z-10 mx-auto flex max-w-[1180px] items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
      <div className="font-display text-[15px] font-bold tracking-[-.04em]">{name}<span style={{color:theme.accent}}>.</span></div>
      <nav className="hidden items-center gap-8 sm:flex">
        {bio&&<a href="#about" className="text-[11px] opacity-70 hover:opacity-100">About</a>}
        {platforms.length>0&&<a href="#connect" className="text-[11px] opacity-70 hover:opacity-100">Connect</a>}
        {pastBrands.length>0&&<a href="#work" className="text-[11px] opacity-70 hover:opacity-100">Selected work</a>}
      </nav>
      <a href="#contact" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold transition-transform hover:-translate-y-0.5" style={{borderColor:theme.border}}>Work with me <ArrowUpRight size={13}/></a>
    </header>

    <main>
      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-6 pb-24 pt-12 sm:px-10 sm:pb-32 sm:pt-16 lg:grid-cols-[1.08fr_.92fr] lg:px-14">
        <div className="relative z-10">
          <p className="font-mono text-[9px] uppercase tracking-[.2em]" style={{color:theme.muted}}>INDEPENDENT CREATOR {niche&&<> / {niche.toUpperCase()}</>}</p>
          <h1 className="mt-7 max-w-[690px] font-display text-[clamp(3.2rem,8.2vw,7.4rem)] font-semibold leading-[.88] tracking-[-.075em]">{headline||name}</h1>
          <div className="mt-7 flex flex-wrap items-center gap-4 text-[11px]" style={{color:theme.muted}}><span>{name}</span>{location&&<span className="inline-flex items-center gap-1"><MapPin size={11}/>{location}</span>}</div>
          {bio&&<p className="mt-7 max-w-[455px] text-[13px] leading-[1.9]" style={{color:theme.muted}}>{bio}</p>}
          <div className="mt-9 flex flex-wrap gap-3"><a href="#contact" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold" style={{background:theme.ink,color:theme.paper}}>Start a collaboration <ArrowUpRight size={14}/></a>{platforms.length>0&&<a href="#connect" className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[11px]" style={{borderColor:theme.border}}>Find me online <ArrowDown size={13}/></a>}</div>
        </div>
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -left-7 top-[12%] h-[72%] w-[72%] rounded-full border" style={{borderColor:theme.border,transform:'rotate(-18deg)'}}/>
          <div className="absolute -right-5 top-[4%] h-20 w-20 rounded-full" style={{background:theme.accent,opacity:.7,filter:'blur(28px)'}}/>
          <div className="relative mx-auto aspect-[.84] w-[82%] overflow-hidden rounded-t-[48%] rounded-b-[6px] border" style={{background:theme.surface,borderColor:theme.border}}>
            {portrait?<img src={portrait} alt={name} className="h-full w-full object-cover"/>:<div className="flex h-full w-full flex-col items-center justify-center p-8 text-center"><span className="font-display text-[100px] font-semibold leading-none tracking-[-.1em]" style={{color:theme.ink}}>{name.slice(0,1).toUpperCase()}</span><span className="mt-4 max-w-[190px] font-mono text-[9px] uppercase tracking-[.18em]" style={{color:theme.muted}}>YOUR WORK / YOUR WORLD</span></div>}
          </div>
          <div className="absolute -bottom-5 -left-2 rounded-full border px-4 py-3 text-[9px] font-mono uppercase tracking-[.12em]" style={{background:theme.paper,borderColor:theme.border}}>Based in {location||'Your own corner of the world'}</div>
          <div className="absolute -right-1 top-[19%] rotate-12 font-display text-5xl" style={{color:theme.ink}}>✳</div>
          <div className="absolute -bottom-1 right-[2%] h-10 w-10 rotate-45" style={{background:theme.accent,clipPath:'polygon(50% 0,65% 35%,100% 50%,65% 65%,50% 100%,35% 65%,0 50%,35% 35%)'}}/>
        </div>
      </section>

      {topics.length>0&&<section className="border-y px-6 py-8 sm:px-10 lg:px-14" style={{borderColor:theme.border,background:theme.surface}}><div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4"><span className="font-mono text-[9px] uppercase tracking-[.18em]" style={{color:theme.muted}}>WHAT I CREATE</span><div className="flex flex-wrap gap-2">{topics.map((topic:string)=><span key={topic} className="rounded-full border px-3 py-2 text-[10px]" style={{borderColor:theme.border}}>{topic}</span>)}</div></div></section>}

      {bio&&<section id="about" className="mx-auto max-w-[1180px] px-6 py-24 sm:px-10 lg:px-14"><div className="grid gap-8 md:grid-cols-[.65fr_1.35fr]"><h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[.85] tracking-[-.07em]" style={{color:theme.accent}}>about<span style={{color:theme.ink}}>.</span></h2><div className="max-w-[650px]"><p className="text-[18px] leading-[1.6] sm:text-[22px]">{bio}</p>{location&&<p className="mt-7 text-[10px] uppercase tracking-[.16em]" style={{color:theme.muted}}>Currently creating in {location}</p>}</div></div></section>}

      {stats.length>0&&<section className="border-y px-6 py-12 sm:px-10 lg:px-14" style={{borderColor:theme.border,background:theme.surface}}><div className="mx-auto max-w-[1180px]"><div className="mb-8 flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[.18em]" style={{color:theme.muted}}>AUDIENCE / SELF-REPORTED</span><span title="Figures are provided by the creator and have not been independently verified." className="cursor-help text-[9px]" style={{color:theme.muted}}>ⓘ About these figures</span></div><div className="grid grid-cols-2 gap-8 md:grid-cols-4">{stats.map(([platform,value]:any)=><div key={platform}><p className="font-display text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-none tracking-[-.06em]">{value}</p><p className="mt-3 text-[10px]" style={{color:theme.muted}}>{platform}</p></div>)}</div>{(audience.average_views||audience.monthly_views||audience.engagement_rate)&&<div className="mt-9 grid grid-cols-2 gap-5 border-t pt-6 sm:grid-cols-3" style={{borderColor:theme.border}}>{audience.average_views&&<div><p className="text-[9px] uppercase tracking-[.12em]" style={{color:theme.muted}}>Average views</p><p className="mt-1 text-[16px] font-semibold">{audience.average_views}</p></div>}{audience.monthly_views&&<div><p className="text-[9px] uppercase tracking-[.12em]" style={{color:theme.muted}}>Monthly views</p><p className="mt-1 text-[16px] font-semibold">{audience.monthly_views}</p></div>}{audience.engagement_rate&&<div><p className="text-[9px] uppercase tracking-[.12em]" style={{color:theme.muted}}>Engagement</p><p className="mt-1 text-[16px] font-semibold">{audience.engagement_rate}</p></div>}</div>}</div></section>}

      {pastBrands.length>0&&<section id="work" className="mx-auto max-w-[1180px] px-6 py-24 sm:px-10 lg:px-14"><div className="grid gap-8 md:grid-cols-[.65fr_1.35fr]"><h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[.85] tracking-[-.07em]" style={{color:theme.accent}}>work<span style={{color:theme.ink}}>.</span></h2><div><p className="max-w-[450px] text-[13px] leading-relaxed" style={{color:theme.muted}}>Selected collaborations shared by {name}.</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{pastBrands.map((brand:string,i:number)=><div key={brand} className="flex min-h-[90px] items-end justify-between border-b p-4" style={{borderColor:theme.border}}><span className="text-[13px] font-semibold">{brand}</span><span className="font-mono text-[9px]" style={{color:theme.muted}}>0{i+1}</span></div>)}</div></div></div></section>}

      {platforms.length>0&&<section id="connect" className="border-y px-6 py-16 sm:px-10 lg:px-14" style={{borderColor:theme.border,background:theme.surface}}><div className="mx-auto flex max-w-[1180px] flex-col gap-7 md:flex-row md:items-center md:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[.18em]" style={{color:theme.muted}}>ELSEWHERE</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em]">Follow the work.</h2></div><div className="flex flex-wrap gap-2">{platforms.map((p:any)=>{const Icon=socialIcon(String(p.platform));return <a key={p.platform} href={safeLink(String(p.url))||'#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[10px] transition-transform hover:-translate-y-0.5" style={{borderColor:theme.border}}><Icon size={13}/>{p.platform}<ArrowUpRight size={11}/></a>})}</div></div></section>}

      <section id="contact" className="mx-auto max-w-[1180px] px-6 py-24 sm:px-10 lg:px-14"><div className="rounded-[28px] p-8 sm:p-12" style={{background:theme.ink,color:theme.paper}}><div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="font-mono text-[9px] uppercase tracking-[.18em]" style={{color:theme.accent}}>THE NEXT PROJECT</p><h2 className="mt-4 max-w-[700px] font-display text-[clamp(2.7rem,6.5vw,5.6rem)] font-semibold leading-[.91] tracking-[-.07em]">Have something<br/>good in mind?</h2><p className="mt-5 max-w-[390px] text-[11px] leading-relaxed opacity-70">Share the basics of your campaign and let’s start a conversation.</p></div><a href="mailto:?subject=Collaboration%20enquiry" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-[11px] font-bold" style={{background:theme.accent,color:theme.ink}}>Start an enquiry <Mail size={14}/></a></div></div></section>
    </main>
    <footer className="mx-auto flex max-w-[1180px] flex-col gap-3 border-t px-6 py-7 text-[9px] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14" style={{borderColor:theme.border,color:theme.muted}}><span>{name} · {handle}</span><span>Made with <a href="/" className="font-semibold underline underline-offset-2">VALLU</a></span></footer>
  </div>;
};
