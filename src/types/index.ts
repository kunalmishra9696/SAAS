export type PageRoute =
  | 'home'
  | 'how-it-works'
  | 'for-creators'
  | 'pricing'
  | 'faq'
  | 'about'
  | 'contact'
  | 'legal'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'onboarding'
  | 'landing-preview'
  | 'public-landing'
  | 'dashboard'
  | 'public-bio'
  | '404';

export interface DealScenario {
  id: string;
  brandName: string;
  brandCategory: string;
  initialBudget: number;
  currency: string;
  deliverables: string;
  timeline: string;
  usageRights: string;
  exclusivity: string;
  whitelisting: boolean;
  paymentWindow: string;
  transcript: {
    sender: 'brand' | 'bot';
    message: string;
    timestamp?: string;
  }[];
  finalOffer: number;
  scores: {
    rate: number; // 40%
    terms: number; // 20%
    trust: number; // 15%
    fit: number; // 15%
    payment: number; // 10%
  };
  totalScore: number;
  status: 'visible' | 'hidden' | 'on_hold' | 'hard_blocked';
  redFlags: string[];
  recommendation: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  bio: string;
  category: string;
  avatarUrl: string;
  followersCount: string;
  platforms: string[];
  targetRate: number;
  minimumFloor: number;
  currency: string;
  currencySymbol: string;
}

export interface Testimonial {
  id: string;
  creatorName: string;
  handle: string;
  category: string;
  followers: string;
  quote: string;
  metric: string;
  avatar: string;
}
