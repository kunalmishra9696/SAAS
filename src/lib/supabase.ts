import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Public client configuration. Never place a service-role/secret key in a VITE_ variable.
const getSupabaseConfig = () => {
  const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const key = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  const isConfigured = Boolean(
    url.startsWith('https://') &&
    key &&
    !url.includes('your-project-id') &&
    !key.includes('your-')
  );
  return { url, key, isConfigured };
};

const config = getSupabaseConfig();

// Initialize real client if valid URL and key exist; otherwise provide a safe mock client wrapper
export const supabase: SupabaseClient | null = config.isConfigured
  ? createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseLive = (): boolean => {
  return Boolean(supabase);
};

export const isSupabaseConfigured = (): boolean => {
  return isSupabaseLive();
};

// Database TypeScript Types
export interface Profile {
  id: string;
  handle: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  categories: string[];
  platforms: {
    name: string;
    followers: string;
    url?: string;
  }[];
  created_at?: string;
}

export interface CreatorSettings {
  creator_id: string;
  starting_rate_usd: number;
  floor_rate_usd: number;
  counter_limit: number;
  auto_decline_days: number;
  excluded_categories: string[];
}

export type DealStatus = 'visible' | 'on_hold' | 'declined' | 'accepted';

export interface DealOffer {
  id: string;
  creator_id: string;
  brand_name: string;
  brand_email: string;
  campaign_name: string;
  initial_offer_usd: number;
  final_agreed_usd: number;
  deliverables: string;
  rights_terms: string;
  payment_terms: string;
  deal_score: number;
  status: DealStatus;
  expires_at: string;
  created_at: string;
}

export interface NegotiationMessage {
  id: string;
  deal_id: string;
  sender: 'brand' | 'assistant' | 'creator';
  message: string;
  created_at: string;
}

// Local Fallback Storage Engine (Ensures 100% functionality before or alongside real Supabase)
const STORAGE_KEYS = {
  USER: 'vallu_current_user',
  PROFILES: 'vallu_profiles',
  SETTINGS: 'vallu_creator_settings',
  DEALS: 'vallu_deal_offers',
  MESSAGES: 'vallu_negotiation_messages',
};

// Default Seed Creator (Marcus Vance)
const DEFAULT_CREATOR: Profile = {
  id: 'c7b5a8e2-9d3f-4e1b-8a2c-1d5f6e7a8b9c',
  handle: 'marcus',
  display_name: 'Marcus Vance',
  email: 'marcus@vallu.bio',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Cinematographer & tech creator. 480K across YouTube and Instagram exploring workflow gear and digital optics.',
  categories: ['Tech & Hardware', 'Cinematography', 'Creator Tools'],
  platforms: [
    { name: 'YouTube', followers: '320K' },
    { name: 'Instagram', followers: '160K' },
  ],
};

const DEFAULT_SETTINGS: CreatorSettings = {
  creator_id: DEFAULT_CREATOR.id,
  starting_rate_usd: 4000,
  floor_rate_usd: 2500,
  counter_limit: 2,
  auto_decline_days: 14,
  excluded_categories: ['Crypto / Casinos', 'Fast Fashion', 'Dropshipping'],
};

