import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface ContactViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'creator' | 'brand' | 'support' | 'press'>('creator');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-28 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
          <span>CONTACT & SUPPORT</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F1F5F9] tracking-tight">
          Get in touch with <span className="text-[#E11D48]">Team VALLU</span>.
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          Questions about our creator beta, brand inquiry bots, or enterprise integration? We typically respond within 12 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-[#131926] border border-[#1E293B] rounded-3xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(9,13,22,0.9)]">
          {isSubmitted ? (
            <div className="text-center py-10 sm:py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#F1F5F9]">Message Received!</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{name}</strong>. A VALLU creator specialist has received your inquiry and will reply to <span className="text-[#E11D48] font-mono">{email}</span> shortly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                  setSubject('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-xs text-[#F1F5F9] transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector chips */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2">I am reaching out as:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'creator', label: 'Creator' },
                    { id: 'brand', label: 'Brand' },
                    { id: 'support', label: 'Beta Help' },
                    { id: 'press', label: 'Partnership' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCategory(t.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                        category === t.id
                          ? 'bg-[#E11D48] text-white font-semibold'
                          : 'bg-[#090D16] text-[#94A3B8] border border-[#1E293B] hover:text-[#F1F5F9]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@channel.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Question about creator custom branding or deal terms"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you need help with..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#E11D48] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold text-xs transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4)] flex items-center justify-center gap-1.5 uppercase tracking-wider active:scale-95"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#131926] border border-[#1E293B] rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_15px_35px_rgba(9,13,22,0.8)]">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#F1F5F9]">Direct Channels</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#94A3B8]">Creator Relations</div>
                  <a href="mailto:creators@vallu.bio" className="text-[#F1F5F9] hover:text-[#E11D48] font-mono">
                    creators@vallu.bio
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#94A3B8]">Brand Partnerships</div>
                  <a href="mailto:brands@vallu.bio" className="text-[#F1F5F9] hover:text-[#E11D48] font-mono">
                    brands@vallu.bio
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#94A3B8]">Security & Disclosures</div>
                  <span className="text-[#F1F5F9] font-mono">security@vallu.bio</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#131926] border border-[#1E293B] space-y-2">
            <h4 className="text-xs font-semibold text-[#F1F5F9]">Quick Help</h4>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              Looking for answers on negotiation limits, 14-day auto-decline, or private floor rates?
            </p>
            <button
              onClick={() => onNavigate('faq')}
              className="text-xs font-medium text-[#E11D48] hover:underline"
            >
              Browse Knowledge Base FAQ →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
