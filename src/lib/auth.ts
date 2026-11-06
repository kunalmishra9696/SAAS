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

  const { data: existing, error: readError } = await supabase
    .from('creator_profiles')
    .select('id,display_name,email,onboarding_step,onboarding_completed')
    .eq('id', user.id)
    .maybeSingle();

  if (readError) throw readError;
  if (existing) return existing as CreatorAuthProfile;

  const displayName =
    typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()
      ? user.user_metadata.display_name.trim().slice(0, 80)
      : (user.email?.split('@')[0] || 'Creator').slice(0, 80);

  const { data: inserted, error: insertError } = await supabase
    .from('creator_profiles')
    .insert({ id: user.id, display_name: displayName, email: user.email || '' })
    .select('id,display_name,email,onboarding_step,onboarding_completed')
    .single();

  if (insertError) {
    // Two tabs can finish signup at once. If the row now exists, prefer it.
    if (insertError.code === '23505') {
      const { data: racedRow, error: racedReadError } = await supabase
        .from('creator_profiles')
        .select('id,display_name,email,onboarding_step,onboarding_completed')
        .eq('id', user.id)
        .single();
      if (!racedReadError && racedRow) return racedRow as CreatorAuthProfile;
    }
    throw insertError;
  }
  return inserted as CreatorAuthProfile;
}