const DEFAULT_DEALS: DealOffer[] = [
  {
    id: 'deal-001',
    creator_id: DEFAULT_CREATOR.id,
    brand_name: 'Nike Running',
    brand_email: 'partnerships@nike.com',
    campaign_name: 'Pegasus 41 Launch Review',
    initial_offer_usd: 3500,
    final_agreed_usd: 4200,
    deliverables: '1x Dedicated YouTube Review (8-12m) + 1x Instagram 60s Reel',
    rights_terms: '60 Days Digital Organic (Perpetuity & Whitelisting Blocked)',
    payment_terms: '50% Advance Wire Upon Signing, 50% on Publish',
    deal_score: 9.2,
    status: 'visible',
    expires_at: new Date(Date.now() + 10 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'deal-002',
    creator_id: DEFAULT_CREATOR.id,
    brand_name: 'Aether Audio',
    brand_email: 'creators@aetheraudio.io',
    campaign_name: 'Studio Wireless Monitoring Headphone',
    initial_offer_usd: 2200,
    final_agreed_usd: 2850,
    deliverables: '1x 90s Mid-roll Integration + Link in Bio for 30 Days',
    rights_terms: '90 Days YouTube Native Only',
    payment_terms: '50% Deposit via Stripe Invoice',
    deal_score: 8.6,
    status: 'visible',
    expires_at: new Date(Date.now() + 12 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'deal-003',
    creator_id: DEFAULT_CREATOR.id,
    brand_name: 'Kronos Watches',
    brand_email: 'sponsorships@kronos.ch',
    campaign_name: 'Chronograph Minimalist Edition',
    initial_offer_usd: 1800,
    final_agreed_usd: 2400,
    deliverables: '2x Instagram Carousel Photos + Story Sequence',
    rights_terms: 'Organic Social Feed Only (No Paid Ads)',
    payment_terms: 'Net-15 Days',
    deal_score: 7.4,
    status: 'on_hold',
    expires_at: new Date(Date.now() + 6 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'deal-004',
    creator_id: DEFAULT_CREATOR.id,
    brand_name: 'Vortex Energy',
    brand_email: 'marketing@vortexbev.com',
    campaign_name: 'Zero-Sugar Energy RTD',
    initial_offer_usd: 900,
    final_agreed_usd: 1200,
    deliverables: '3x TikTok Shorts with Product Placement',
    rights_terms: 'Perpetual Commercial Exploitation (Flagged Predatory)',
    payment_terms: 'Net-90 Days (Flagged)',
    deal_score: 4.1,
    status: 'declined',
    expires_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

const DEFAULT_MESSAGES: Record<string, NegotiationMessage[]> = {
  'deal-001': [
    {
      id: 'm1',
      deal_id: 'deal-001',
      sender: 'brand',
      message: 'Hi Marcus! We have a $3,500 budget allocated for a dedicated review of the Pegasus 41.',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'm2',
      deal_id: 'deal-001',
      sender: 'assistant',
      message: "Thanks for reaching out! Marcus's standard dedicated video rate is $4,500. Based on your deliverables, we can confirm $4,200 with 60-day organic rights and a 50% deposit.",
      created_at: new Date(Date.now() - 2 * 86400000 + 30000).toISOString(),
    },
    {
      id: 'm3',
      deal_id: 'deal-001',
      sender: 'brand',
      message: 'Approved at $4,200 with 50% deposit. Please send over contract and invoice details.',
      created_at: new Date(Date.now() - 2 * 86400000 + 60000).toISOString(),
    },
  ],
};

// Initialize Storage with Defaults if Empty
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([DEFAULT_CREATOR]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify([DEFAULT_SETTINGS]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEALS)) {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(DEFAULT_DEALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
  }
};

initLocalStorage();

// ==========================================
// VALLU Unified Backend API Interface
// ==========================================

export const valluApi = {
  // --- AUTH METHODS ---
  async getCurrentUser(): Promise<User | { id: string; email: string } | null> {
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) return data.user;
    }
    const cached = localStorage.getItem(STORAGE_KEYS.USER);
    return cached ? JSON.parse(cached) : null;
  },

  async signInWithEmail(email: string, password: string): Promise<{ user: any; error: any }> {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return { user: data.user, error: null };
      }
      return { user: null, error };
    }

    // Local / Demo Fallback Auth
    const demoUser = {
      id: DEFAULT_CREATOR.id,
      email: email.trim().toLowerCase(),
      user_metadata: { display_name: 'Marcus Vance' },
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
    return { user: demoUser, error: null };
  },

  async signUpWithEmail(email: string, password: string, metadata: { handle: string; display_name: string }): Promise<{ user: any; error: any }> {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (!error && data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        // Create initial profile in Supabase
        await supabase.from('profiles').upsert({
          id: data.user.id,
          handle: metadata.handle,
          display_name: metadata.display_name,
          email: email,
          categories: ['General Creator'],
          platforms: [],
        });
        return { user: data.user, error: null };
      }
      return { user: null, error };
    }

    // Local / Demo Fallback Signup
    const newUser = {
      id: 'usr-' + Date.now(),
      email: email.trim().toLowerCase(),
      user_metadata: metadata,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

    const newProfile: Profile = {
      id: newUser.id,
      handle: metadata.handle.toLowerCase(),
      display_name: metadata.display_name,
      email: email,
      categories: ['Tech & Lifestyle'],
      platforms: [{ name: 'YouTube', followers: '10K+' }],
    };

    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

    return { user: newUser, error: null };
  },

  async signInWithGoogle(): Promise<{ error: any }> {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { error };
    }

    // Local Simulation for Google Sign In
    const googleUser = {
      id: DEFAULT_CREATOR.id,
      email: 'creator.google@gmail.com',
      user_metadata: { display_name: 'Google Creator User', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(googleUser));
    return { error: null };
  },

  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // --- PROFILES & SETTINGS ---
  async getProfileByHandle(handle: string): Promise<Profile | null> {
    const cleanHandle = handle.toLowerCase().replace('@', '').trim();
    if (supabase) {
      const { data } = await supabase.from('profiles').select('*').eq('handle', cleanHandle).single();
      if (data) return data;
    }
    const profiles: Profile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    return profiles.find((p) => p.handle.toLowerCase() === cleanHandle) || DEFAULT_CREATOR;
  },

  async getCreatorSettings(creatorId: string): Promise<CreatorSettings> {
    if (supabase) {
      const { data } = await supabase.from('creator_settings').select('*').eq('creator_id', creatorId).single();
      if (data) return data;
    }
    const settingsList: CreatorSettings[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '[]');
    return settingsList.find((s) => s.creator_id === creatorId) || DEFAULT_SETTINGS;
  },

  async updateCreatorSettings(settings: CreatorSettings): Promise<void> {
    if (supabase) {
      await supabase.from('creator_settings').upsert(settings);
    }
    const settingsList: CreatorSettings[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '[]');
    const index = settingsList.findIndex((s) => s.creator_id === settings.creator_id);
    if (index >= 0) {
      settingsList[index] = settings;
    } else {
      settingsList.push(settings);
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsList));
  },

  // --- DEALS & OFFERS ---
  async getDeals(creatorId: string, status?: DealStatus): Promise<DealOffer[]> {
    if (supabase) {
      let query = supabase.from('deal_offers').select('*').eq('creator_id', creatorId);
      if (status) {
        query = query.eq('status', status);
      }
      const { data } = await query.order('created_at', { ascending: false });
      if (data) return data;
    }

    const deals: DealOffer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALS) || '[]');
    if (status) {
      return deals.filter((d) => d.status === status);
    }
    return deals;
  },

  async updateDealStatus(dealId: string, newStatus: DealStatus): Promise<void> {
    if (supabase) {
      await supabase.from('deal_offers').update({ status: newStatus }).eq('id', dealId);
    }
    const deals: DealOffer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALS) || '[]');
    const target = deals.find((d) => d.id === dealId);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    }
  },

  async getDealMessages(dealId: string): Promise<NegotiationMessage[]> {
    if (supabase) {
      const { data } = await supabase.from('negotiation_messages').select('*').eq('deal_id', dealId).order('created_at', { ascending: true });
      if (data) return data;
    }
    const allMessages: Record<string, NegotiationMessage[]> = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
    return allMessages[dealId] || DEFAULT_MESSAGES[dealId] || [];
  },

  async submitBrandInquiry(
    creatorId: string,
    brandData: {
      brandName: string;
      brandEmail: string;
      campaignName: string;
      initialBudget: number;
      finalAgreedRate: number;
      deliverables: string;
      rightsDuration: string;
      dealScore: number;
    },
    chatTranscript: { sender: 'brand' | 'assistant'; text: string }[]
  ): Promise<DealOffer> {
    const newDeal: DealOffer = {
      id: 'deal-' + Date.now(),
      creator_id: creatorId,
      brand_name: brandData.brandName,
      brand_email: brandData.brandEmail,
      campaign_name: brandData.campaignName || 'Brand Collaboration Campaign',
      initial_offer_usd: brandData.initialBudget,
      final_agreed_usd: brandData.finalAgreedRate,
      deliverables: brandData.deliverables,
      rights_terms: `${brandData.rightsDuration} Digital Rights`,
      payment_terms: '50% Advance Upon Signing, 50% on Publish',
      deal_score: brandData.dealScore,
      status: 'visible',
      expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('deal_offers').insert(newDeal);
      const messagesToInsert = chatTranscript.map((t) => ({
        deal_id: newDeal.id,
        sender: t.sender,
        message: t.text,
        created_at: new Date().toISOString(),
      }));
      await supabase.from('negotiation_messages').insert(messagesToInsert);
    }

    // Save to local storage
    const deals: DealOffer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALS) || '[]');
    deals.unshift(newDeal);
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));

    const allMessages: Record<string, NegotiationMessage[]> = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
    allMessages[newDeal.id] = chatTranscript.map((t, i) => ({
      id: `msg-${Date.now()}-${i}`,
      deal_id: newDeal.id,
      sender: t.sender,
      message: t.text,
      created_at: new Date().toISOString(),
    }));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));

    return newDeal;
  },
};

