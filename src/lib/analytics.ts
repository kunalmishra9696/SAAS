import { supabase } from './supabase';

type PublicEvent = 'page_view' | 'link_click' | 'inquiry_start' | 'inquiry_complete';

function getSessionVisitorId(): string | null {
  try {
    const storageKey = 'vallu_analytics_session';
    const existing = window.sessionStorage.getItem(storageKey);
    if (existing) return existing;
    const created = window.crypto?.randomUUID?.();
    if (!created) return null;
    window.sessionStorage.setItem(storageKey, created);
    return created;
  } catch {
    return null;
  }
}

/**
 * Sends a first-party event to a Supabase Edge Function.
 * The browser session ID is never stored directly; the server hashes it.
 * Analytics failure must never interrupt the public portfolio or enquiry.
 */
export async function trackCreatorEvent(handle: string, event: PublicEvent): Promise<void> {
  if (!supabase || !handle) return;
  try {
    await supabase.functions.invoke('track-creator-event', {
      body: {
        handle,
        event,
        visitorId: event === 'page_view' ? getSessionVisitorId() : undefined,
      },
    });
  } catch {
    // Public browsing and enquiries must continue if analytics is unavailable.
  }
}
