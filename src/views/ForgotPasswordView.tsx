import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Mail, ArrowRight, CheckCircle2, Lock, KeyRound } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isDone, setIsDone] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSent(true);
  };

  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setIsDone(true);
    setTimeout(() => {
      onNavigate('login');
    }, 1500);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-[#131926] border border-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-[0_24px_60px_-12px_rgba(9,13,22,0.95)] backdrop-blur-xl relative overflow-hidden">
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#090D16] border border-[#E11D48]/30 text-[#E11D48] mx-auto flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[#F1F5F9]">Reset Password</h1>
          <p className="text-xs text-[#94A3B8]">
            Recover your VALLU creator credentials and restore access to your deal inbox.
          </p>
        </div>

        {isDone ? (
          <div className="text-center py-6 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-[#F1F5F9] text-base">Password Updated</h3>
            <p className="text-xs text-[#94A3B8]">Redirecting to login with your new credentials...</p>
          </div>
        ) : isResetting ? (
          <form onSubmit={handleCompleteReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold text-xs shadow-md transition-all uppercase tracking-wider active:scale-95"
            >
              Save New Password
            </button>
          </form>
        ) : isSent ? (
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 rounded-xl bg-[#090D16] border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
              We have dispatched a secure recovery link to <strong className="text-white font-mono">{email}</strong>.
            </div>

            <p className="text-[11px] text-[#94A3B8]">
              For testing and demonstration, you can bypass email dispatch and simulate opening the recovery link directly:
            </p>

            <button
              type="button"
              onClick={() => setIsResetting(true)}
              className="w-full py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-[#F1F5F9] text-xs font-medium transition-colors"
            >
              ⚡ Simulate Opening Reset Email Link
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs text-[#94A3B8] hover:text-white"
              >
                ← Return to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Creator Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="marcus@channel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold text-xs transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4)] flex items-center justify-center gap-1.5 uppercase tracking-wider active:scale-95"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-4 border-t border-[#1E293B] text-xs text-[#94A3B8]">
              Remembered your credentials?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-[#E11D48] font-semibold hover:underline"
              >
                Back to Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
