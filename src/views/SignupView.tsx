import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ArrowRight, CheckCircle2, Lock, User, AtSign, DollarSign, Sparkles, AlertCircle } from 'lucide-react';
import { valluApi } from '../lib/supabase';

interface SignupViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [handle, setHandle] = useState('alexcreates');
  const [name, setName] = useState('Alex Rivers');
  const [email, setEmail] = useState('alex@rivers.media');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('Tech & Gaming');
  const [targetRate, setTargetRate] = useState('3500');
  const [floorRate, setFloorRate] = useState('2000');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      setIsSubmitting(true);
      try {
        const { user, error } = await valluApi.signUpWithEmail(email, password || 'password123', {
          handle,
          display_name: name,
        });
        if (error) {
          setErrorMessage(error.message);
          setIsSubmitting(false);
          return;
        }

        // Save creator settings
        if (user) {
          await valluApi.updateCreatorSettings({
            creator_id: user.id,
            starting_rate_usd: Number(targetRate) || 3500,
            floor_rate_usd: Number(floorRate) || 2000,
            counter_limit: 2,
            auto_decline_days: 14,
            excluded_categories: ['Crypto / Casinos', 'Fast Fashion'],
          });
        }

        setIsSubmitting(false);
        setIsCompleted(true);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1200);
      } catch (err: any) {
        setErrorMessage(err.message || 'Signup failed.');
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await valluApi.signInWithGoogle();
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setIsCompleted(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-[0_24px_60px_-12px_rgba(9,13,22,0.95)] backdrop-blur-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11D48]/15 rounded-full blur-[90px] pointer-events-none" />

        {/* Wizard Progress Indicator */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-[#1E293B]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E11D48]">
              2–4 MINUTE CREATOR ONBOARDING
            </span>
            <h2 className="font-display font-bold text-base sm:text-lg text-[#F1F5F9]">
              {step === 1 && '1. Claim Your Bio Handle'}
              {step === 2 && '2. Audience & Category'}
              {step === 3 && '3. Rate Boundaries & Floor'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8]">
            <span className="text-[#F1F5F9] font-bold">{step}</span>
            <span>/</span>
            <span>3</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center gap-2 text-xs text-[#F1F5F9]">
            <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isCompleted ? (
          <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-display font-bold text-xl text-[#F1F5F9]">Your VALLU Page is Ready!</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
              Your public link <span className="text-[#E11D48] font-mono font-bold">vallu.bio/@{handle}</span> has been reserved and your brand inquiry bot is configured.
            </p>
            <p className="text-[11px] text-[#94A3B8]/60">Redirecting to your new dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleNext} className="space-y-4">
            {step === 1 && (
              <div className="space-y-3.5">
                {/* Google Sign Up quick option */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#E11D48]/50 text-xs font-semibold text-[#F1F5F9] flex items-center justify-center gap-2.5 transition-all"
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
                  <span>Quick Sign Up with Google</span>
                </button>

                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 h-px bg-[#1E293B]" />
                  <span className="text-[10px] text-[#94A3B8] font-mono uppercase">or customize handle</span>
                  <div className="flex-1 h-px bg-[#1E293B]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                    Your Public Handle *
                  </label>
                  <div className="flex items-center bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs">
                    <span className="text-[#94A3B8]/60 font-mono">vallu.bio/@</span>
                    <input
                      type="text"
                      required
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className="w-full bg-transparent text-[#F1F5F9] font-mono focus:outline-none ml-0.5"
                    />
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Available ✓
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Full Creator Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Account Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Content Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="Tech & Gaming">Tech & Gaming</option>
                    <option value="Cinematography & Gear">Cinematography & Gear</option>
                    <option value="Fitness & Health">Fitness & Health</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Design & Code">Design & Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Primary Platforms</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['YouTube (40K+)', 'Instagram (85K+)', 'TikTok (120K+)', 'X / Twitter (25K+)'].map((plat, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#090D16] border border-[#1E293B] text-[#94A3B8]">
                        <input type="checkbox" defaultChecked className="accent-[#E11D48]" />
                        <span>{plat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                    Target Rate (Preferred starting price)
                  </label>
                  <div className="relative">
                    <span className="text-[#94A3B8]/60 absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs">$</span>
                    <input
                      type="number"
                      required
                      value={targetRate}
                      onChange={(e) => setTargetRate(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-[#F1F5F9] font-mono focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#94A3B8] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#E11D48]" />
                      <span>Confidential Floor Rate (Private Minimum)</span>
                    </label>
                    <span className="text-[10px] text-[#E11D48] font-mono">NEVER REVEALED</span>
                  </div>
                  <div className="relative">
                    <span className="text-[#94A3B8]/60 absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs">$</span>
                    <input
                      type="number"
                      required
                      value={floorRate}
                      onChange={(e) => setFloorRate(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#E11D48]/40 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-[#F1F5F9] font-mono focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <p className="text-[11px] text-[#94A3B8]/60 mt-1 leading-normal">
                    The bot will never counter below this amount and will never volunteer this number to sponsors.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="px-4 py-2 rounded-full bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-xs text-[#94A3B8]"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs text-[#94A3B8] hover:text-[#F1F5F9]"
                >
                  Already have an account?
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold text-xs transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4)] flex items-center gap-1.5 ml-auto active:scale-95 uppercase tracking-wider"
              >
                <span>{step === 3 ? 'Deploy My VALLU Page' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
