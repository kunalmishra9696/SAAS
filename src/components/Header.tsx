import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const enter = window.setTimeout(() => setEntered(true), 30);
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.clearTimeout(enter);
      window.removeEventListener('scroll', update);
    };
  }, []);

  const links: { label: string; route: PageRoute }[] = [
    { label: 'Product', route: 'how-it-works' },
    { label: 'How it works', route: 'how-it-works' },
    { label: 'Pricing', route: 'pricing' },
  ];

  const go = (route: PageRoute) => {
    setMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className={`mx-auto flex max-w-[1120px] items-center justify-between rounded-full border px-3 py-2.5 backdrop-blur-2xl transition-all duration-500 sm:px-4 ${scrolled ? 'border-white/[0.13] bg-[#101115]/95 shadow-[0_12px_40px_rgba(0,0,0,.4)]' : 'border-white/[0.075] bg-[#101115]/70'} ${entered ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}>
        <button onClick={() => go('home')} aria-label="VALLU home" className="group flex items-center gap-2.5 pl-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0443E] font-display text-[13px] font-bold text-white transition-transform group-hover:rotate-[-12deg]">V</span>
          <span className="font-display text-[16px] font-semibold tracking-[-.04em]">VALLU<span className="text-[#F0443E]">.</span></span>
        </button>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link, index) => <button key={`${link.label}-${index}`} onClick={() => go(link.route)} className={`rounded-full px-4 py-2 text-[11px] transition-colors ${currentRoute === link.route ? 'text-white' : 'text-[#A3A4AA] hover:text-white'}`}>{link.label}</button>)}
          <button onClick={() => go('faq')} className="rounded-full px-4 py-2 text-[11px] text-[#A3A4AA] transition-colors hover:text-white">FAQ</button>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => go('login')} className="rounded-full px-4 py-2 text-[11px] text-[#C4C4C7] transition-colors hover:text-white">Log in</button>
          <button onClick={() => go('signup')} className="inline-flex items-center gap-2 rounded-full bg-[#F0443E] px-4 py-2.5 text-[11px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#FF554D]">Get your link <ArrowUpRight size={13}/></button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#D8D8DA] md:hidden" aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? <X size={16}/> : <Menu size={16}/>}</button>
      </div>
      {menuOpen && <div className="mx-auto mt-2 max-w-[1120px] rounded-2xl border border-white/10 bg-[#141519]/[.98] p-3 shadow-2xl backdrop-blur-2xl md:hidden">
        {[...links, { label: 'FAQ', route: 'faq' as PageRoute }].map((link, index) => <button key={`${link.label}-${index}`} onClick={() => go(link.route)} className="block w-full rounded-xl px-3 py-3 text-left text-xs text-[#C9C9CC] hover:bg-white/[0.05] hover:text-white">{link.label}</button>)}
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3"><button onClick={() => go('login')} className="rounded-full border border-white/10 py-3 text-xs">Log in</button><button onClick={() => go('signup')} className="rounded-full bg-[#F0443E] py-3 text-xs font-semibold">Get started</button></div>
      </div>}
    </header>
  );
};
