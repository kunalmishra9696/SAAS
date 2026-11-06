import type { Testimonial } from '../types';

export const FAQ_ITEMS = [
  {
    category: 'The Brand Bot',
    question: 'How does the VALLU brand assistant negotiate?',
    answer: "VALLU uses a hybrid conversation engine. The bot begins with a hardcoded, structured flow asking for the brand's budget, deliverables, timeline, usage rights, and payment terms. If a brand gives unexpected phrasing, our AI helper parses the candidate values safely. The bot uses at most 2 counter-offers toward your preferred rate and never accepts a deal automatically."
  },
  {
    category: 'The Brand Bot',
    question: 'Can the bot ever reveal my private minimum floor rate?',
    answer: 'Never. Your minimum rate is strictly confidential and kept server-side. The assistant will never disclose it to a brand, nor volunteer lower figures if the brand already proposes a generous budget.'
  },
  {
    category: 'Deal Scoring',
    question: 'How is the 0–10 Deal Score calculated?',
    answer: 'Every completed inquiry is scored on a transparent 5-factor weighted scale: Rate Attractiveness (40%), Terms Risk including perpetuity and exclusivity (20%), Brand Trust (15%), Requirements Fit (15%), and Payment Milestones (10%). Offers scoring 5.0+ enter your Visible inbox; sub-5.0 offers go to Hidden.'
  },
  {
    category: 'Payments & Money',
    question: 'Does VALLU hold creator funds or take a percentage cut?',
    answer: 'No. VALLU is NOT an escrow service and takes 0% commission on your deals in V1. You provide direct payment instructions (such as Stripe, bank wire, or PayPal) on the accepted deal page, and the brand pays you directly.'
  },
  {
    category: 'Brand Experience',
    question: 'Does a brand need an account or login to enquire?',
    answer: 'No! Brands simply click the link in your bio, chat with your branded inquiry bot, specify their requirements, and receive a clear response. Zero friction for sponsors.'
  },
  {
    category: 'Data & Expiry',
    question: 'What happens to deals after 14 days?',
    answer: 'Every offer has a strict 14-day validity countdown. If you do not accept the deal within 14 days, it automatically auto-declines with a polite notification to the brand, keeping your inbox clean of stale proposals.'
  }
];
