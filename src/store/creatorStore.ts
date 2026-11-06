import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface CreatorData {
  name: string;
  handle: string;
  headline: string;
  bio: string;
  niche: string;
  location: string;
  avatarUrl: string;
  platforms: { name: string; handle: string; followers: string; url?: string }[];
  followersTotal: string;
  avgViews: string;
  monthlyReach: string;
  startingRate: number;
  floorRate: number;
  currency: 'INR' | 'USD';
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
  currency: 'INR' | 'USD';
  status: 'visible' | 'hidden' | 'unfinished' | 'on_hold' | 'declined' | 'accepted';
  submittedAt: string;
  expiresAt?: string;
  dealScore: number;
  redFlags: string[];
  paymentWindow: string;
  usageRights: string;
  transcript: { sender: 'brand' | 'assistant'; text: string; time: string }[];
}

export const EMPTY_CREATOR_DATA: CreatorData = {
  name: '',
  handle: '',
  headline: '',
  bio: '',
  niche: '',
  location: '',
  avatarUrl: '',
  platforms: [],
  followersTotal: '',
  avgViews: '',
  monthlyReach: '',
  startingRate: 0,
  floorRate: 0,
  currency: 'INR',
  paymentTerms: '',
  wants: [],
  rejects: [],
  customWant: '',
  customReject: '',
  pastBrands: [],
  pastAvgPayout: 0,
  isPublished: false,
};

type PageRow = {
  id: string;
  handle: string;
  status: 'draft' | 'published' | 'unpublished';
  page_data: Record<string, any>;
  theme: Record<string, any>;
  published_at: string | null;
};

const str = (value: unknown) => typeof value === 'string' ? value : '';
const num = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const arr = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

function fromRows(profile: any, page: PageRow | null, settings: any): CreatorData {
  const data = page?.page_data || {};
  const preferences = settings?.preferences || {};
  return {
    name: str(profile?.display_name || data.display_name),
    handle: str(page?.handle || data.handle),
    headline: str(data.headline),
    bio: str(data.bio),
    niche: str(profile?.niche),
    location: str(data.location),
    avatarUrl: str(profile?.avatar_url || data.avatar_url),
    platforms: Array.isArray(data.platforms) ? data.platforms.filter((item: any) => item && typeof item === 'object').map((item: any) => ({
      name: str(item.name), handle: str(item.handle), followers: str(item.followers), url: str(item.url) || undefined,
    })) : [],
    followersTotal: str(data.followers_total),
    avgViews: str(data.avg_views),
    monthlyReach: str(data.monthly_reach),
    startingRate: num(settings?.target_rate),
    floorRate: num(settings?.minimum_rate),
    currency: settings?.currency === 'USD' ? 'USD' : 'INR',
    paymentTerms: str(preferences.payment_terms),
    wants: arr(settings?.preferred_categories),
    rejects: [...arr(settings?.excluded_categories), ...arr(settings?.hard_no_terms)],
    customWant: '',
    customReject: '',
    pastBrands: arr(data.past_brands),
    pastAvgPayout: num(preferences.past_average_payout),
    isPublished: page?.status === 'published',
    publishedAt: page?.published_at || undefined,
  };
}

function toPageData(data: CreatorData) {
  // This object is the public portfolio content. Never add private rates or deal rules here.
  return {
    display_name: data.name.trim(),
    handle: data.handle.trim().toLowerCase(),
    headline: data.headline.trim(),
    bio: data.bio.trim(),
    location: data.location.trim(),
    avatar_url: data.avatarUrl.trim(),
    platforms: data.platforms.filter((item) => item.name.trim() || item.handle.trim() || item.followers.trim()),
    followers_total: data.followersTotal.trim(),
    avg_views: data.avgViews.trim(),
    monthly_reach: data.monthlyReach.trim(),
    past_brands: data.pastBrands.filter(Boolean),
  };
}

function toSettings(data: CreatorData) {
  return {
    currency: data.currency,
    target_rate: Math.max(0, data.startingRate),
    minimum_rate: Math.max(0, Math.min(data.floorRate, data.startingRate || data.floorRate)),
    preferences: {
      payment_terms: data.paymentTerms.trim(),
      past_average_payout: Math.max(0, data.pastAvgPayout),
    },
    preferred_categories: data.wants.filter(Boolean),
    excluded_categories: data.rejects.filter(Boolean),
    hard_no_terms: [],
  };
}

