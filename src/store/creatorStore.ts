import { useState, useEffect } from 'react';

export interface CreatorData {
  name: string;
  handle: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  platforms: { name: string; handle: string; followers: string }[];
  followersTotal: string;
  avgViews: string;
  monthlyReach: string;
  startingRate: number;
  floorRate: number;
  paymentTerms: string;
  wants: string[];
  rejects: string[];
  customWant?: string;
  customReject?: string;
  pastBrands: string[];
  pastAvgPayout: number;
  isPublished: boolean;
  publishedAt?: string;
}

export interface InboundDeal {
  id: string;
  brandName: string;
  brandEmail: string;
  campaignName: string;
  deliverable: string;
  offeredBudget: number;
  status: 'visible' | 'on_hold' | 'declined' | 'accepted';
  submittedAt: string;
  dealScore: number;
  redFlags: string[];
  paymentWindow: string;
  usageRights: string;
  transcript: { sender: 'brand' | 'assistant'; text: string; time: string }[];
}

export const INITIAL_CREATOR_DATA: CreatorData = {
  name: 'John Doe',
  handle: 'johndoe',
  headline: 'Product Designer & Tech Creator based in Netherlands',
  bio: 'Building autonomous design systems, developer tooling, and sharing behind-the-scenes UI/UX teardowns with 480K+ creatives across YouTube, X, and Newsletter.',
  location: 'Amsterdam, Netherlands',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
  platforms: [
    { name: 'YouTube', handle: '@johndoe', followers: '280K' },
    { name: 'X / Twitter', handle: '@johndoe', followers: '120K' },
    { name: 'Newsletter', handle: 'Design Weekly', followers: '80K' },
  ],
  followersTotal: '480K',
  avgViews: '45K per video',
  monthlyReach: '1.2M impressions',
  startingRate: 4000,
  floorRate: 2800,
  paymentTerms: '50% advance upon contract + Net-15 balance',
  wants: [
    'Dedicated Product Teardown Video',
    'Developer Tools & Software',
    'Multi-month Ambassadorships',
  ],
  rejects: [
    'Rev-share or affiliate-only commission',
    'Perpetual uncredited buyout rights',
    'Gambling, crypto casinos & betting',
  ],
  customWant: '',
  customReject: '',
  pastBrands: ['Notion', 'Linear', 'Supabase', 'Figma', 'Amazon'],
  pastAvgPayout: 3800,
  isPublished: false,
};

export const INITIAL_DEALS: InboundDeal[] = [
  {
    id: 'deal-101',
    brandName: 'Linear',
    brandEmail: 'sponsorships@linear.app',
    campaignName: 'Linear 2.0 Product Launch',
    deliverable: '1x Dedicated Video + X Thread Breakdown',
    offeredBudget: 4500,
    status: 'visible',
    submittedAt: 'Today at 10:14 AM',
    dealScore: 94,
    redFlags: [],
    paymentWindow: 'Net-15',
    usageRights: '60-day digital organic',
    transcript: [
      { sender: 'brand', text: 'Hey John, we have $4,500 allocated for a comprehensive feature breakdown of Linear 2.0.', time: '10:12 AM' },
      { sender: 'assistant', text: 'Thank you! $4,500 meets John’s standard criteria for a dedicated video and thread.', time: '10:13 AM' },
      { sender: 'brand', text: 'Sounds great. 50% deposit upon contract confirmation.', time: '10:14 AM' },
    ],
  },
  {
    id: 'deal-102',
    brandName: 'Supabase',
    brandEmail: 'partnerships@supabase.com',
    campaignName: 'Launch Week 12 Feature Spotlight',
    deliverable: '60s Mid-roll Integration',
    offeredBudget: 3200,
    status: 'visible',
    submittedAt: 'Yesterday',
    dealScore: 88,
    redFlags: [],
    paymentWindow: 'Net-15',
    usageRights: '30-day organic social',
    transcript: [
      { sender: 'brand', text: 'Looking to book a 60s integration for Launch Week 12. Budget is $3,200.', time: 'Yesterday' },
      { sender: 'assistant', text: 'Countering: $3,200 is acceptable for a 60s mid-roll with our standard 14-day production window.', time: 'Yesterday' },
    ],
  },
  {
    id: 'deal-103',
    brandName: 'CloudScale AI',
    brandEmail: 'marketing@cloudscale-ai.io',
    campaignName: 'Full Perpetual Media Campaign',
    deliverable: 'Full Buyout Multi-Platform',
    offeredBudget: 2200,
    status: 'on_hold',
    submittedAt: '2 days ago',
    dealScore: 42,
    redFlags: ['Budget ($2,200) below confidential floor ($2,800)', 'Perpetual buyout requested without compensation'],
    paymentWindow: 'Net-60',
    usageRights: 'Perpetual & Whitelisting',
    transcript: [
      { sender: 'brand', text: 'We offer $2,200 for full perpetual rights across all your channels.', time: '2 days ago' },
      { sender: 'assistant', text: 'Flagged: $2,200 is beneath John’s minimum commercial threshold and perpetual rights require a 2.5x multiplier.', time: '2 days ago' },
    ],
  },
];

const STORAGE_KEY_CREATOR = 'vallu_creator_onboarding_v1';
const STORAGE_KEY_DEALS = 'vallu_creator_deals_v1';

export function getStoredCreatorData(): CreatorData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREATOR);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading creator storage', e);
  }
  return INITIAL_CREATOR_DATA;
}

export function saveCreatorData(data: CreatorData) {
  try {
    localStorage.setItem(STORAGE_KEY_CREATOR, JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving creator storage', e);
  }
}

export function getStoredDeals(): InboundDeal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading deals storage', e);
  }
  return INITIAL_DEALS;
}

export function saveDeals(deals: InboundDeal[]) {
  try {
    localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(deals));
  } catch (e) {
    console.warn('Error saving deals storage', e);
  }
}

// React Hook for Reactive State across components
export function useCreatorStore() {
  const [creator, setCreator] = useState<CreatorData>(getStoredCreatorData);
  const [deals, setDeals] = useState<InboundDeal[]>(getStoredDeals);

  useEffect(() => {
    saveCreatorData(creator);
  }, [creator]);

  useEffect(() => {
    saveDeals(deals);
  }, [deals]);

  const updateCreator = (updates: Partial<CreatorData>) => {
    setCreator((prev) => {
      const next = { ...prev, ...updates };
      saveCreatorData(next);
      return next;
    });
  };

  const publishLandingPage = () => {
    setCreator((prev) => {
      const next = {
        ...prev,
        isPublished: true,
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      saveCreatorData(next);
      return next;
    });
  };

  const saveDraftLandingPage = () => {
    setCreator((prev) => {
      const next = { ...prev, isPublished: false };
      saveCreatorData(next);
      return next;
    });
  };

  const addProposal = (newProposal: Omit<InboundDeal, 'id' | 'status' | 'submittedAt'>) => {
    const fullDeal: InboundDeal = {
      ...newProposal,
      id: `deal-${Date.now()}`,
      status: 'visible',
      submittedAt: 'Just now',
    };
    setDeals((prev) => {
      const next = [fullDeal, ...prev];
      saveDeals(next);
      return next;
    });
    return fullDeal;
  };

  const updateDealStatus = (id: string, status: InboundDeal['status']) => {
    setDeals((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, status } : d));
      saveDeals(next);
      return next;
    });
  };

  return {
    creator,
    deals,
    updateCreator,
    publishLandingPage,
    saveDraftLandingPage,
    addProposal,
    updateDealStatus,
  };
}