// Copyable PostgreSQL Schema for user Supabase Dashboard
export const VALLU_SUPABASE_SQL = `-- VALLU V1 Production Database Schema & RLS Policies
-- Paste into your Supabase Project -> SQL Editor -> Click 'Run'

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  categories TEXT[] DEFAULT '{}',
  platforms JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Creator Settings (Floor Rates Protected)
CREATE TABLE IF NOT EXISTS public.creator_settings (
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  starting_rate_usd NUMERIC NOT NULL DEFAULT 4000,
  floor_rate_usd NUMERIC NOT NULL DEFAULT 2500,
  counter_limit INT NOT NULL DEFAULT 2,
  auto_decline_days INT NOT NULL DEFAULT 14,
  excluded_categories TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Deal Offers
CREATE TABLE IF NOT EXISTS public.deal_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  brand_name TEXT NOT NULL,
  brand_email TEXT NOT NULL,
  campaign_name TEXT,
  initial_offer_usd NUMERIC NOT NULL,
  final_agreed_usd NUMERIC NOT NULL,
  deliverables TEXT NOT NULL,
  rights_terms TEXT DEFAULT '60 Days Digital Organic',
  payment_terms TEXT DEFAULT '50% Advance Upon Signing',
  deal_score NUMERIC NOT NULL DEFAULT 8.5,
  status TEXT NOT NULL DEFAULT 'visible',
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Negotiation Messages
CREATE TABLE IF NOT EXISTS public.negotiation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deal_offers(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view handles/bios; Owners can edit their own
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Creator Settings: Only authenticated owner can read & edit confidential floor rates
CREATE POLICY "Creator Settings Owner Only" ON public.creator_settings FOR ALL USING (auth.uid() = creator_id);

-- Deals: Creator can view & manage their deals; Public can insert inbound inquiries
CREATE POLICY "Creator View Own Deals" ON public.deal_offers FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Public Inbound Insert" ON public.deal_offers FOR INSERT WITH CHECK (true);

-- Negotiation Messages: Read & Insert for deals
CREATE POLICY "Public Negotiation Messages Insert" ON public.negotiation_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Negotiation Messages Read" ON public.negotiation_messages FOR SELECT USING (true);
`;