function asInbound(row: any, messages: any[]): InboundDeal {
  const score = num(row.score);
  const redFlags = [
    row.hard_block_reason,
    ...(typeof row.score_explanation === 'string' && score < 5 ? ['Offer scored below the visibility threshold.'] : []),
  ].filter((item): item is string => typeof item === 'string' && item.length > 0);
  return {
    id: row.id,
    brandName: str(row.brand_name),
    brandEmail: str(row.brand_email),
    campaignName: str(row.campaign_name),
    deliverable: arr(row.deliverables).join(' · ') || 'Deliverables not supplied',
    offeredBudget: num(row.proposed_amount ?? row.budget_max ?? row.budget_min),
    currency: row.currency === 'USD' ? 'USD' : 'INR',
    status: row.status === 'hard_blocked' || row.status === 'expired' ? 'declined' : row.status,
    submittedAt: str(row.submitted_at || row.created_at),
    expiresAt: row.expires_at || undefined,
    dealScore: Math.round(score * 10),
    redFlags,
    paymentWindow: str(row.payment_terms) || 'Not supplied',
    usageRights: str(row.usage_rights) || 'Not supplied',
    transcript: messages.map((message: any) => ({
      sender: message.sender === 'brand' ? 'brand' : 'assistant',
      text: str(message.body),
      time: message.created_at ? new Date(message.created_at).toLocaleString() : '',
    })),
  };
}

async function currentUserId() {
  if (!supabase) throw new Error('Supabase is not configured. Add the project URL and publishable key to your environment.');
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Your session has expired. Please log in again.');
  return data.user.id;
}

