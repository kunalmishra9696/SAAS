import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Only browser-safe project values belong here. Never place the service-role key in Vite code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cecmtolherzfjtsyrhii.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WbN9FWEHocKe11QUj8gOxw_qg4cNwnO';

const configured = Boolean(
  supabaseUrl.startsWith('https://') &&
  supabasePublishableKey.length > 20
);

export const supabase: SupabaseClient | null = configured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseLive = (): boolean => Boolean(supabase);
export const isSupabaseConfigured = (): boolean => isSupabaseLive();
