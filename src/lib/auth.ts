import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface CreatorAuthProfile {
  id: string;
  display_name: string;
  email: string;
  onboarding_step: number;
  onboarding_completed: boolean;
}

export async function ensureCreatorProfile(user: User): Promise<CreatorAuthProfile> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const displayName =
    typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()
      ? user.user_metadata.display_name.trim().slice(0, 80)
      : (user.email?.split('@')[0] || 'Creator').slice(0, 80);

  const { data, error } = await supabase
    .from('creator_profiles')
    .upsert(
      { id: user.id, display_name: displayName, email: user.email || '' },
      { onConflict: 'id' }
    )
    .select('id,display_name,email,onboarding_step,onboarding_completed')
    .single();

  if (error) throw error;
  return data as CreatorAuthProfile;
}
