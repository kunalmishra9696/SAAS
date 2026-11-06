import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ArrowRight, HelpCircle, Eye, EyeOff, ShieldCheck, Check, Sparkles } from 'lucide-react';

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
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    // Smooth simulated transition into onboarding
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('onboarding');
    }, 450);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 min-h-[85vh] flex items-center justify-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E11D48]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container in Deep Slate #131926 with #1E293B Border */}
        <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(9,13,22,0.95)]">
          {/* Header Branding & Subtitle */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090D16] border border-[#1E293B] text-xs font-mono text-[#94A3B8] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
              <span>VALLU CREATOR ACCESS</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#F1F5F9] uppercase tracking-tight">
              {mode === 'signup' ? 'Claim Your Bio Link' : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-xs mx-auto">
              {mode === 'signup'
                ? 'Join autonomous creators filtering brand deals with zero commission.'
                : 'Access your private deal inbox, rate shields, and live bio link.'}
            </p>
          </div>

          {/* Smooth Toggle Switch: [ Sign Up | Log In ] */}
          <div className="p-1 bg-[#090D16] border border-[#1E293B] rounded-2xl flex items-center mb-6 relative">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-[#E11D48] text-white shadow-[0_2px_12px_rgba(225,29,72,0.4)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <span>Sign Up</span>
              {mode === 'signup' && <Sparkles className="w-3 h-3 text-rose-200" />}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-[#E11D48] text-white shadow-[0_2px_12px_rgba(225,29,72,0.4)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <span>Log In</span>
              {mode === 'login' && <Check className="w-3 h-3 text-white" />}
            </button>
          </div>

          {/* Form Content with Smooth Transitions */}
          <form onSubmit={handleContinue} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1 animate-in fade-in duration-300">
                <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
                  Reserve Bio Link
                </label>
                <div className="flex items-center bg-[#090D16] border border-[#1E293B] rounded-xl px-3 py-2.5 focus-within:border-[#E11D48] transition-colors">
                  <span className="text-xs font-mono text-[#94A3B8] select-none">vallu.bio/@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="yourhandle"
                    required={mode === 'signup'}
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-600 focus:outline-none px-1 font-mono"
                  />
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/60">
                    Free
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@example.com"
                required
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bottom Row as specified: Question button on left, Continue on right */}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#1E293B]/70 mt-6">
              {/* Question button on left (Forgot Password) */}
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="w-10 h-10 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#E11D48]/50 hover:bg-[#1E293B]/60 text-[#94A3B8] hover:text-white flex items-center justify-center transition-all group"
                title="Forgot password?"
                aria-label="Forgot password?"
              >
                <HelpCircle className="w-4 h-4 text-[#94A3B8] group-hover:text-[#E11D48] transition-colors" />
              </button>

              {/* Continue button on right */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4)] hover:shadow-[0_4px_22px_rgba(225,29,72,0.6)] active:scale-98 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account & Continue' : 'Continue to Onboarding'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Value Micro-Pill */}
          <div className="mt-6 pt-4 border-t border-[#1E293B]/60 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>0% Commission · 100% Floor Privacy Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center text-[#E11D48] mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Reset Your Password</h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Enter your account email and we'll send a secure password reset link.
            </p>

            {forgotSent ? (
              <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2 mb-4">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Reset link transmitted to your inbox!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="creator@example.com"
                  required
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#1E293B] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#E11D48] hover:bg-rose-600 rounded-xl transition-colors shadow-md"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
