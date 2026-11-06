import React from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Instagram, Linkedin, Twitter } from 'lucide-react';

interface FooterProps { onNavigate: (route: PageRoute) => void; }

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#090A0D] pt-14 pb-8">
    <div className="site-container relative z-10">
      <div className="grid gap-12 border-b border-white/[0.08] pb-12 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-[310px]">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0443E] font-display text-sm font-bold text-white">V</span><span className="font-display text-lg font-semibold tracking-[-.04em] text-white">VALLU<span className="text-[#F0443E]">.</span></span></button>
          <p className="mt-5 text-[11px] leading-[1.8] text-[#85868D]">A clearer way to manage the work behind your next brand collaboration.</p>
          <div className="mt-6 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[.12em] text-[#75767D]"><span className="h-1.5 w-1.5 rounded-full bg-[#F0443E]"/> Built for independent creators</div>
        </div>
        <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.14em] text-white">Explore</p><div className="space-y-3">{[['Overview','home'],['How it works','how-it-works'],['Pricing','pricing']].map(([t,r])=><button key={r} onClick={() => onNavigate(r as PageRoute)} className="block text-[11px] text-[#898A90] transition-colors hover:text-white">{t}</button>)}</div></div>
        <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.14em] text-white">Company</p><div className="space-y-3">{[['About','about'],['Contact','contact'],['FAQ','faq']].map(([t,r])=><button key={r} onClick={() => onNavigate(r as PageRoute)} className="block text-[11px] text-[#898A90] transition-colors hover:text-white">{t}</button>)}</div></div>
        <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.14em] text-white">Legal</p><div className="space-y-3">{[['Privacy policy','legal'],['Terms of service','legal'],['Security','legal']].map(([t,r],i)=><button key={i} onClick={() => onNavigate(r as PageRoute)} className="block text-[11px] text-[#898A90] transition-colors hover:text-white">{t}</button>)}</div></div>
      </div>
      <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-[#65666C]">© {new Date().getFullYear()} VALLU. All rights reserved.</p>
        <div className="flex items-center gap-3"><span className="text-[9px] text-[#65666C]">Made for better collaborations</span><span className="h-1 w-1 rounded-full bg-[#F0443E]"/></div>
      </div>
    </div>
  </footer>
);
