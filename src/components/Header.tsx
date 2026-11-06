import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface HeaderProps { currentRoute: PageRoute; onNavigate: (route: PageRoute) => void; }

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links: { label: string; route: PageRoute }[] = [
    { label: 'How it works', route: 'how-it-works' },
    { label: 'Platform', route: 'for-creators' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'FAQ', route: 'faq' },
  ];
  const go = (route: PageRoute) => { setMenuOpen(false); onNavigate(route); };

  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-brand-pod">
        <button className="brand-symbol" onClick={() => go('home')} aria-label="VALLU home"><span>✳</span></button>
        <button className="brand-name" onClick={() => go('home')}>VALLU<span className="brand-name-dot" /></button>
      </div>
      <div className="header-capsule">
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => <button key={link.route} className={currentRoute === link.route ? 'nav-active' : ''} onClick={() => go(link.route)}>{link.label}</button>)}
        </nav>
        <span className="nav-divider" />
        <button className="nav-login" onClick={() => go('login')}>Log in</button>
        <button className="nav-cta" onClick={() => go('signup')}>Get started <ArrowUpRight size={14} /></button>
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
      {menuOpen && <div className="mobile-nav-panel">
        {links.map((link) => <button key={link.route} onClick={() => go(link.route)}>{link.label}<ArrowUpRight size={14} /></button>)}
        <button onClick={() => go('login')}>Log in</button>
        <button className="mobile-nav-cta" onClick={() => go('signup')}>Get started <ArrowUpRight size={14} /></button>
      </div>}
    </header>
  );
};