export async function loadCreatorWorkspace() {
  const userId = await currentUserId();
  const [profileResult, pageResult, settingsResult, inquiryResult] = await Promise.all([
    supabase!.from('creator_profiles').select('*').eq('id', userId).single(),
    supabase!.from('creator_pages').select('id,handle,status,page_data,theme,published_at').eq('creator_id', userId).maybeSingle(),
    supabase!.from('creator_settings').select('*').eq('creator_id', userId).maybeSingle(),
    supabase!.from('brand_inquiries').select('*').eq('creator_id', userId).order('created_at', { ascending: false }).limit(100),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (pageResult.error) throw pageResult.error;
  if (settingsResult.error) throw settingsResult.error;
  if (inquiryResult.error) throw inquiryResult.error;

  const inquiries = (inquiryResult.data || []).filter((row: any) => row.status !== 'hard_blocked' && row.status !== 'expired');
  const inquiryIds = inquiries.map((row: any) => row.id);
  let messageRows: any[] = [];
  if (inquiryIds.length) {
    const { data, error } = await supabase!.from('inquiry_messages')
      .select('id,inquiry_id,sender,body,created_at')
      .in('inquiry_id', inquiryIds)
      .order('created_at', { ascending: true });
    if (error) throw error;
    messageRows = data || [];
  }
  const deals = inquiries.map((row: any) => asInbound(
    row,
    messageRows.filter((message: any) => message.inquiry_id === row.id)
  ));

  return {
    userId,
    profile: profileResult.data,
    page: pageResult.data as PageRow | null,
    settings: settingsResult.data,
    creator: fromRows(profileResult.data, pageResult.data as PageRow | null, settingsResult.data),
    deals,
  };
}

async function saveWorkspaceData(data: CreatorData) {
  const userId = await currentUserId();
  const handle = data.handle.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(handle)) {
    throw new Error('Your public handle must be 3–30 characters and use lowercase letters, numbers, hyphens or underscores.');
  }
  if (!data.name.trim()) throw new Error('Add your public name before saving.');
  if (data.startingRate > 0 && data.floorRate > data.startingRate) {
    throw new Error('Your private minimum rate cannot be higher than your target rate.');
  }

  const { data: page, error: pageError } = await supabase!.from('creator_pages').upsert({
    creator_id: userId,
    handle,
    status: data.isPublished ? 'published' : 'draft',
    page_data: toPageData(data),
    theme: { preset: 'noir-editorial', accent: 'red' },
  }, { onConflict: 'creator_id' }).select('id').single();
  if (pageError) throw pageError;

  const { error: profileError } = await supabase!.from('creator_profiles').update({
    display_name: data.name.trim(),
    avatar_url: data.avatarUrl.trim() || null,
    niche: str((data as any).niche) || null,
  }).eq('id', userId);
  if (profileError) throw profileError;

  const { error: settingsError } = await supabase!.from('creator_settings').upsert({
    creator_id: userId,
    ...toSettings(data),
  }, { onConflict: 'creator_id' });
  if (settingsError) throw settingsError;

  return page.id as string;
}

export function useCreatorStore() {
  const [creator, setCreator] = useState<CreatorData>(EMPTY_CREATOR_DATA);
  const [deals, setDeals] = useState<InboundDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const workspace = await loadCreatorWorkspace();
      setCreator(workspace.creator);
      setDeals(workspace.deals);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load your creator workspace.');
      throw cause;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadCreatorWorkspace().then((workspace) => {
      if (!active) return;
      setCreator(workspace.creator);
      setDeals(workspace.deals);
    }).catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Could not load your creator workspace.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const updateCreator = useCallback(async (updates: Partial<CreatorData>) => {
    const next = { ...creator, ...updates };
    setError('');
    setCreator(next);
    try {
      await saveWorkspaceData(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your changes could not be saved.');
      throw cause;
    }
  }, [creator]);

  const saveStep = useCallback(async (step: number, updates: Partial<CreatorData>) => {
    const userId = await currentUserId();
    const next = { ...creator, ...updates };
    setCreator(next);
    await saveWorkspaceData(next);
    const { error } = await supabase!.from('creator_profiles').update({ onboarding_step: Math.min(9, Math.max(0, step)) }).eq('id', userId);
    if (error) throw error;
  }, [creator]);

  const completeOnboarding = useCallback(async (updates: Partial<CreatorData>) => {
    const userId = await currentUserId();
    const next = { ...creator, ...updates };
    await saveWorkspaceData(next);
    const { error } = await supabase!.from('creator_profiles').update({
      onboarding_step: 9,
      onboarding_completed: true,
    }).eq('id', userId);
    if (error) throw error;
    setCreator(next);
  }, [creator]);

  const publishLandingPage = useCallback(async () => {
    await saveWorkspaceData(creator);
    const { error } = await supabase!.rpc('publish_creator_page');
    if (error) throw error;
    setCreator((current) => ({ ...current, isPublished: true, publishedAt: new Date().toISOString() }));
  }, [creator]);

  const saveDraftLandingPage = useCallback(async () => {
    await saveWorkspaceData({ ...creator, isPublished: false });
    const userId = await currentUserId();
    const { error: removeError } = await supabase!.from('public_creator_pages').delete().eq('creator_id', userId);
    if (removeError) throw removeError;
    setCreator((current) => ({ ...current, isPublished: false, publishedAt: undefined }));
  }, [creator]);

  const updateDealStatus = useCallback(async (id: string, status: InboundDeal['status']) => {
    const userId = await currentUserId();
    const { data: inquiry, error: inquiryError } = await supabase!.from('brand_inquiries')
      .select('*').eq('id', id).eq('creator_id', userId).single();
    if (inquiryError) throw inquiryError;

    if (status === 'accepted') {
      const { error: dealError } = await supabase!.from('creator_deals').insert({
        creator_id: userId,
        inquiry_id: inquiry.id,
        brand_name: inquiry.brand_name,
        brand_email: inquiry.brand_email,
        campaign_name: inquiry.campaign_name,
        agreed_amount: inquiry.proposed_amount ?? inquiry.budget_max ?? inquiry.budget_min ?? 0,
        currency: inquiry.currency,
        deliverables: inquiry.deliverables || [],
        deadline: inquiry.campaign_timeline ? null : null,
        usage_rights: inquiry.usage_rights,
        exclusivity: inquiry.exclusivity,
        whitelisting: inquiry.whitelisting,
        payment_terms: inquiry.payment_terms,
        activity_log: [{ event: 'accepted', at: new Date().toISOString(), actor: userId }],
        accepted_at: new Date().toISOString(),
      });
      if (dealError) throw dealError;
    }

    const { error: updateError } = await supabase!.from('brand_inquiries').update({
      status,
      decision_at: status === 'accepted' || status === 'declined' ? new Date().toISOString() : null,
    }).eq('id', id).eq('creator_id', userId);
    if (updateError) throw updateError;
    await refresh();
  }, [refresh]);

  return {
    creator, deals, isLoading, error, refresh,
    updateCreator, saveStep, completeOnboarding,
    publishLandingPage, saveDraftLandingPage, updateDealStatus,
  };
}
