/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ReviewSwitcher } from './components/ReviewSwitcher';

// 12 Page Views
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

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [isPageMounted, setIsPageMounted] = useState(false);

  useEffect(() => {
    // Initial site load zoom-out + blur dissipation
    const timer = setTimeout(() => {
      setIsPageMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStandaloneLanding = currentRoute === 'public-landing' || currentRoute === 'landing-preview';

  return (
    <div
      className={`min-h-screen bg-[#090D16] text-[#f1f5f9] flex flex-col justify-between selection:bg-rose-600/30 selection:text-white transition-all duration-700 ease-out ${
        isPageMounted ? 'animate-smooth-entrance' : 'opacity-0 scale-[0.97] blur-[8px]'
      }`}
    >
      {/* Dynamic Translucent Glass Header (Scroll-Aware) - Hidden on standalone landing pages */}
      {!isStandaloneLanding && (
        <Header currentRoute={currentRoute} onNavigate={handleNavigate} />
      )}

      {/* Main Page Content with smooth route transition */}
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
        {(currentRoute === 'public-landing' || currentRoute === 'public-bio') && (
          <PublicLandingView onNavigate={handleNavigate} />
        )}
        {currentRoute === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
        {currentRoute === '404' && <NotFoundView onNavigate={handleNavigate} />}
      </main>

      {/* Site Footer - Hidden on standalone landing pages */}
      {!isStandaloneLanding && <Footer onNavigate={handleNavigate} />}

      {/* Floating Live Navigator Switcher */}
      <ReviewSwitcher currentRoute={currentRoute} onNavigate={handleNavigate} />
    </div>
  );
}
