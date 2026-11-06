import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ensureCreatorProfile } from '../lib/auth';

interface AuthViewProps {
  initialMode?: 'signup' | 'login';
  onNavigate: (route: PageRoute) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'signup', onNavigate }) => {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  const changeMode = (next: 'signup' | 'login') => {
    setMode(next);
    setErrorMessage('');
    setNotice('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setNotice('');

    if (!isSupabaseConfigured() || !supabase) {
      setErrorMessage('Account access is not connected yet. Add the Supabase project URL and publishable key to the app environment. Demo sign-in is intentionally disabled.');
      return;
    }

    if (mode === 'signup' && !/^[a-z0-9][a-z0-9_-]{2,29}$/.test(handle)) {
      setErrorMessage('Choose a link handle with 3–30 lowercase letters, numbers, hyphens or underscores.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Use a password with at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { handle, display_name: handle.replace(/[-_]/g, ' ') },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (error) throw error;

        if (!data.session || !data.user) {
          setNotice('Your account request is ready. Check your email and confirm your address, then log in to continue.');
          return;
        }

        const profile = await ensureCreatorProfile(data.user);
        onNavigate(profile.onboarding_completed ? 'dashboard' : 'onboarding');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
        if (!data.user) throw new Error('We could not confirm your account. Please try again.');

        const profile = await ensureCreatorProfile(data.user);
        onNavigate(profile.onboarding_completed ? 'dashboard' : 'onboarding');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-backdrop auth-backdrop-one" />
      <div className="auth-backdrop auth-backdrop-two" />
      <button className="auth-logo" onClick={() => onNavigate('home')} aria-label="Back to home">
        <span>✳</span> VALLU
      </button>

      <div className="auth-layout">
        <aside className="auth-story">
          <span className="auth-kicker"><i /> YOUR WORK. YOUR TERMS.</span>
          <h1>{mode === 'signup' ? <>Make room for<br /><em>better</em> brand deals.</> : <>Good to have<br />you <em>back.</em></>}</h1>
          <p>{mode === 'signup' ? 'A home for your work. A smarter start to every collaboration.' : 'Your page, your enquiries and every open decision—right where you left them.'}</p>
          <div className="auth-story-list">
            <div><span><ShieldCheck size={15} /></span><b>Your rates remain private</b></div>
            <div><span><Sparkles size={15} /></span><b>One clear place for enquiries</b></div>
            <div><span><LockKeyhole size={15} /></span><b>You always make the final call</b></div>
          </div>
          <div className="auth-story-foot">A MORE CONSIDERED WAY TO COLLABORATE <span>✳</span></div>
        </aside>

        <section className="auth-card">
          <div className="auth-card-top">
            <span className="auth-card-eyebrow">{mode === 'signup' ? 'GET STARTED' : 'YOUR WORKSPACE'}</span>
            <span className="auth-step-indicator"><i /> SECURE ACCESS</span>
          </div>
          <h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
          <p className="auth-intro">{mode === 'signup' ? 'Start with the essentials. Build your page after you sign up.' : 'Sign in to continue to your creator workspace.'}</p>

          <div className="auth-switch" role="tablist" aria-label="Account type">
            <span className={`auth-switch-indicator ${mode === 'login' ? 'switch-login' : ''}`} />
            <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => changeMode('signup')}>Create account</button>
            <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => changeMode('login')}>Log in</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && <label>
              <span>PUBLIC LINK HANDLE</span>
              <div className="auth-input-wrap handle-input"><span className="handle-prefix">/c/</span><input value={handle} onChange={(event) => setHandle(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30))} placeholder="yourname" autoComplete="username" required minLength={3} maxLength={30} /></div>
              <small>3–30 characters · You can refine your page after signup.</small>
            </label>}
            <label>
              <span>EMAIL ADDRESS</span>
              <div className="auth-input-wrap"><Mail size={15} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></div>
            </label>
            <label>
              <span>PASSWORD</span>
              <div className="auth-input-wrap"><LockKeyhole size={15} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div>
            </label>

            {mode === 'login' && <button type="button" className="auth-forgot" onClick={() => onNavigate('forgot-password')}>Forgot password?</button>}
            {errorMessage && <div className="auth-feedback auth-error" role="alert">{errorMessage}</div>}
            {notice && <div className="auth-feedback auth-notice" role="status">{notice}</div>}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? <><span className="auth-spinner" /> {mode === 'signup' ? 'Creating account…' : 'Signing in…'}</> : <>{mode === 'signup' ? 'Create account' : 'Log in'} <ArrowUpRight size={16} /></>}
            </button>
          </form>
          <div className="auth-legal"><ShieldCheck size={13} /> Your private creator data is protected by account-level access controls.</div>
          <div className="auth-bottom">{mode === 'signup' ? 'Already have an account?' : 'New to VALLU?'} <button onClick={() => changeMode(mode === 'signup' ? 'login' : 'signup')}>{mode === 'signup' ? 'Log in' : 'Create an account'}</button></div>
        </section>
      </div>
    </div>
  );
};
