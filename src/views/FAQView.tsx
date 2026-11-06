import React, { useState } from 'react';
import { PageRoute } from '../types';
import { FAQ_ITEMS } from '../data/mockData';
import { Search, ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const categories = ['All', 'The Brand Bot', 'Deal Scoring', 'Payments & Money', 'Brand Experience', 'Data & Expiry'];

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleIndex = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-28 max-w-4xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/25 text-xs font-semibold text-[#E11D48] font-mono">
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-6xl text-[#F1F5F9] tracking-tight uppercase leading-[1.05]">
          KNOWLEDGE BASE & FAQ
        </h1>
        <p className="text-xs sm:text-base text-[#94A3B8]">
          Everything you need to know about our assistant, encrypted rate floors, and zero-commission policy.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. negotiation, payment, floor rate)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090D16] border border-[#1E293B] rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#E11D48] transition-colors shadow-inner"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#E11D48] text-white font-semibold shadow-sm'
                  : 'bg-[#131926] text-[#94A3B8] border border-[#1E293B] hover:text-[#F1F5F9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredItems.map((item, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'bg-[#131926] border-[#E11D48]/50 shadow-[0_4px_20px_rgba(225,29,72,0.15)]'
                  : 'bg-[#131926] border-[#1E293B] hover:border-[#E11D48]/30'
              }`}
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#090D16]/30 transition-colors"
              >
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#E11D48] uppercase tracking-wider block mb-0.5 sm:mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-display font-bold text-xs sm:text-base text-[#F1F5F9]">
                    {item.question}
                  </h3>
                </div>
                <div className="shrink-0 p-1.5 rounded-full bg-[#090D16] border border-[#1E293B] text-[#94A3B8]">
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#F1F5F9]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-[#1E293B] pt-3 sm:pt-4 animate-in fade-in duration-200">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-[#94A3B8] text-sm font-mono">
            No questions found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* Bottom Still Have Questions CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#131926] border border-[#1E293B] text-center space-y-3 sm:space-y-4">
        <h4 className="font-display font-bold text-base sm:text-lg text-[#F1F5F9]">Still have questions?</h4>
        <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
          Our creator relations team is ready to assist with enterprise brand deals and custom agency setups.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 sm:py-3 rounded-full bg-[#090D16] hover:bg-[#1E293B] border border-[#1E293B] text-[#F1F5F9] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
        >
          <span>Contact Team VALLU</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
