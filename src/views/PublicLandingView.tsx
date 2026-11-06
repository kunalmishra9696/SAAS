import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { supabase } from '../lib/supabase';
import { CreatorData } from '../store/creatorStore';
import { CreatorLandingTemplate } from '../components/CreatorLandingTemplate';
import { ArrowUpRight, Globe2 } from 'lucide-react';

interface PublicLandingViewProps { onNavigate: (route: PageRoute) => void; }

function publicSnapshotToCreator(row: any): CreatorData {
  const data = row.published_data || {};
  const platforms = Array.isArray(data.platforms) ? data.platforms.filter((item: any) => item && typeof item === 'object') : [];
  return {
    name: typeof data.display_name === 'string' ? data.display_name : '',
    handle: row.handle,
    headline: typeof data.headline === 'string' ? data.headline : '',
    bio: typeof data.bio === 'string' ? data.bio : '',
    niche: typeof data.niche === 'string' ? data.niche : '',
    location: typeof data.location === 'string' ? data.location : '',
    avatarUrl: typeof data.avatar_url === 'string' ? data.avatar_url : '',
    platforms: platforms.map((item: any) => ({
      name: typeof item.name === 'string' ? item.name : '',
      handle: typeof item.handle === 'string' ? item.handle : '',
      followers: typeof item.followers === 'string' ? item.followers : '',
      url: typeof item.url === 'string' ? item.url : undefined,
    })),
    followersTotal: typeof data.followers_total === 'string' ? data.followers_total : '',
    avgViews: typeof data.avg_views === 'string' ? data.avg_views : '',
    monthlyReach: typeof data.monthly_reach === 'string' ? data.monthly_reach : '',
    startingRate: 0,
    floorRate: 0,
    currency: 'INR',
    paymentTerms: '',
    wants: [],
    rejects: [],
    pastBrands: Array.isArray(data.past_brands) ? data.past_brands.filter((value: unknown) => typeof value === 'string') : [],
    pastAvgPayout: 0,
    isPublished: true,
    publishedAt: row.published_at,
  };
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onNavigate }) => {
  const handle = decodeURIComponent(window.location.pathname.split('/')[2] || '').toLowerCase();
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadPublishedPage = async () => {
      if (!supabase || !/^[a-z0-9][a-z0-9_-]{2,29}$/.test(handle)) {
        if (active) { setError('This creator page is not available.'); setLoading(false); }
        return;
      }
      const { data, error: queryError } = await supabase
        .from('public_creator_pages')
        .select('handle,published_data,published_theme,published_at')
        .eq('handle', handle)
        .maybeSingle();
      if (!active) return;
      if (queryError) setError('We could not load this creator page. Please try again later.');
      else if (!data) setError('This creator page is not published or the link is incorrect.');
      else {
        const pageCreator = publicSnapshotToCreator(data);
        setCreator(pageCreator);
        const visitorKey = 'vallu_public_visitor_v1';
        let visitorId = sessionStorage.getItem(visitorKey);
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          sessionStorage.setItem(visitorKey, visitorId);
        }
        void supabase.functions.invoke('track-creator-event', {
          body: { handle: pageCreator.handle, event: 'page_view', visitorId },
        }).catch(() => undefined);
        document.title = pageCreator.name ? `${pageCreator.name} — Creator page` : 'Creator page';
        const description = pageCreator.headline || pageCreator.bio || 'Creator portfolio and brand collaboration enquiries.';
        let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
        meta.content = description.slice(0, 155);
      }
      setLoading(false);
    };
    void loadPublishedPage();
    return () => { active = false; };
  }, [handle]);

  if (loading) return <div className="public-page-state"><span className="auth-spinner" /> Loading creator page…</div>;
  if (error || !creator) return <div className="public-page-state public-page-error"><Globe2 size={23} /><h1>Page not found.</h1><p>{error || 'This creator page is not available.'}</p><button onClick={() => onNavigate('home')}>Explore VALLU <ArrowUpRight size={14} /></button></div>;

  return <CreatorLandingTemplate creator={creator} isPublic onNavigateHome={() => onNavigate('home')} />;
};
