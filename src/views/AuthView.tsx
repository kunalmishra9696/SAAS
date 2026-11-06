import React, { useState } from 'react';
import { PageRoute } from '../types';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';

interface AuthViewProps { initialMode?: 'signup' | 'login'; onNavigate: (route: PageRoute) => void; }

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'signup', onNavigate }) => {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [forgotMode, setForgotMode] = useState(() => window.location.pathname === '/forgot-password');
  const [recoveryMode, setRecoveryMode] = useState(() => new URLSearchParams(window.location.search).get('recovery') === '1');
  const [confirmPassword, setConfirmPassword] = useState('');

  const ensureCreatorRows = async (user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => {
    if (!supabase) throw new Error('The authentication service is not configured. Add the Supabase URL and publishable key before continuing.');
    const metadata = user.user_metadata || {};
    const name = String(metadata.display_name || displayName || email.split('@')[0] || 'Creator').trim();
    const rawHandle = String(metadata.handle || handle || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    const cleanHandle = rawHandle.replace(/[^a-z0-9_-]/g, '').slice(0, 30);

    const { error: profileError } = await supabase.from('creator_profiles').upsert({
      id: user.id,
      display_name: name,
      email: user.email || email,
      onboarding_completed: false,
    }, { onConflict: 'id' });
    if (profileError) throw profileError;

    const { error: settingsError } = await supabase.from('creator_settings').upsert({
      creator_id: user.id,
      currency: 'INR',
      target_rate: 0,
      minimum_rate: 0,
      negotiation_counter_limit: 2,
      decision_window_days: 14,
    }, { onConflict: 'creator_id' });
    if (settingsError) throw settingsError;

    if (cleanHandle.length >= 3) {
      const { error: pageError } = await supabase.from('creator_pages').upsert({
        creator_id: user.id,
        handle: cleanHandle,
        status: 'draft',
        page_data: { display_name: name },
      }, { onConflict: 'creator_id' });
      if (pageError) throw pageError;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('Supabase is not configured in this build. The app needs its public project URL and publishable key.');
      return;
    }
    if (mode === 'signup' && !/^[a-z0-9][a-z0-9_-]{2,29}$/.test(handle)) {
      setError('Choose a handle with 3–30 characters. Use letters, numbers, hyphens or underscores.');
      return;
    }
    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { display_name: displayName.trim(), handle: handle.trim().toLowerCase() },
            emailRedirectTo: `${window.location.origin}/onboarding`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.user && data.session) {
          await ensureCreatorRows(data.user);
          onNavigate('onboarding');
          return;
        }
        setNotice('Your account request is ready. Check your email to confirm your address, then log in to continue.');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (signInError) throw signInError;
        if (!data.user) throw new Error('We could not confirm your account. Please try again.');
        await ensureCreatorRows(data.user);
        const { data: profile, error: profileLookupError } = await supabase
          .from('creator_profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .maybeSingle();
        if (profileLookupError) throw profileLookupError;
        onNavigate(profile?.onboarding_completed ? 'dashboard' : 'onboarding');
        return;
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('The authentication service is not configured yet.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/login?recovery=1`,
      });
      if (resetError) throw resetError;
      setNotice('If an account exists for that email, Supabase will send a password reset link.');
      setForgotMode(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not request a reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('The authentication service is not configured yet.');
      return;
    }
    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setRecoveryMode(false);
      setMode('login');
      setPassword('');
      setConfirmPassword('');
      setNotice('Your password has been updated. Log in with your new password.');
      window.history.replaceState({}, '', '/login');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not update your password.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: 'signup' | 'login') => {
    setMode(next);
    setForgotMode(false);
    setError('');
    setNotice('');
  };

  return (
    <main className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden px-4 pb-20 pt-28 sm:px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 22%, rgba(240,68,62,.13), transparent 42%), radial-gradient(ellipse at 82% 78%, rgba(255,150,63,.06), transparent 30%)' }}/>
      <div className="relative z-10 grid w-full max-w-[990px] overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#141519] shadow-[0_35px_110px_rgba(0,0,0,.48)] lg:grid-cols-[.93fr_1.07fr]">
        <aside className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-[#101115] p-9 lg:flex">
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#F0443E]/[0.16] blur-[100px]"/>
          <div className="relative z-10 flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0443E] font-display text-sm font-bold">V</span><span className="font-display text-lg font-semibold">VALLU<span className="text-[#F0443E]">.</span></span></div>
          <div className="relative z-10">
            <span className="site-eyebrow">A more considered way to collaborate</span>
            <h1 className="mt-6 font-display text-[58px] font-semibold leading-[.94] tracking-[-.07em]">Your work.<br/>Your terms.<br/><span className="text-[#F0443E]">Your call.</span></h1>
            <div className="mt-10 max-w-[310px] space-y-4 border-l border-[#F0443E]/50 pl-5">
              <p className="text-[12px] leading-relaxed text-[#C8C7C6]">A professional creator page, a guided brand assistant and a private place to review every proposal.</p>
              <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[.13em] text-[#83848B]"><ShieldCheck size={13} className="text-[#FF963F]"/> The creator stays in control</div>
            </div>
          </div>
          <div className="relative z-10 flex justify-between text-[9px] font-mono uppercase tracking-[.15em] text-[#5F6066]"><span>VALLU / MEMBER ACCESS</span><span>01 — PRIVATE</span></div>
          <div className="absolute -bottom-28 -right-20 h-[330px] w-[330px] rounded-full border border-white/[0.08]"/><div className="absolute -bottom-16 -right-8 h-[230px] w-[230px] rounded-full border border-[#F0443E]/20"/>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <button onClick={() => onNavigate('home')} className="mb-10 inline-flex items-center gap-2 text-[10px] text-[#8D8E95] transition-colors hover:text-white"><ArrowLeft size={13}/> Back to VALLU</button>

          {recoveryMode ? <>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F0443E]/20 bg-[#F0443E]/[0.08] text-[#F0443E]"><KeyRound size={18}/></div>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-.05em]">Choose a new password.</h2>
            <p className="mt-2 max-w-[340px] text-[11px] leading-relaxed text-[#92939A]">Set a new password for your creator workspace.</p>
            <form onSubmit={handlePasswordUpdate} className="mt-8 space-y-4">
              <label className="block text-[10px] font-medium text-[#B8B8BC]">New password<input className="auth-field mt-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} autoComplete="new-password"/></label>
              <label className="block text-[10px] font-medium text-[#B8B8BC]">Confirm new password<input className="auth-field mt-2" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Enter it again" required minLength={8} autoComplete="new-password"/></label>
              {error && <div role="alert" className="rounded-xl border border-[#F0443E]/25 bg-[#F0443E]/[0.08] px-3.5 py-3 text-[10px] leading-relaxed text-[#FF9B95]">{error}</div>}
              <button disabled={loading} className="site-button site-button-primary w-full">{loading?<LoaderCircle size={15} className="animate-spin"/>:'Update password'} <ArrowRight size={14}/></button>
            </form>
          </> : forgotMode ? <>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F0443E]/20 bg-[#F0443E]/[0.08] text-[#F0443E]"><KeyRound size={18}/></div>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-.05em]">Reset your password.</h2>
            <p className="mt-2 max-w-[340px] text-[11px] leading-relaxed text-[#92939A]">We’ll send a secure reset link to the email associated with your account.</p>
            <form onSubmit={handleReset} className="mt-8 space-y-4">
              <label className="block text-[10px] font-medium text-[#B8B8BC]">Email address<input className="auth-field mt-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"/></label>
              <button disabled={loading} className="site-button site-button-primary w-full">{loading?<LoaderCircle size={15} className="animate-spin"/>:'Send reset link'} <ArrowRight size={14}/></button>
              <button type="button" onClick={()=>{setForgotMode(false);setError('');setNotice('');}} className="w-full py-2 text-[10px] text-[#898A90] hover:text-white">Back to sign in</button>
            </form>
          </> : <>
            <div className="site-eyebrow">Creator workspace access</div>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,2.8rem)] font-semibold tracking-[-.065em]">{mode==='signup'?'Start with your link.':'Welcome back.'}</h2>
            <p className="mt-2 max-w-[360px] text-[11px] leading-relaxed text-[#92939A]">{mode==='signup'?'Create your account. Your page and workspace come next.':'Sign in to manage your page, enquiries and deals.'}</p>

            <div className="auth-switch mt-8">
              <span className={`auth-switch-indicator ${mode==='login'?'is-login':''}`}/>
              <button type="button" onClick={()=>switchMode('signup')} className={`relative z-10 rounded-full py-2.5 text-[11px] font-semibold transition-colors ${mode==='signup'?'text-white':'text-[#85868C]'}`}>Create account</button>
              <button type="button" onClick={()=>switchMode('login')} className={`relative z-10 rounded-full py-2.5 text-[11px] font-semibold transition-colors ${mode==='login'?'text-white':'text-[#85868C]'}`}>Log in</button>
            </div>

            <form key={mode} onSubmit={handleSubmit} className="mt-7 space-y-4">
              {mode==='signup' && <>
                <label className="block text-[10px] font-medium text-[#B8B8BC]">Your name<input className="auth-field mt-2" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="How should we call you?" required autoComplete="name"/></label>
                <label className="block text-[10px] font-medium text-[#B8B8BC]">Your creator link<div className="mt-2 flex items-center rounded-xl border border-[#36373D] bg-[#0D0E11] focus-within:border-[#F0443E]/80"><span className="pl-3.5 text-[11px] text-[#777980]">/c/</span><input className="min-w-0 flex-1 bg-transparent px-2 py-[13px] text-[13px] text-white outline-none" value={handle} onChange={e=>setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,''))} placeholder="yourname" required minLength={3} maxLength={30} autoComplete="username"/></div><span className="mt-1.5 block text-[9px] text-[#6F7076]">3–30 characters · letters, numbers, - and _</span></label>
              </>}
              <label className="block text-[10px] font-medium text-[#B8B8BC]">Email address<input className="auth-field mt-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"/></label>
              <label className="block text-[10px] font-medium text-[#B8B8BC]">Password<div className="relative mt-2"><input className="auth-field pr-12" type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} autoComplete={mode==='signup'?'new-password':'current-password'}/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?'Hide password':'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#797A81] hover:text-white">{showPassword?<EyeOff size={15}/>:<Eye size={15}/>}</button></div></label>
              {mode==='login' && <div className="flex justify-end"><button type="button" onClick={()=>{setForgotMode(true);setError('');setNotice('');}} className="text-[10px] text-[#FF963F] hover:text-white">Forgot password?</button></div>}
              {error && <div role="alert" className="rounded-xl border border-[#F0443E]/25 bg-[#F0443E]/[0.08] px-3.5 py-3 text-[10px] leading-relaxed text-[#FF9B95]">{error}</div>}
              {notice && <div role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-3 text-[10px] leading-relaxed text-emerald-200">{notice}</div>}
              <button type="submit" disabled={loading} className="site-button site-button-primary mt-2 w-full disabled:opacity-60">{loading?<><LoaderCircle size={15} className="animate-spin"/> Working…</>:<>{mode==='signup'?'Create account':'Log in'} <ArrowRight size={14}/></>}</button>
            </form>
            <p className="mt-6 text-center text-[9px] leading-relaxed text-[#73747A]">By continuing, you agree to our <button type="button" onClick={()=>onNavigate('legal')} className="text-[#B8B8BC] underline underline-offset-2">Terms</button> and <button type="button" onClick={()=>onNavigate('legal')} className="text-[#B8B8BC] underline underline-offset-2">Privacy Policy</button>.</p>
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-5 text-[9px] text-[#6F7076]"><ShieldCheck size={13} className="text-[#FF963F]"/> Your commercial rules remain private.</div>
          </>}
        </section>
      </div>
    </main>
  );
};
