import { CreatorProfile, DealScenario, Testimonial } from '../types';

export const DEFAULT_CREATOR: CreatorProfile = {
  name: 'Marcus Vance',
  handle: 'marcusvance',
  bio: 'Visual director & tech storytelling. Sharing cinematic workflows, industrial design, and developer gear.',
  category: 'Tech & Filmmaking',
  avatarUrl: '/src/assets/images/creator_hero_portrait_1793816957109.jpg',
  followersCount: '480K',
  platforms: ['YouTube', 'Instagram', 'TikTok', 'X'],
  targetRate: 4000,
  minimumFloor: 2500, // Strictly private to creator, never shown to brand
  currency: 'USD',
  currencySymbol: '$',
};

export const SAMPLE_DEAL_SCENARIOS: DealScenario[] = [
  {
    id: 'nike_deal',
    brandName: 'Nike Running',
    brandCategory: 'Sportswear & Footwear',
    initialBudget: 3800,
    currency: 'USD',
    deliverables: '1x Dedicated YouTube Video + 1x Instagram Reel',
    timeline: '3 weeks from contract',
    usageRights: '60 days digital organic rights',
    exclusivity: '30 days running footwear category only',
    whitelisting: false,
    paymentWindow: '50% advance, 50% upon delivery (Net 14)',
    transcript: [
      { sender: 'bot', message: "Hi, I'm Marcus's bot. Thanks for reaching out! Which brand are you representing today?" },
      { sender: 'brand', message: "Hey! Reaching out from Nike Running global campaigns." },
      { sender: 'bot', message: "Great to connect with Nike! What collaboration format and timeline do you have in mind?" },
      { sender: 'brand', message: "We want a dedicated YouTube review of the Pegasus 42 plus a cross-posted Instagram Reel within 3 weeks." },
      { sender: 'bot', message: "Understood. What available budget has Nike allocated for this partnership?" },
      { sender: 'brand', message: "Our current approved campaign budget is $3,800." },
      { sender: 'bot', message: "Marcus's standard rate for dedicated YouTube plus Reel is $4,500. Could Nike meet at $4,200 for the full package?" },
      { sender: 'brand', message: "We can approve $4,200 with standard 60-day digital usage and 50% upfront deposit." },
      { sender: 'bot', message: "Deal terms noted! I've packaged this verified offer with all rights and payment milestones directly into Marcus's dashboard for final approval." }
    ],
    finalOffer: 4200,
    scores: {
      rate: 9.2,    // 40% weight -> 3.68
      terms: 9.0,   // 20% weight -> 1.80
      trust: 9.5,   // 15% weight -> 1.42
      fit: 9.0,     // 15% weight -> 1.35
      payment: 9.5  // 10% weight -> 0.95
    },
    totalScore: 9.2,
    status: 'visible',
    redFlags: [],
    recommendation: 'Exceptional Tier-1 match. Strong compensation, 50% advance deposit, and strictly capped 60-day usage.'
  },
  {
    id: 'audio_deal',
    brandName: 'Aether Audio',
    brandCategory: 'Consumer Tech',
    initialBudget: 2200,
    currency: 'USD',
    deliverables: '1x Integrated 60s YouTube Sponsorship',
    timeline: '4 weeks',
    usageRights: '6 months paid ads usage',
    exclusivity: 'None',
    whitelisting: true,
    paymentWindow: 'Net 30 days post-publish',
    transcript: [
      { sender: 'bot', message: "Hi, I'm Marcus's bot. What brand are you reaching out on behalf of?" },
      { sender: 'brand', message: "Hello! We are Aether Audio, makers of planar magnetic studio headphones." },
      { sender: 'bot', message: "Nice to meet you! What deliverables are you looking to commission?" },
      { sender: 'brand', message: "A 60s integration in an upcoming video, plus 6 months paid whitelisting on Meta." },
      { sender: 'bot', message: "What budget is allocated for this integration?" },
      { sender: 'brand', message: "We have $2,200 total." },
      { sender: 'bot', message: "Paid whitelisting carries additional amplification value. For an integration with paid amplification, Marcus requires $2,800." },
      { sender: 'brand', message: "We can stretch to $2,600 maximum." },
      { sender: 'bot', message: "Offer recorded at $2,600 with whitelisting disclosure. Marcus will review the agreement." }
    ],
    finalOffer: 2600,
    scores: {
      rate: 7.5,
      terms: 6.8,
      trust: 7.0,
      fit: 8.5,
      payment: 6.5
    },
    totalScore: 7.3,
    status: 'visible',
    redFlags: ['6 Months Paid Whitelisting requested', 'Net 30 payment window'],
    recommendation: 'Workable offer above minimum floor ($2,500). Verify ad spend cap on the Meta whitelisting clause before signing.'
  },
  {
    id: 'shady_barter_deal',
    brandName: 'Kronos Watches',
    brandCategory: 'Accessories',
    initialBudget: 350,
    currency: 'USD',
    deliverables: '3x Instagram Reels + Perpetual Rights',
    timeline: '10 days',
    usageRights: 'In perpetuity, worldwide, all media',
    exclusivity: '6 months luxury timepiece exclusivity',
    whitelisting: true,
    paymentWindow: 'Product gift ($180 value) + $350 post review',
    transcript: [
      { sender: 'bot', message: "Hi, I'm Marcus's bot. Which brand are you contacting from?" },
      { sender: 'brand', message: "Kronos Luxury Horology." },
      { sender: 'bot', message: "What collaboration format and budget are you offering?" },
      { sender: 'brand', message: "We'll send you our $180 titanium watch plus $350 cash for 3 reels, full rights in perpetuity, and 6 months exclusivity." },
      { sender: 'bot', message: "Marcus does not accept barter-dominated compensation, perpetual usage rights, or below-floor compensation ($350 is far below minimum). Can Kronos revise to cash compensation without perpetual rights?" },
      { sender: 'brand', message: "No, our terms are fixed for all influencers." },
      { sender: 'bot', message: "Under Marcus's collaboration policy, this inquiry cannot proceed. Thank you for your interest." }
    ],
    finalOffer: 350,
    scores: {
      rate: 1.5,
      terms: 1.2,
      trust: 4.0,
      fit: 3.0,
      payment: 2.0
    },
    totalScore: 2.1,
    status: 'hidden',
    redFlags: [
      'CRITICAL: Perpetuity rights demanded (Forever license)',
      'SEVERE: Compensation ($350) is 86% below creator private floor',
      'EXCESSIVE: 6-month full category exclusivity for $350',
      'UNFAIR: Barter package with delayed payment'
    ],
    recommendation: 'Filtered to Hidden Inbox. Predatory rights-grab detected. Auto-declining in 14 days without creator action required.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    creatorName: 'Elena Rostova',
    handle: '@elenacine',
    category: 'Cinematography & Gear',
    followers: '340K',
    quote: "Brands used to slide into my DMs with vague budgets and sneaked-in perpetuity clauses. VALLU's bot stopped all the lowball noise. Last month I closed three $6K deals without sending a single manual email.",
    metric: '+140% Deal Value',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '2',
    creatorName: 'Arjun Mehta',
    handle: '@arjunbuilds',
    category: 'Dev & Engineering',
    followers: '190K',
    quote: "The 5-factor scoring engine is gold. I can immediately see why a deal got an 8.8 vs a 3.2. Brands take the negotiation seriously because the assistant sets professional boundaries from message one.",
    metric: '9 Hours/Week Saved',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '3',
    creatorName: 'Sophia Lin',
    handle: '@sophialintech',
    category: 'AI & Productivity',
    followers: '520K',
    quote: "Having my bio link lead directly to a structured bot that negotiates within my floor rate changed my entire business. I have not lost an unread brand DM since switching.",
    metric: '0 Missed Opportunities',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  }
];

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
