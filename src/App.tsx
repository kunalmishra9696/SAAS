/**
 * VALLU application shell.
 * Public marketing and published creator pages are public.
 * Creator onboarding, preview and workspace routes require a Supabase session.
 */
import React, { useCallback, useEffect, useState } from 'react';
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
import { NotFoundView } from './views/NotFoundView';
import { DashboardView } from './views/DashboardView';
import { AuthView } from './views/AuthView';
import { OnboardingView } from './views/OnboardingView';
import { LandingPreviewView } from './views/LandingPreviewView';
import { PublicLandingView } from './views/PublicLandingView';
import { supabase } from './lib/supabase';

const routeByPath: Record<string, PageRoute> = {
  '/': 'home',
  '/how-it-works': 'how-it-works',
  '/for-creators': 'for-creators',
  '/pricing': 'pricing',
  '/faq': 'faq',
  '/about': 'about',
  '/contact': 'contact',
  '/legal': 'legal',
  '/login': 'login',
  '/signup': 'signup',
  '/forgot-password': 'forgot-password',
  '/onboarding': 'onboarding',
  '/preview': 'landing-preview',
  '/workspace': 'dashboard',
  '/dashboard': 'dashboard',
  '/404': '404',
};

const pathByRoute: Partial<Record<PageRoute, string>> = {
  home: '/', 'how-it-works': '/how-it-works', 'for-creators': '/for-creators',
  pricing: '/pricing', faq: '/faq', about: '/about', contact: '/contact',
  legal: '/legal', login: '/login', signup: '/signup',
  'forgot-password': '/forgot-password', onboarding: '/onboarding',
  'landing-preview': '/preview', dashboard: '/workspace', '404': '/404',
};

const routeFromLocation = (): PageRoute => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path.startsWith('/c/') || path.startsWith('/@')) return 'public-landing';
  return routeByPath[path] || '404';
};

const privateRoutes: PageRoute[] = ['onboarding', 'landing-preview', 'dashboard'];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(routeFromLocation);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setAuthUserId(data.session?.user.id ?? null);
        setAuthChecked(true);
      }
    }).catch(() => {
      if (mounted) setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserId(session?.user.id ?? null);
      setAuthChecked(true);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onPopState = () => setCurrentRoute(routeFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = useCallback((route: PageRoute) => {
    const path = pathByRoute[route];
    if (path && window.location.pathname !== path) window.history.pushState({}, '', path);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (privateRoutes.includes(currentRoute) && !authUserId) {
      window.history.replaceState({}, '', '/login');
      setCurrentRoute('login');
    }
  }, [currentRoute, authChecked, authUserId]);

  const isStandaloneLanding = currentRoute === 'public-landing' || currentRoute === 'landing-preview';
  const isPrivate = privateRoutes.includes(currentRoute);

  if (!authChecked && isPrivate) {
    return <div className="flex min-h-screen items-center justify-center bg-[#090A0D] text-[#A3A4AA]"><span className="flex items-center gap-3 text-xs"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-[#F0443E]"/>Checking your workspace…</span></div>;
  }

  return (
    <div className="page-shell flex min-h-screen flex-col text-[#F4F3F0] selection:bg-[#F0443E]/30 selection:text-white">
      {!isStandaloneLanding && <Header currentRoute={currentRoute} onNavigate={handleNavigate} />}
      <main className="w-full flex-1">
        {currentRoute === 'home' && <HomeView onNavigate={handleNavigate}/>}
        {currentRoute === 'how-it-works' && <HowItWorksView onNavigate={handleNavigate}/>}
        {currentRoute === 'for-creators' && <ForCreatorsView onNavigate={handleNavigate}/>}
        {currentRoute === 'pricing' && <PricingView onNavigate={handleNavigate}/>}
        {currentRoute === 'faq' && <FAQView onNavigate={handleNavigate}/>}
        {currentRoute === 'about' && <AboutView onNavigate={handleNavigate}/>}
        {currentRoute === 'contact' && <ContactView onNavigate={handleNavigate}/>}
        {currentRoute === 'legal' && <LegalView onNavigate={handleNavigate}/>}
        {(currentRoute === 'login' || currentRoute === 'signup') && <AuthView initialMode={currentRoute === 'login' ? 'login' : 'signup'} onNavigate={handleNavigate}/>}
        {currentRoute === 'forgot-password' && <AuthView initialMode='login' onNavigate={handleNavigate}/ >}
        {currentRoute === 'onboarding' && <OnboardingView onNavigate={handleNavigate}/>}
        {currentRoute === 'landing-preview' && <LandingPreviewView onNavigate={handleNavigate}/>}
        {(currentRoute === 'public-landing' || currentRoute === 'public-bio') && <PublicLandingView onNavigate={handleNavigate}/>}
        {currentRoute === 'dashboard' && <DashboardView onNavigate={handleNavigate}/>}
        {currentRoute === '404' && <NotFoundView onNavigate={handleNavigate}/>}
      </main>
      {!isStandaloneLanding && <Footer onNavigate={handleNavigate}/>}
    </div>
  );
};
