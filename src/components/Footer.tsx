import React from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

interface FooterProps { onNavigate: (route: PageRoute) => void; }

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (route: PageRoute) => onNavigate(route);
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <button className="footer-wordmark" onClick={() => go('home')}><span>✳</span> VALLU</button>
          <p>A more considered way to start, understand and manage brand collaborations.</p>
          <div className="footer-principle"><ShieldCheck size={14} /> Creator stays in control</div>
        </div>
        <div className="footer-column">
          <span>PLATFORM</span>
          <button onClick={() => go('home')}>Overview</button>
          <button onClick={() => go('how-it-works')}>How it works</button>
          <button onClick={() => go('pricing')}>Pricing</button>
        </div>
        <div className="footer-column">
          <span>COMPANY</span>
          <button onClick={() => go('about')}>About</button>
          <button onClick={() => go('contact')}>Contact</button>
          <button onClick={() => go('faq')}>FAQs</button>
        </div>
        <div className="footer-column">
          <span>INFORMATION</span>
          <button onClick={() => go('legal')}>Privacy & terms</button>
          <button onClick={() => go('login')}>Account access</button>
          <button onClick={() => go('contact')}>Support</button>
        </div>
        <div className="footer-signoff">
          <span>BETTER DEALS START WITH BETTER DETAILS.</span>
          <button onClick={() => go('signup')}>Create your page <ArrowUpRight size={14} /></button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VALLU. All rights reserved.</span>
        <span>BUILT FOR CLEARER COLLABORATIONS.</span>
        <button onClick={() => go('home')}>BACK TO TOP ↑</button>
      </div>
    </footer>
  );
};
