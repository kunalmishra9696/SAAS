import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, ArrowUpRight, CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ForgotPasswordViewProps { onNavigate: (route: PageRoute) => void; }

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mode, setMode] = useState<'request' | 'sent' | 'update' | 'done'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('update');
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session && window.location.hash.includes('type=recovery')) setMode('update');
    });
    return () => subscription.unsubscribe();
  }, []);

  const sendLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!supabase) { setError('Account recovery is not connected. Check the app’s Supabase environment settings.'); return; }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/forgot-password`,
      });
      if (resetError) throw resetError;
      setMode('sent');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The recovery email could not be sent.');
    } finally { setLoading(false); }
  };

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Use a password with at least 8 characters.'); return; }
    if (!supabase) { setError('Account recovery is not connected.'); return; }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setMode('done');
      await supabase.auth.signOut();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your password could not be updated.');
    } finally { setLoading(false); }
  };

  return <div className="auth-shell">
    <div className="auth-backdrop auth-backdrop-one" /><div className="auth-backdrop auth-backdrop-two" />
    <button className="auth-logo" onClick={() => onNavigate('home')}><span>✳</span> VALLU</button>
    <section className="recovery-card">
      <div className="recovery-icon"><KeyRound size={19} /></div>
      <span className="auth-card-eyebrow">ACCOUNT SECURITY</span>
      <h1>{mode === 'update' ? 'Choose a new password.' : mode === 'done' ? 'Password updated.' : 'Get back in.'}</h1>
      <p>{mode === 'request' ? 'Enter the email linked to your creator account. We’ll send a secure recovery link.' : mode === 'sent' ? 'Check your inbox for the password reset email. Open that link on this device to continue.' : mode === 'update' ? 'Choose a new password for your VALLU account.' : 'Your password has been updated. Sign in with your new password.'}</p>
      {mode === 'request' && <form onSubmit={sendLink} className="auth-form">
        <label><span>EMAIL ADDRESS</span><div className="auth-input-wrap"><Mail size={15} /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></div></label>
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Sending link…' : <>Send recovery link <ArrowUpRight size={15} /></>}</button>
      </form>}
      {mode === 'sent' && <div className="recovery-sent"><CheckCircle2 size={18} /><span>Recovery instructions requested for <b>{email}</b>.</span></div>}
      {mode === 'update' && <form onSubmit={updatePassword} className="auth-form">
        <label><span>NEW PASSWORD</span><div className="auth-input-wrap"><KeyRound size={15} /><input type="password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" /></div></label>
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Updating…' : <>Update password <ArrowUpRight size={15} /></>}</button>
      </form>}
      {mode === 'done' && <div className="recovery-sent"><ShieldCheck size={18} /><span>Your credentials are updated. Your private workspace still requires sign in.</span></div>}
      {error && <div className="auth-feedback auth-error" role="alert">{error}</div>}
      <button className="recovery-back" onClick={() => onNavigate('login')}><ArrowLeft size={13} /> Back to log in</button>
    </section>
  </div>;
};
