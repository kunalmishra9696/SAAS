import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ArrowRight, Lock, Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { valluApi } from '../lib/supabase';

interface LoginViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoggingIn(true);

    try {
      const { user, error } = await valluApi.signInWithEmail(email, password);
      if (error) {
        setErrorMessage(error.message || 'Invalid email or password.');
        setIsLoggingIn(false);
        return;
      }
      setIsLoggingIn(false);
      setSuccess(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error occurred.');
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const { error } = await valluApi.signInWithGoogle();
      if (error) {
        setErrorMessage(error.message);
        setIsGoogleLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication error.');
      setIsGoogleLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('marcus@vallu.bio');
    setPassword('••••••••••••');
    setIsLoggingIn(true);
    await valluApi.signInWithEmail('marcus@vallu.bio', 'demopassword123');
    setIsLoggingIn(false);
    setSuccess(true);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 800);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-[0_24px_60px_-12px_rgba(9,13,22,0.95)] backdrop-blur-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E11D48]/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090D16] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
            <span>CREATOR PORTAL</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F1F5F9]">
            Welcome back to VALLU
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Sign in to access your deal inbox, rate floor settings, and public page analytics.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center gap-2 text-xs text-[#F1F5F9]">
            <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-[#F1F5F9] text-base">Authentication Successful</h3>
            <p className="text-xs text-[#94A3B8]">Opening your creator workspace...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google OAuth Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#E11D48]/50 text-xs font-semibold text-[#F1F5F9] flex items-center justify-center gap-2.5 transition-all active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.09 3.66-5.18 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.41 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.24C.45 8.14 0 9.92 0 12s.45 3.86 1.24 5.43l4.04-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.57l4.04 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google / Gmail'}</span>
            </button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-[#1E293B]" />
              <span className="text-[10px] text-[#94A3B8] font-mono uppercase">or email</span>
              <div className="flex-1 h-px bg-[#1E293B]" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Creator Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@creator.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-[#94A3B8]">Password</label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-[11px] text-[#E11D48] hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4)] flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95"
              >
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign in to Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Demo Login Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-xs text-[#F1F5F9] font-medium transition-all flex items-center justify-center gap-2"
                >
                  <span>⚡ Instant Demo Access (Marcus Vance)</span>
                </button>
              </div>

              <div className="text-center pt-4 border-t border-[#1E293B] text-xs text-[#94A3B8]">
                Don't have a VALLU link yet?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="text-[#E11D48] font-semibold hover:underline"
                >
                  Sign up free
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
