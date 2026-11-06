import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HomeView } from './views/HomeView';
import { HowItWorksView } from './views/HowItWorksView';
import { ForCreatorsView } from './views/ForCreatorsView';
import { PricingView } from './views/PricingView';
import { FAQView } from './views/FAQView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { NotFoundView } from './views/NotFoundView';
import { DashboardView } from './views/DashboardView';
import { AuthView } from './views/AuthView';
import { OnboardingView } from './views/OnboardingView';
import { LandingPreviewView } from './views/LandingPreviewView';
import { PublicLandingView } from './views/PublicLandingView';

const routePaths: Partial<Record<PageRoute, string>> = {
  home: '/', 'how-it-works': '/how-it-works', 'for-creators': '/platform',
  pricing: '/pricing', faq: '/faq', about: '/about', contact: '/contact',
  legal: '/legal', login: '/login', signup: '/signup',
  'forgot-password': '/forgot-password', onboarding: '/onboarding',
  'landing-preview': '/onboarding/preview', dashboard: '/app',
  'public-landing': '/c/preview', 'public-bio': '/c/preview', '404': '/404',
};

const routeFromPath = (pathname: string): PageRoute => {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path.startsWith('/c/')) return 'public-landing';
  const found = (Object.entries(routePaths) as [PageRoute, string][]).find(([, value]) => value === path);
  return found?.[0] ?? '404';
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => routeFromPath(window.location.pathname));
  const [isPageMounted, setIsPageMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsPageMounted(true), 35);
    const onPopState = () => setCurrentRoute(routeFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => { window.clearTimeout(timer); window.removeEventListener('popstate', onPopState); };
  }, []);

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    const nextPath = routePaths[route] ?? '/404';
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStandaloneLanding = currentRoute === 'public-landing' || currentRoute === 'public-bio' || currentRoute === 'landing-preview';
  const isPrivateSurface = ['dashboard', 'onboarding', 'landing-preview', 'login', 'signup', 'forgot-password'].includes(currentRoute);

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-[#08090b] text-[#f4f3f0] selection:bg-red-500/30 selection:text-white transition-all duration-700 ease-out ${isPageMounted ? 'animate-smooth-entrance' : 'opacity-0 scale-[0.99] blur-[5px]'}`}>
      {!isStandaloneLanding && !isPrivateSurface && <Header currentRoute={currentRoute} onNavigate={handleNavigate} />}
      <main className="flex-1 w-full animate-in fade-in duration-300">
        {currentRoute === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentRoute === 'how-it-works' && <HowItWorksView onNavigate={handleNavigate} />}
        {currentRoute === 'for-creators' && <ForCreatorsView onNavigate={handleNavigate} />}
        {currentRoute === 'pricing' && <PricingView onNavigate={handleNavigate} />}
        {currentRoute === 'faq' && <FAQView onNavigate={handleNavigate} />}
        {currentRoute === 'about' && <AboutView onNavigate={handleNavigate} />}
        {currentRoute === 'contact' && <ContactView onNavigate={handleNavigate} />}
        {currentRoute === 'legal' && <LegalView onNavigate={handleNavigate} />}
        {currentRoute === 'login' && <AuthView initialMode="login" onNavigate={handleNavigate} />}
        {currentRoute === 'signup' && <AuthView initialMode="signup" onNavigate={handleNavigate} />}
        {currentRoute === 'forgot-password' && <ForgotPasswordView onNavigate={handleNavigate} />}
        {currentRoute === 'onboarding' && <OnboardingView onNavigate={handleNavigate} />}
        {currentRoute === 'landing-preview' && <LandingPreviewView onNavigate={handleNavigate} />}
        {(currentRoute === 'public-landing' || currentRoute === 'public-bio') && <PublicLandingView onNavigate={handleNavigate} />}
        {currentRoute === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
        {currentRoute === '404' && <NotFoundView onNavigate={handleNavigate} />}
      </main>
      {!isStandaloneLanding && !isPrivateSurface && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
