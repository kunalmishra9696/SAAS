# Creator Collaboration SaaS — V1 Master Context & Build Plan

**Document purpose:** This is the single source of truth for the product idea, founder constraints, V1 scope, technical direction, AI behaviour, design direction, build sequence, and decisions that future AI assistants and Dyad sessions must follow.

**Last updated:** 2 November 2026  
**Product name:** Not decided. Do not assume “Cove” is available or use it as the final brand.  
**Status:** Planning baseline — use this document as context before proposing changes or building features.

---

# 1. Read this first: founder and project context

## 1.1 Founder situation

- The founder is a complete beginner: no coding experience and no technical knowledge.
- The founder has practically **zero budget**. Prefer free plans, free tools and low-cost choices. Never assume the founder can pay for a service, API or developer.
- The founder will build the product using **Dyad**, an AI app builder that runs on the founder's computer and produces normal application code.
- The chosen services are:
  - **Dyad:** application builder.
  - **Supabase:** database, authentication, server-side functions and data security.
  - **Cloudflare:** website hosting, deployment, security and preferably AI inference.
  - **GitHub:** code backup and version history.
  - **Transactional email provider:** likely Resend, to be checked and configured before real brand emails are sent.
- The founder wants the assistant to act as the product planner, technical decision-maker, reviewer, risk-checker and prompt writer. Do not make the founder choose between technical options unless their preference genuinely changes the product.
- Explain technical work in plain language. Give the founder exact buttons/steps when a manual action is required. Do not assume the founder can edit code or understand database terminology.
- The founder wants to start building promptly, but does not want rushed, unreliable work.
- Work one stage at a time. Do not ask Dyad to build the whole SaaS in one enormous prompt.
- Test each stage, fix it, verify it, then back it up to GitHub before moving forward.

## 1.2 What the founder cares about most

1. A genuinely premium, professionally designed marketing website.
2. A beautiful, useful and personalised creator landing page. It must not look like a generic AI template.
3. A public creator link that a creator can put in their social-media bio.
4. A brand inquiry bot that can understand ordinary human messages, gather deal information and negotiate in the creator's favour.
5. Transparent offer management: the creator can inspect the full conversation and decide what to do.
6. Reliability, data privacy, simple editing and mobile usability.
7. Keeping the running costs as close to zero as possible during development and early beta.

## 1.3 Product audience

Primary users: content creators, initially focusing on creators with roughly 10,000+ followers on at least one social platform, particularly those who already receive collaboration or sponsorship enquiries.

The first version is not designed for general freelancers, artists, agencies or every kind of professional. Those audiences can be considered later.

## 1.4 Working rules for future AI assistants

- Read this document before giving advice or changing the product plan.
- Treat the “V1 includes” and “V1 excludes” sections as the scope boundary.
- Do not silently remove features the founder approved.
- Do not add features merely because they sound impressive.
- Explain trade-offs and make a recommendation; do not bury the founder in technical choices.
- Never claim a feature works until it has been tested.
- Never expose private API keys in browser code, screenshots, chat prompts, GitHub or public files.
- Never invent creator statistics, achievements, brand reviews, prices or deal terms.
- The creator makes the final decision on every deal.
- Preserve the core product idea: **one public creator page + one intelligent inquiry assistant that screens and negotiates brand deals.**

---

# 2. Product definition

## 2.1 One-sentence description

A SaaS for content creators that creates a professional, personalised public landing page and embeds a semi-AI brand assistant that collects collaboration details, negotiates within creator-defined rules, scores offers and sends manageable deals to the creator.

## 2.2 The problem

Creators can receive brand offers that are poorly paid, unclear, unsuitable or burdened with difficult terms. Every brand conversation takes time. Important details get lost in DMs, and creators may not know how to judge usage rights, exclusivity, payment timing or content requirements.

## 2.3 The product's central promise

A creator shares one professional link. A brand visits the page, speaks to the creator's inquiry assistant, provides the collaboration details and receives a structured response. The assistant negotiates within limits set by the creator. The creator receives a ranked offer with the full transcript and makes the final decision.

## 2.4 The two sides of the product

**Creator side:** sign up → complete a short onboarding wizard → receive a personalised landing page → edit/publish/share it → see analytics → manage incoming offers → accept, decline or hold → manage accepted deals.

**Brand side:** open a creator's public page → select “Work with me” → chat with the assistant → provide collaboration details → negotiate within rules → receive a clear outcome.

The brand should not have to create an account just to enquire. This is an intentional exception to the creator login requirement.

---

# 3. Access and login rules

The founder's requirement is that private creator tools must not be available to logged-out visitors.

## 3.1 Public without login

- Marketing website and public information pages.
- Published creator landing pages.
- The inquiry assistant embedded in a published creator page.
- The brand's ability to submit a collaboration enquiry.

These must be public because brands need to open the link and contact the creator without friction.

## 3.2 Login required

- Creator onboarding and saved profile management.
- Creator editor and publishing controls.
- Private dashboard and analytics.
- Offer inbox (Visible, Hidden, Unfinished and On Hold).
- Full creator-side offer management and accept/decline actions.
- Deal manager and creator settings.

A logged-out creator who opens a private route should be sent to login, then returned to the intended page after successful login.

**Important:** Email notifications should link to a login-protected offer page. Do not implement unauthenticated, one-click accept/decline in the first release because it conflicts with the founder's login/access rule. Secure email action links can be reconsidered later.

---

# 4. V1 — exactly what we are making

V1 should be a coherent, usable product for a small private beta. It is not a 40-feature platform. Build the complete central user journey before adding secondary tools.

## 4.1 Premium marketing website

Public pages:

- Home page with clear explanation and a visual demonstration of the product.
- How it works.
- For creators.
- Pricing information (prices can be shown as planned/indicative until billing is active).
- FAQ.
- About.
- Contact/support route.
- Privacy policy, Terms of Service and cookie/privacy information as appropriate.
- Designed not-found page.
- Login and signup screens.

### Design direction

The three strongest visual references selected by the founder are:

1. **augen.pro** — primary reference for structure, layout, visual hierarchy and animation; adapt it into the product's dark visual identity. Do not copy its site.
2. **mystack.com** — reference for layout feel and personality; keep the personality professional.
3. **x.ai** — reference for dark visual confidence and polished motion.

Other references in the original notes include gumloop.com, reflect.app, linear.app, halaska.com, replay.ai, noth.in, runlayer.com and sitesplaced.com. Use them only as secondary references; do not blend every site into one design.

### Visual system

Use the existing design brief as the starting point:

- Default background: `#0F1012`.
- Main cards/surfaces: `#17181B`.
- Borders: `#26272B`, generally 1px.
- Main text: `#F5F5F5`.
- Secondary text: `#9A9A9E`.
- Accent blue: `#0071E3`, used sparingly for links and small highlights.
- Success: `#10B981`.
- Danger: `#EF4444`.
- Light theme option: background `#EFEFEF`, text `#0F1012`, white surfaces, same accent blue.
- Font direction: Inter, weights 400/500/600.
- Typography scale: 12, 14, 16, 18, 24, 32, 48 and 64px.
- Content max-width around 1120px.
- Cards: about 8px radius; buttons: about 6px radius.
- No heavy shadows. Use clean borders, spacing and typography to create depth.

### Animation requirements

The founder explicitly wants a dynamic, animated site. Do not interpret “fast” as “no animation”. Use animation deliberately:

- Animated hero that demonstrates the product: a brand chat appears, an offer is generated, its score resolves and its status is shown.
- Smooth scroll-based section reveals.
- Fade-in/fade-out transitions.
- Carefully animated counters, score bars, badges and cards.
- Subtle hover states and button feedback.
- A branded initial loading experience and skeleton loaders for genuine loading states.
- Premium mobile interactions, not desktop-only effects.
- Motion should be authored and consistent. Avoid heavy background video, excessive parallax, endless movement and effects that make the site feel slow or cheap.
- Target a fast usable page. A skeleton should appear immediately when data is loading; do not intentionally hold a page for several seconds just to show an animation.
- Respect reduced-motion accessibility settings.

## 4.2 Creator accounts and authentication

- Creator signup, login and logout.
- Password reset.
- Persistent sessions.
- Private routes guarded by login.
- Creator data isolated from other creators.
- Account deletion and a basic data export route.
- Supabase Row Level Security (RLS) must be enabled and tested on all private creator data.

## 4.3 Creator onboarding wizard

Goal: complete in approximately **2–4 minutes**. This is not a 50-question interview.

Use roughly 7–9 short, one-question-at-a-time screens. Optional questions can be skipped. Save progress so a creator can return later.

Collect only what is useful for a good page and sensible deal rules:

1. Name, public handle, niche/category.
2. Main social platforms and profile links.
3. Followers and average views/engagement where available.
4. A rough “about me / what I create” description.
5. Content topics, skills and collaboration formats.
6. Achievements and previous collaborations (optional).
7. Preferred visual personality, colour direction and writing tone.
8. Collaboration preferences and categories/brands to avoid.
9. Private rate settings: preferred/target rate, minimum acceptable rate, currency and relevant deal restrictions.

Do not force creators to provide every stat or achievement. Make the key profile identity fields required; most other fields should be optional.

Stats are self-reported in V1. Clearly explain that the platform has not independently verified them.

## 4.4 AI-assisted creator copy and portfolio generation

Use AI to turn creator-provided information into polished portfolio wording. This is separate from collecting factual information.

Process:

1. Creator answers the wizard and writes rough notes in their own words.
2. The backend combines only those creator facts with a fixed, versioned product prompt.
3. AI creates polished copy for approved text fields (for example, a headline, short introduction, about section and concise achievement descriptions).
4. The model returns structured data (JSON with known fields), not a complete website.
5. The application checks that output against the allowed schema and length limits.
6. The creator sees a preview and can approve or edit the copy before publishing.

AI must not invent or guess:

- Follower counts, average views, engagement rates or other numbers.
- Awards, qualifications, achievements or clients.
- Brand partnerships, testimonials or results.
- Rates, minimum prices or deal terms.
- Social profile URLs or contact details.

If the creator has not supplied a fact, leave it blank. Never fill a missing number with a plausible-looking number.

AI may improve wording, organise facts, suggest a headline or ask the creator to clarify a vague statement. It may not invent new claims.

Do not let AI generate HTML, JavaScript, CSS, arbitrary layout instructions or executable code for a creator page. AI output is content only. The application's fixed portfolio template controls design and layout.

## 4.5 Creator landing page / portfolio

This is one of the most important parts of the product.

- Each creator gets a public URL such as `/c/creator-handle`.
- One reusable, professionally designed landing-page template is used initially.
- It should feel like a premium personal landing page, not a basic media-kit form.
- The layout structure can remain consistent, while colours, fonts, text, imagery and visible sections are personalised.
- Allow curated colour/font combinations rather than unrestricted design controls in V1.
- Mobile-first and polished on desktop.
- Sections can include: creator identity, headline, introduction, about, platforms/social links, audience statistics, achievements, skills/content categories, selected collaborations and “Work with me”.
- Include a clearly presented inquiry assistant in the “Work with me” section.
- Include a small consistent brand footer on every creator page: **“Made with [Product Brand]”**. The final product brand name is not selected yet.
- Include real page metadata and a social-link preview image so the creator's URL looks good when pasted into a chat or social app.
- Support draft, preview and published states. Draft pages should not appear as public live portfolios.
- Use unique, validated creator handles.
- Add a small disclosure/info icon near self-reported statistics.

### Missing information and hidden sections

This is a fixed product rule:

- If a creator skips a section's information, that section or element is not rendered on the public page.
- Do not show blank cards, “add your link” placeholders or empty sections to the public.
- Example: if no social links are added, hide the social links section. If no achievements are entered, hide achievements. If no statistics are entered, hide the statistics block.
- The editor should show that an optional section is currently absent and offer a simple “Add section” or “Add information” action.
- When the creator fills the relevant fields and saves, the section automatically appears in the preview and can be published.
- A creator can hide a populated section without deleting its information.

## 4.6 Simple no-code editor

The editor must be easy for a non-technical creator.

- Edit text, images, links, colours, font choice and relevant section fields.
- Add a missing section by choosing it and filling a short form.
- Saving the required information automatically adds the section to the preview.
- Hide/show populated sections.
- Live or near-live preview.
- Publish/unpublish controls.
- No coding, HTML, CSS, or drag-and-drop canvas in V1.
- Do not let creators freely move every item around the page. Preserve the designed layout and quality.

## 4.7 Creator dashboard

The dashboard should be useful even when there are no offers.

Include:

- Page views and estimated unique visits (explain limitations of privacy-friendly counting).
- Link clicks.
- Inquiry starts and completed inquiries.
- Offers received, visible, hidden, unfinished and accepted.
- Basic date-based charts and number cards.
- Clear empty states with the next action suggested.
- A getting-started checklist and short product guides.
- Contextual tips explaining how to get more from the product (for example: add missing social links, share the public link, configure the DM reply, complete deal preferences).

Keep analytics privacy-conscious. Do not implement fingerprinting, cross-site tracking, ad pixels or hidden tracking. Country/device/referrer breakdowns are optional and only to be collected when the privacy/legal approach supports them. Do not promise perfect unique-visitor measurement without persistent identifiers.

## 4.8 Brand inquiry assistant — semi-AI

The brand assistant is a core differentiator and must feel capable of handling ordinary human conversation.

Opening:

> “Hi, I'm [Creator]'s bot”

Include a small tap-to-open info icon. The disclosure card must explain:

- This is a semi-AI assistant operating under creator-defined rules.
- It can misunderstand messages or make mistakes.
- It cannot accept a deal for the creator.
- The creator makes the final decision.
- The chat is stored and can be read by the creator.
- Link to the privacy information and a creator contact route.

### Information to collect

The inquiry should gather and confirm:

- Brand name and product/service.
- Compensation type: cash, barter or affiliate.
- Budget and currency (INR/USD initially).
- Deliverables (reels, posts, stories, videos, etc.).
- Deadline and campaign timeline.
- Usage rights.
- Exclusivity.
- Whitelisting/paid amplification.
- Content requirements, formats, hashtags, posting schedule and restrictions.
- Brand contact email.

The assistant should ask one question at a time, show typing feedback and make the flow feel like a conversation rather than a long form.

### Hybrid conversation design

The bot is not a free-roaming AI agent. Use a controlled conversation engine:

1. **Hardcoded flow first:** known questions, quick replies, buttons, chips, field validation, state tracking and approved responses.
2. **AI fallback only when necessary:** when the message cannot be safely understood by the deterministic rules, call the AI helper to interpret the message or handle short small talk.
3. **Structured result only:** AI returns a constrained classification and candidate field value, not an instruction to change a deal or execute an action.
4. **Backend validates:** the application checks the candidate against the current question, allowed values, deal rules and stored conversation state.
5. **Confirm ambiguity:** if an answer is unclear, ask the brand to clarify. Do not guess.
6. **Continue deterministically:** the hardcoded flow decides the next question and all deal state transitions.

Example:

Brand: “My day was awesome.”  
Assistant: “Glad to hear that! Now, which brand are you reaching out from?”

The bot should be friendly, but it must bring the conversation back to the collaboration enquiry.

### Off-topic behaviour

- A normal greeting, thanks or one brief social reply should receive a short natural acknowledgement and then return to the current deal question.
- Repeated unrelated conversation counts as off-topic.
- First off-topic turn: polite warning that the assistant is only for collaboration enquiries.
- Second off-topic turn: same warning, more explicit.
- Third off-topic turn: end the chat politely.
- Preserve the transcript and show the creator where the brand stopped under Unfinished (subject to the retention rules).
- Do not produce an offer from an incomplete conversation.

### Bot fallback and failure behaviour

- If AI is unavailable, rate-limited or returns invalid data, the chat must not break.
- Fall back to a clear question with buttons/quick replies or say that the creator will review the message.
- If the assistant does not understand a message after safe clarification, flag it for the creator; never invent a meaning.
- Store the entire brand/bot transcript in order.
- Rate-limit the public inquiry endpoint and add abuse protection before making it publicly accessible.
- A brand does not need to sign up to enquire.

## 4.9 Negotiation engine

The assistant negotiates in the creator's favour, but it cannot guarantee that a brand will disclose its maximum budget or agree to a higher price.

### Private creator settings

Keep these separate:

- Preferred/target rate.
- Absolute minimum acceptable rate (private; never show it to the brand).
- Public starting-rate wording, only if the creator chooses to provide it.
- Currency.
- Allowed compensation types.
- Deal-breaker terms and restrictions.

### Negotiation rules

1. Ask the brand for its available budget/range before revealing any creator pricing, wherever possible. This is important: if a brand can pay $1,400 but volunteers only $1,000, asking for the budget first gives the assistant a better chance of discovering the higher budget.
2. Never disclose the creator's absolute minimum.
3. If a creator-approved starting rate must be shared, it is not the private minimum.
4. Use no more than two counter-offers.
5. Counters should move toward the creator's target and must stay within the creator's private rules.
6. If a brand already offers a strong amount, do not negotiate downward or reveal unnecessary pricing information.
7. Stop immediately on a hard deal-breaker (prohibited brand/category, unacceptable usage/exclusivity terms, content restriction violation or other creator-defined hard no).
8. If the final offer remains below the private minimum after the allowed counters, stop. Do not pretend it is acceptable.
9. Stop negotiating as soon as there is a workable proposal. Do not continue bargaining just because another counter is available.
10. Never accept a deal for the creator.
11. Summarise the final proposed terms and pass the offer to the creator.

The bot's job is to negotiate and present a proposal. The creator's job is to accept, decline or hold it.

## 4.10 Offer scoring

Start with the weights from the founder's business model. They are a **first-version hypothesis**, not a scientifically proven or perfect formula.

| Factor | Weight |
|---|---:|
| Rate attractiveness against creator's private target/floor | 40% |
| Terms risk (usage rights, exclusivity, whitelisting, payment and other red flags) | 20% |
| Brand trust/reliability | 15% |
| Requirements fit (content, audience, timeline, formats and creator restrictions) | 15% |
| Payment terms/timeline | 10% |

Rules:

- Each factor receives a 0–10 sub-score.
- Calculate a weighted total from 0–10.
- Show “Why this score” so the creator can see the reason behind it.
- Score **5 or higher**: Visible, unless a hard rule blocks it.
- Score **below 5**: Hidden.
- Hard-blocked spam, abuse, prohibited categories and hard deal-breakers are not normal offers; close/log them separately.
- Sort Visible and Hidden offers by score, highest first.
- Use a neutral brand-trust value (for example 5/10) when there is no verified history. Do not pretend an unknown brand is trusted or untrusted.
- Do not use reviews in the V1 score because brand reviews/trust history are not part of initial V1.
- The weights and sub-score bands must be tested against example deals and later recalibrated using real beta outcomes.

The scoring engine is a decision aid, not a guarantee of deal quality. The creator makes the final decision.

## 4.11 Offer inbox and transparency

Four separate sections:

**Visible**
- Offers with score 5 or above that pass hard rules.
- Sorted by score descending.
- Show brand, score, amount/currency, deliverables, deadline, usage/terms summary, red flags, “Why this score”, countdown, and transcript link.

**Hidden**
- Offers scoring below 5 or failing soft suitability rules.
- Never mix them with Visible.
- Creator can inspect the reason, transcript and terms.
- The offer remains available until its expiry deadline, then auto-declines.

**Unfinished**
- Brand chats that began but did not complete the required information.
- Show what information the brand provided and the point where it stopped.
- Show the full available transcript.
- No Accept or Decline buttons because there is no complete offer.
- Auto-expire after 14 days of inactivity, subject to the retention policy.

**On Hold**
- A creator can temporarily set aside a completed offer without accepting or declining it.
- The creator can return to it and decide before expiry.
- Recommended rule: one 14-day decision deadline begins when the completed offer first reaches the creator. Moving it to On Hold does not reset or extend the original deadline. This is the simplest way to stop old deals piling up.
- At expiry, auto-decline and remove it from the active inbox. Keep only the minimum record/transcript needed under the published retention policy.

### Offer timer

- Default validity: 14 days from the time the completed offer is delivered to the creator.
- Countdown appears in days/hours.
- Reminders at 3 days and 24 hours remaining.
- At expiry: automatically decline, send the brand an outcome email, remove from active lists and retain/expire the record according to the privacy retention rules.
- Hidden and On Hold offers use the same original expiry deadline.

The “On Hold does not reset the timer” behaviour is the recommended interpretation for V1. It must be clearly explained to the creator in the UI.

### Transparency

- Creator can read the complete brand/bot conversation in the correct order, including negotiation messages.
- Creator can copy the transcript.
- Show plain-language descriptions of terms and red flags such as perpetuity, exclusivity, whitelisting, broad usage rights and long payment windows.
- Do not hide the bot's negotiation from the creator.

## 4.12 Accept / Decline

- Creator can accept or decline from the authenticated dashboard.
- Acceptance creates a deal record.
- Declining records the outcome and sends a polite brand email.
- Do not accept a deal automatically.
- Keep a record of who made the decision and when.

## 4.13 Email notifications

Send transactional emails for:

- Creator receives a completed offer.
- Offer reminder at 3 days and 24 hours remaining.
- Offer auto-declined after expiry.
- Brand receives accept/decline/auto-decline outcome.
- Accepted deal handoff and next steps.

Use a proper transactional provider and configure sender-domain authentication (SPF, DKIM and DMARC) before relying on production delivery. Do not assume that an email sent by code will reach the inbox. Test deliverability.

For V1, email buttons should link to the app. Creator actions still require login.

## 4.14 Basic deal management

On acceptance, create a structured deal record/page; do not send both parties back into an unstructured DM thread.

V1 deal page includes:

- Agreed rate and currency.
- Deliverables.
- Deadline.
- Usage rights and key requirements.
- Brand contact and creator contact.
- Creator's payment instructions (for example, UPI or a payment link, where appropriate).
- Deal status and activity log.
- Links/notes can be entered manually.

Simple status flow:

Accepted → Payment pending → Payment received → Content in progress → Submitted → Posted → Completed.

The SaaS does **not** hold or transfer brand/creator funds in V1. Payment is directly between brand and creator. The SaaS is not a party to their commercial agreement. Get appropriate legal wording reviewed before release.

For V1, keep the deal manager creator-focused and simple. Full brand login, draft uploads, brand-side approval workflow and complex file management are not required.

## 4.15 DM auto-reply guide

This is guidance, not an Instagram integration.

- Provide a pre-written message containing the creator's public page link.
- Let the creator copy it with one click.
- Provide a simple step-by-step guide explaining how the creator can configure an automated reply in their own social app.
- Cove/Creadova/any unchosen product name must not be hard-coded into the message before the brand name is selected.
- Do not request Instagram permissions or connect to Instagram APIs in V1.

## 4.16 Basic product education

- First-login checklist.
- Short “how to use this” help pages.
- Contextual suggestions based on missing setup fields and product activity.
- Empty states that explain the next useful step.
- No expensive personalised AI coaching is needed; these tips can be rule-based.

---

# 5. V1 — what we are NOT making yet

These are deliberate exclusions, not forgotten items.

| Deferred feature | Why it is postponed |
|---|---|
| Subscription billing and automatic plan enforcement | Prove that creators and brands use the core loop before spending time on payment plans. Private beta can be free/manual. A paid commercial launch will need billing before charging users. |
| Multiple portfolio templates | One polished template is enough to validate the product. Build more only when creators demonstrate a real need. |
| Free-form drag-and-drop website builder | Too much complexity for V1; it risks breaking layout quality and mobile design. |
| Instagram/WhatsApp DM API integration | The V1 feature is a copyable reply and setup guide, not an integration. |
| Automatic sending of creator outreach emails | Not needed for the inbound brand enquiry loop. |
| Brand discovery database | Needs a separate data acquisition and maintenance system. |
| Outreach pitch generator and outreach tracker | Growth tools, not the core inbound workflow. |
| Public brand reviews and brand trust database | Needs real completed-deal volume and moderation. Unknown brand trust stays neutral in V1 scoring. |
| Blue-tick stats verification | Manual verification process; not essential to prove the core loop. Stats are labelled self-reported. |
| Weekly digest email | Retention improvement for later, after the main product is used. |
| Rate calculator | Useful lead magnet, but not required for portfolio + inquiry + offer management. |
| QR code and PDF media kit | Useful extras, but not needed for the public link to work. |
| Advanced analytics and complex attribution | Basic privacy-friendly metrics are sufficient at launch. |
| AI-generated page layouts/code | Dangerous and unpredictable. AI generates copy only; the template controls the layout. |
| Autonomous AI negotiation or deal acceptance | The AI cannot bypass creator rules or make final decisions. |
| Escrow, payment processing or commission on creator deals | The SaaS does not hold money or take a commission in V1. |
| Full brand accounts and brand-side deal portal | A brand should be able to enquire without an account. Full brand collaboration management can wait. |
| Brand-side file approval, draft upload and complex revision management | Keep the first deal page limited to agreed details, status, links and activity history. |
| Advanced recommendation engine | No enough data exists initially. Simple creator-defined rules and transparent scoring are better. |

**Definition of the first V1:** a complete working private beta that can be used by real creators and real brands, with the core journey functional. It is not yet a fully monetised subscription business. Add billing and final commercial launch requirements after the beta validates the product.

---

# 6. AI architecture and rules

## 6.1 Two separate AI systems — do not confuse them

1. **Dyad builder AI:** the model used by the founder inside Dyad to create and modify code. It is a development tool.
2. **Product AI:** the model called by the deployed SaaS to improve portfolio copy and help the brand inquiry assistant understand messages.

The Dyad model does not automatically become the product's AI model. Product AI calls need their own backend integration, budget limits and privacy review.

## 6.2 Product AI use cases in V1

Allowed:

- Rewrite creator-provided rough notes into professional, natural portfolio wording.
- Suggest a concise headline or about paragraph based on facts supplied by the creator.
- Understand unstructured brand messages and extract candidate values.
- Handle brief small talk and return the chat to the current deal question.
- Classify an unexpected message as a likely answer, small talk, off-topic, unclear or unsafe.
- Summarise messages for internal creator display only if useful and clearly marked as a summary.

Not allowed:

- Make up creator statistics, achievements, clients, rates or testimonials.
- Set or change the creator's floor/target price.
- Decide whether a deal is acceptable.
- Change the negotiation counter limit.
- Override prohibited brand/category or usage rules.
- Calculate the final score without the fixed scoring engine.
- Accept or decline offers.
- Publish a portfolio without creator approval.
- Generate executable code, arbitrary HTML or layout changes.

## 6.3 Fixed prompt and structured output

- Keep the main system prompt in backend code/configuration, not in browser code.
- Version the prompt so changes can be tested and rolled back.
- Send only the data needed for the task.
- Ask the model for a strict JSON result using an approved schema.
- Validate every result server-side.
- Reject unknown fields, unexpected actions, malformed JSON and oversized content.
- Treat the user's text as untrusted input, not instructions that can override system rules.
- Keep generated copy separate from the original creator facts so the creator can edit or regenerate it.

## 6.4 Recommended model/provider test order

**First test: Cloudflare Workers AI.** Start by benchmarking a small model such as Llama 3.2 3B. If its output is too weak for natural conversation or copywriting, compare a stronger currently available model (for example an 8B model). Choose based on real test results, latency, quota and privacy terms—not parameter count alone.

Cloudflare's published free allocation is 10,000 Neurons per day. This is not unlimited usage; add quotas and a graceful fallback when the allocation or rate limit is reached. Cloudflare's zero-retention statement applies to standard inference; if the app enables logging, caching or storage features, review their separate retention behaviour. Also review the license/terms of the specific model selected from Cloudflare's catalogue.

**Google Gemini API:** use free-tier access for experiments with invented/synthetic data only. Google's unpaid Gemini terms say prompts and responses may be used to improve products and may be reviewed by people. Do not send real confidential negotiation details or sensitive user data through that free tier. Google's current additional terms also state that API users must be at least 18 years old; check account eligibility before using it.

Provider and model terms can change. Re-check them before production use.

## 6.5 AI cost controls

- AI is called only when the hardcoded flow cannot safely handle the input, plus one copy-generation call when the creator generates or regenerates portfolio text.
- Limit AI calls per conversation and per creator.
- Limit input context and maximum output length.
- Set a daily usage cap and monitor Neurons/tokens.
- Add rate limits per IP, creator page and chat session.
- Keep a provider/model setting in backend configuration so the model can be changed without redesigning the app.
- If model quota is exhausted, use the deterministic fallback. Do not promise unlimited free AI.

## 6.6 API-key safety

- Never place a product AI API key in React/browser code or a public environment variable.
- Call AI through a server-side function (recommended: Supabase Edge Function or a Cloudflare Worker).
- Store provider tokens as server-side secrets.
- Do not commit `.env` or secret files to GitHub.
- Use a restricted Cloudflare API token with only the required Workers AI permission.
- Do not log entire prompts/transcripts in general application logs unless necessary and covered by the privacy policy.

---

# 7. Offer scoring and negotiation — implementation details

## 7.1 Scoring baseline

The existing weights are a reasonable starting hypothesis, not a proven perfect system. Use them in V1 and test them against sample deals before beta.

Each factor gets a score from 0 to 10:

- **Rate attractiveness (40%):** compare the proposed final amount with the creator's private target and minimum. The model must never see or reveal the creator's private minimum in a brand-facing response.
- **Terms risk (20%):** evaluate usage duration, whitelisting, exclusivity, perpetuity, broad rights, late payment and creator-defined restrictions. Higher risk means a lower sub-score.
- **Brand trust (15%):** use neutral 5/10 where history is unknown. There are no brand reviews in V1.
- **Requirements fit (15%):** match deliverables, niche, content type, deadline and creator restrictions.
- **Payment terms (10%):** score advance/upfront and short windows higher; longer or unclear terms lower.

Weighted score = sum of each sub-score multiplied by its weight.

A hard deal-breaker must not be hidden inside the weighted score. It overrides the score and prevents the offer from becoming a normal Visible offer.

## 7.2 Hard blocks versus soft misses

- Hard blocks: spam/abuse, prohibited category, creator's explicit hard-no brand, illegal/unacceptable request or non-negotiable term. End or close the chat and log the reason.
- Soft misses: low budget before all negotiation options are exhausted, imperfect fit or terms that can be clarified. Negotiate/clarify, then score the final proposed terms.
- Final price still below the creator's private floor after counters: stop; do not show as a workable Visible offer. Route to Hidden/closed according to the clearly defined outcome rules.

## 7.3 Negotiation should start with the brand's budget

To avoid the $1,000 vs $1,400 problem:

- Ask for brand budget first.
- Do not volunteer the creator's minimum.
- Do not tell a brand the creator's floor or expose internal negotiation settings.
- If the brand refuses to share a budget, use only a creator-approved public starting-rate statement, if one exists.
- A model cannot know a brand's true maximum budget unless the brand reveals it. Never claim otherwise.

---

# 8. Recommended technology architecture

Keep the stack simple and avoid adding unnecessary platforms.

| Part | Recommendation | Responsibility |
|---|---|---|
| App builder | Dyad | Generates the React app and changes code with founder approval. |
| Front end | React + Vite (Dyad's simple default) | Marketing site, creator dashboard, public portfolio and bot UI. |
| UI styling | Tailwind CSS and a small component library such as shadcn/ui where compatible | Consistent layouts, components, responsive design. |
| Database | Supabase Postgres | Creator profiles, page content, conversations, offers, deal records and analytics events. |
| Authentication | Supabase Auth | Creator signup, login, sessions and password reset. |
| Server-side functions | Supabase Edge Functions initially | Secure operations, AI calls, emails and trusted state changes. |
| Hosting | Cloudflare Pages or Cloudflare Workers static assets, choose after a small deployment test | Public website and app hosting. |
| AI inference | Cloudflare Workers AI first benchmark | Portfolio copy and bounded natural-language fallback. |
| Email | Resend or another transactional provider after current limits are checked | Offer alerts, reminders and brand outcome emails. |
| Version backup | GitHub private repository | Keeps working versions and allows rollback. |

### Important architecture rule

The browser must not directly decide or write sensitive deal outcomes. For example, the browser must not calculate and save an accepted offer using untrusted values. Server-side functions validate authentication, current offer status, expiry, creator ownership and allowed transitions before changing records.

### Data separation

- A creator can only read and edit their own private profile, rates, conversations, offers and deals.
- A public visitor can only read a published creator page and submit an inquiry through the guarded public inquiry endpoint.
- Public visitors must never read private minimum rates, internal creator preferences, other offers or another creator's private data.
- Use Supabase Row Level Security (RLS) on every relevant table and test cross-account isolation.
- Use a development database while building. Create/maintain a separate production database before real customer data is introduced. Never test destructive operations on production data.

### Scheduled timers

Use a scheduled server-side job (Supabase Cron/pg_cron or Cloudflare Cron) to send reminders and process expired offers. Do not rely on a browser tab being open to run a 14-day timer. The timer must work even if the creator never logs in.

---

# 9. Step-by-step V1 build roadmap

Build in this order. Every step has a visible outcome and acceptance checks. The exact Dyad prompt for each step should be written only when that step is about to begin, using the current codebase as context.

## STEP 0 — Foundation and safety rails

**Build:**
- Create the Dyad project.
- Set up a private GitHub repository and connect Dyad sync.
- Set up Cloudflare account and a basic test deployment.
- Set up a Supabase development project.
- Create the initial app skeleton and route structure.
- Add design tokens, global typography and responsive base layout.
- Add `.env.example` with names only; real secrets stay local/server-side.
- Add basic testing and a repeatable backup/checkpoint process.

**Acceptance checks:**
- App runs in Dyad preview.
- Basic route loads locally and in a Cloudflare test deployment.
- GitHub contains the initial checkpoint.
- No secrets are present in the repository.
- The project has a written build checklist and clear source-of-truth context.

## STEP 1 — Marketing website

**Build:**
- Full premium home page.
- Animated hero product demo.
- Navigation and footer.
- How-it-works, for-creators, pricing, FAQ, about and contact pages.
- Legal page shells, designed 404, login/signup shells.
- Responsive mobile layouts.
- Loading skeleton and animation system.

**Acceptance checks:**
- Site looks premium at phone, tablet and desktop widths.
- Main animations work and do not block content.
- Scroll reveals, transitions and reduced-motion behaviour work.
- All navigation links work.
- No fake testimonials, fake customers or fabricated performance numbers.
- Cloudflare preview URL loads successfully.

## STEP 2 — Database and permissions

**Build:**
- Supabase connection.
- Tables for creator profiles, page content/sections, conversations, messages, offers, deals and analytics events.
- Versioned database changes/migrations.
- RLS policies and safe public read rules.
- Guarded public inquiry write path (not opened to the public before it is protected).

**Acceptance checks:**
- Creator A cannot read or update creator B's private data.
- Public visitor can read only published page information.
- Public visitor cannot read private rates or offers.
- Public inquiry endpoint validates and rate-limits incoming data.
- Test and production data are kept separate before production users are onboarded.

## STEP 3 — Signup, login and creator workspace

**Build:**
- Signup, login, logout and password reset.
- Session persistence.
- Protected creator routes.
- Redirect back to intended route after login.
- Account deletion and data export basics.

**Acceptance checks:**
- Logged-out visitor cannot access creator dashboard, editor, inbox or private settings.
- Public creator pages and brand inquiry flow remain accessible without creator login.
- Each creator sees only their own private records.

## STEP 4 — Creator onboarding wizard

**Build:**
- 7–9 short screens.
- Save progress and resume.
- Back/continue actions.
- Optional fields and skip behaviour.
- Creator identity, niche, links, stats, achievements, content, preferences and private deal settings.
- Draft portfolio copy input.

**Acceptance checks:**
- A sample creator can complete required onboarding in 2–4 minutes.
- Optional questions can be skipped.
- Answers persist after refresh/relogin.
- Private pricing fields never appear on the public page.

## STEP 5 — AI portfolio copy and page generator

**Build:**
- Fixed page template with labelled content slots.
- AI copy-generation backend function.
- Strict JSON schema and validation.
- Preview/approve step.
- Dynamic theme colours, font options and text.
- Optional sections hidden when information is missing.
- Branded footer and public URL.
- Draft, preview and published states.
- Social preview/metadata.

**Acceptance checks:**
- Missing social links hide the social section.
- Missing achievements hide the achievement section.
- AI does not invent numbers or achievements in the test cases.
- Generated copy uses only supplied facts.
- Invalid AI output is rejected and does not break the page.
- Page works at narrow phone widths and desktop widths.
- Public page displays correctly without login; editing remains login-protected.

## STEP 6 — Simple editor and creator dashboard

**Build:**
- Simple forms for editing fields.
- Add missing section by filling its information.
- Hide/show section controls.
- Theme and font controls.
- Publish/unpublish.
- Basic analytics cards and charts.
- Getting-started checklist, guides and useful tips.

**Acceptance checks:**
- Creator can add a skipped section without any coding.
- Saving the required information makes the section appear in preview.
- Unpublishing removes the public content safely.
- Test page views and clicks increment correctly.
- New users see useful empty states.

## STEP 7 — Brand inquiry assistant

**Build:**
- Public “Work with me” entry.
- Bot welcome and info disclosure card.
- Hardcoded question/state engine.
- Quick replies and validated text fields.
- AI fallback for unexpected language, small talk and unrecognised free text.
- Off-topic warning/termination counter.
- Full transcript storage.
- Fallback when AI is unavailable.
- Rate limiting and abuse checks.

**Acceptance checks:**
- A brand can complete a normal enquiry without logging in.
- Bot asks questions in the correct order and confirms important values.
- “My day was awesome” receives a brief natural response and the bot returns to the current question.
- First and second repeated off-topic messages warn; the third ends the chat.
- AI cannot change deal settings or accept a deal.
- Invalid model output triggers fallback instead of a broken chat.
- Creator can see the transcript.

## STEP 8 — Negotiation and scoring

**Build:**
- Private rate configuration.
- Ask brand budget first.
- Up to two counter-offers.
- Deal-breaker rules.
- Stop when workable.
- Rule-based scoring with the stated weights.
- “Why this score” breakdown.
- Red-flag keyword explanations.
- Hard-block versus soft-miss handling.

**Acceptance checks:**
- Private minimum is never sent to or shown by the brand-facing assistant.
- Counter-offer count never exceeds two.
- A hard deal-breaker stops negotiation immediately.
- An offer above target is not negotiated down.
- Score calculation matches a set of hand-calculated test examples.
- Score below 5 routes to Hidden; 5 or above routes to Visible unless blocked.
- Unknown brand trust uses the neutral score.

## STEP 9 — Offer inbox, Hold and transparency

**Build:**
- Visible, Hidden, Unfinished and On Hold sections.
- Descending score order.
- Offer cards with all required facts.
- Full transcript view and copy button.
- Terms/red-flag explanations.
- Accept, Decline and Hold controls.
- 14-day countdown and expiry states.

**Acceptance checks:**
- Sections never mix their records.
- Visible and Hidden sort highest score first.
- Unfinished offers have no Accept/Decline buttons.
- On Hold is still undecided and can be reopened before expiry.
- Hold does not reset the original 14-day deadline.
- Countdown works correctly across time zones.
- Expired offers leave active lists and are not silently deleted from records needed for the stated retention policy.

## STEP 10 — Email and basic deal manager

**Build:**
- Transactional email provider integration.
- Email sender-domain configuration.
- New offer notification and reminders.
- Brand accept/decline/auto-decline outcome emails.
- Authenticated offer links.
- Deal page created on acceptance.
- Deal status steps, payment instructions and activity log.
- DM auto-reply guide and copyable creator-specific reply.

**Acceptance checks:**
- Test emails arrive at multiple providers (not just the developer's own inbox).
- Sender authentication is configured.
- Reminders run without a browser tab open and are sent only once per milestone.
- Brand outcome emails use the correct confirmed offer information.
- Creator decisions require authentication.
- Accepted deal details and status history persist.
- Payment is direct; the SaaS does not collect or hold creator/brand funds.

## STEP 11 — Security, privacy, performance and private beta

**Build/check:**
- Final RLS and endpoint security review.
- Abuse/rate-limit controls on public chat.
- AI usage caps and monitoring.
- Error and uptime monitoring.
- Backup/export and restore test.
- Real privacy policy, terms and data-retention wording, professionally reviewed.
- Mobile and desktop QA.
- Email deliverability checks.
- Creator/brand beta onboarding and feedback route.

**Acceptance checks:**
- No creator can view another creator's records.
- Public endpoints cannot be used to spam unlimited emails or AI calls.
- No API keys in front-end bundles or GitHub.
- Privacy and bot disclosure are visible before real use.
- Core user flows pass on phone and desktop.
- A creator can publish a page, receive an actual brand inquiry, see the transcript, review a scored offer, accept/decline/hold it and manage an accepted deal.
- A small group of real creators and brands can use the product without the founder manually repairing every transaction.

## STEP 12 — Paid commercial launch (after beta validation)

This is not part of the first zero-budget beta, but it is required before presenting the SaaS as a paid subscription business.

Potential tasks:
- Choose final pricing and feature limits.
- Integrate a merchant-of-record/payment provider suitable for the founder's business and target regions.
- Trial enforcement and plan quotas.
- Cancellation, refund and billing support process.
- Review tax, consumer and subscription obligations.

Do not spend development time on this until the core product is being used and at least a few brands have completed genuine enquiries.

---

# 10. How to build using Dyad

## 10.1 What Dyad is and is not

Dyad is a local AI app builder. It helps generate and modify application code, but it does not remove the need for testing, reviewing, secrets management, database security or deployment checks. The application code remains in a normal project folder and can be backed up through GitHub.

The founder does not need to learn programming before starting, but must learn a small operational routine: give one clear task, preview it, inspect the changes, test it, and sync a working checkpoint.

## 10.2 Setup sequence

1. Install Dyad and Node.js using the official Dyad setup instructions.
2. Configure a coding model/provider for Dyad. This is only for building the app.
3. Create a private GitHub repository.
4. Create the Dyad app and connect it to GitHub.
5. Connect Supabase through Dyad's Supabase integration.
6. Create a development Supabase project first. Create the production project before onboarding real users.
7. Create a Cloudflare account and test the deployment path for the Dyad-generated React/Vite project.
8. Add secrets only in the appropriate server-side secret store. Never paste product API keys into public application code.

## 10.3 Recommended Dyad framework choice

Start with Dyad's default **React + Vite** app unless the actual product requirements demonstrate a reason to change. Avoid adding Next.js solely because it appeared in an earlier OpenCode plan. A React/Vite front end is sufficient for this product when private operations are performed by Supabase Edge Functions and the app is deployed correctly on Cloudflare.

## 10.4 How to prompt Dyad

For every step:

1. Give Dyad the master context document (or the relevant section).
2. State the single step being built.
3. Tell it what is explicitly out of scope for that task.
4. Tell it to inspect the existing project before changing files.
5. Require it to preserve working features and avoid unnecessary rewrites.
6. Ask it to explain what files it will change before approving significant changes.
7. Let it make the change, then run the tests and inspect the preview.
8. Ask for a plain-English report: what changed, what works, what failed, what still needs manual setup.
9. Only after verification, sync/commit a checkpoint to GitHub.

## 10.5 Reusable Dyad instruction block

Use this as the standing project instruction for Dyad or any coding assistant:

> You are building a real SaaS application for a non-technical founder. Read the supplied Master Context before every major task. Follow its V1 scope exactly. Do not add unrelated features. Work only on the named step. Inspect the existing code before editing. Preserve all working behaviour. Do not replace the app or rewrite large sections unless the task requires it. Use React + Vite, Supabase and Cloudflare unless a specific technical reason requires a change. Keep private operations and API keys on the server. Supabase RLS is mandatory for private creator data. Do not trust client-side decisions for offers, negotiation, scoring or expiry. Use fixed templates and structured, validated AI output; never let AI generate executable page code or invent facts. Build mobile-first. Follow the documented design tokens and animation direction. After each task, run the relevant tests, check the browser preview, list exactly what changed and report any incomplete work. Never claim success without verification. Do not continue to the next step until the founder approves the current step's result.

## 10.6 First Dyad task — Step 0 only

The first prompt should request only:

- A clean React + Vite application shell.
- Global design tokens and Inter typography.
- Dark default theme and light-theme foundation.
- Responsive base container and basic route setup.
- A minimal placeholder page that proves the design tokens work.
- Supabase connection readiness without implementing product features yet.
- GitHub connection and a working Cloudflare test deployment.
- Basic smoke test and `.env.example` containing variable names only.

Do not ask Dyad to build the whole marketing site in this first task. Once the foundation is verified and backed up, move to Step 1.

---

# 11. Testing rules and Definition of Done

Every step must have tests. At minimum:

- **Visual:** phone, tablet and desktop previews. Check spacing, typography, text overflow, image crop and animation.
- **Functional:** click every relevant button and test each user path.
- **Data:** refresh and log back in to confirm changes persist.
- **Security:** test a second creator account and confirm it cannot see the first creator's private data.
- **AI:** test normal, vague, unexpected, malicious and off-topic inputs. Confirm output schema and fallbacks.
- **Timers:** use test dates/shortened durations in development. Never wait 14 actual days to find timer bugs.
- **Email:** verify delivery and links with test accounts before real use.
- **Regression:** re-test the previously completed core paths after any change that could affect them.

A step is **Done** only when:

1. It matches the product requirements.
2. Tests pass.
3. Browser preview works.
4. No serious console/runtime errors remain.
5. Private data remains protected.
6. The founder can inspect the result.
7. The working version is backed up to GitHub.

If something fails, fix it before adding another feature.

---

# 12. Risks and honest expectations

## 12.1 Biggest business risk

The largest uncertainty is not whether we can create a beautiful website. It is whether brands will use the public inquiry assistant and complete a genuine collaboration enquiry. A waitlist alone does not prove this. We need real brands to try the process.

## 12.2 Biggest product risks

- A rigid bot frustrates brands; an unrestricted AI bot can make false promises. The hybrid design exists to balance these risks.
- Negotiation can damage creator trust if it exposes the creator's minimum or counters too aggressively.
- Scoring may be wrong until compared with real deals.
- Missing content can make creator pages look empty; hide absent sections instead.
- Free AI quotas can be exhausted or changed; always provide a non-AI fallback.
- Email may land in spam without proper sender authentication and domain setup.
- Supabase free projects may pause after periods of low activity; free plans also have usage and backup limitations. A free beta is not the same as a guaranteed always-on commercial service.
- Public inquiry endpoints can be abused. Rate limits and validation must exist before they are opened to the public.
- Legal/privacy requirements vary across India, the US, UK and EU. The product needs professionally reviewed terms and privacy information before a broad public launch.

## 12.3 What zero budget realistically means

- Development and private testing can begin with free tiers.
- Free tiers have caps, usage rules, inactivity pauses and changing availability.
- A custom domain, production email delivery, higher uptime guarantees, backups, AI usage beyond free allowance or legal review may eventually cost money.
- Never promise the founder that a full commercial SaaS can operate indefinitely at zero cost.
- Build the smallest version that can demonstrate real value, monitor usage and only spend when necessary.

## 12.4 First validation target

For the initial beta, aim for:

- 5–10 real creators using the product.
- At least 3 real brands completing a full enquiry.
- Creators receiving and acting on actual offers.
- No serious data leaks or broken core workflows.

The most important early metric is **how many real brands complete an inquiry**, not the number of marketing pages or dashboard charts.

---

# 13. Decisions already made and open decisions

## Locked decisions

- Product focus: creators and brand collaboration enquiries.
- Public creator page and brand inquiry link are central.
- Creator account is required for all private creator tools.
- Public portfolio and its brand inquiry flow are accessible without brand login.
- 2–4 minute creator onboarding target.
- One premium reusable portfolio template at first.
- Missing-information sections are hidden; editor can add them by filling short forms.
- AI can write portfolio copy from creator-provided facts only.
- Semi-AI bot: hardcoded conversation engine first, AI fallback when it cannot safely understand input.
- First two repeated off-topic turns warn; third ends the chat.
- Maximum two negotiation counters.
- Never reveal the creator's private minimum.
- Creator makes the final deal decision.
- Scores 0–10; below 5 goes to Hidden; highest score appears first.
- Visible, Hidden, Unfinished and On Hold are separate states/sections.
- Full conversation history is available to the creator.
- Default 14-day offer expiry and automatic decline.
- Basic email notifications and deal manager.
- Instagram DM is guidance only, not an API integration.
- No escrow or handling of creator/brand payments in V1.
- One portfolio structure, not multiple templates.
- Product name is not decided.

## Recommended calls for implementation

- Use Cloudflare Workers AI as the first live AI provider benchmark; use Gemini free tier only with synthetic test data due free-tier data-use terms.
- Start with a small Llama 3.2 instruct model and benchmark it; move to a stronger available model only if quality requires it.
- Use one 14-day deadline from completed offer receipt. Hold does not restart it.
- Send email links to authenticated pages; do not allow unauthenticated accept/decline in the first release.
- Keep onboarding AI generation separate from factual data collection.
- Keep the layout in a controlled reusable template; AI writes only approved text fields.
- Build a private beta first. Add subscription billing before paid commercial launch, not before core validation.

## Still undecided

- Final product/brand name and domain.
- Final model after quality, privacy and quota benchmarks.
- Exact price and plan limits.
- Whether trial begins at signup or first completed brand enquiry.
- Exact retention period for full brand conversation transcripts after expiry/account deletion.
- Final country coverage and exact currency conversion approach. Initial displayed currencies: INR and USD. Do not automatically convert currencies without an agreed conversion source/rule.
- Whether the creator can manually extend a pending offer deadline (not included in the initial rule unless deliberately added later).

---

# 14. Official technical references to re-check before implementation

These are useful current official references, not promises that free plans or model availability will remain unchanged:

- [Dyad overview](https://www.dyad.sh/docs)
- [Dyad quickstart](https://www.dyad.sh/docs/getting-started/quickstart)
- [Dyad supported AI models/providers](https://www.dyad.sh/docs/guides/ai-models)
- [Dyad Supabase integration](https://www.dyad.sh/docs/integrations/supabase)
- [Dyad GitHub/deployment guide](https://www.dyad.sh/docs/getting-started/publishing-your-app)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Workers AI model catalogue](https://developers.cloudflare.com/workers-ai/models/)
- [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Cloudflare Workers AI data usage](https://developers.cloudflare.com/workers-ai/platform/data-usage/)
- [Cloudflare API: run a Workers AI model](https://developers.cloudflare.com/api/resources/ai/methods/run/)
- [Supabase billing and quotas](https://supabase.com/docs/guides/platform/billing-on-supabase)
- [Supabase Edge Function secrets](https://supabase.com/docs/guides/functions/secrets)
- [Supabase scheduled functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [Google Gemini API pricing and free-tier data use](https://ai.google.dev/gemini-api/docs/pricing)
- [Google Gemini API additional terms](https://ai.google.dev/gemini-api/terms)

---

# 15. Short context prompt for a new AI session

Copy this section into a new assistant conversation when the full document cannot be attached:

> I am a complete beginner with no coding or technical knowledge and practically zero budget. I am building a creator collaboration SaaS using Dyad as the AI app builder, Supabase for database/auth/backend and Cloudflare for hosting. GitHub is our backup. You are my product planner, decision-maker, technical guide and reviewer. Explain things simply and make sensible decisions instead of giving me many technical options.
>
> Product: creators get a premium public landing page with a built-in semi-AI brand inquiry assistant. The assistant gathers brand, budget, deliverables, deadline, usage rights, exclusivity, whitelisting, requirements and contact email. It negotiates within creator-defined rules (maximum two counters), never reveals the creator's private minimum, never accepts a deal, and never overrides creator rules. The creator makes the final decision.
>
> Creator onboarding should take 2–4 minutes. It collects identity, niche, social links/stats, about text, skills/content, achievements and deal preferences. AI may polish creator-provided copy but must never invent facts or numbers. The portfolio uses one professionally designed reusable landing-page template with personalised colours, fonts and text. If information is missing, hide that section. The creator can add it in a simple editor by filling a short form; it then appears automatically.
>
> Design: premium dark theme, strong typography, polished colour scheme, animated hero, scroll reveals, fade transitions, loading/skeleton states and excellent mobile layout. Main references: augen.pro for layout/animation, mystack.com for layout personality and x.ai for dark visual direction. Avoid generic AI-looking design.
>
> Access: marketing pages, published creator pages and the public brand enquiry flow work without login. All private creator tools (dashboard, editor, offers, settings, deals) require creator login.
>
> Brand bot: hardcoded controlled flow first; AI fallback only for messages the hardcoded flow cannot safely understand, including small talk/unstructured answers. First two repeated off-topic turns warn; third ends. AI output must be structured and validated. AI never changes deal state or rules. If AI is down, fall back to buttons/clarifying prompts.
>
> Offers: rule-based score 0–10 using 40% rate, 20% terms risk, 15% brand trust (neutral if unknown), 15% requirements fit and 10% payment terms. Below 5 is Hidden; sort highest score first. Keep separate Visible, Hidden, Unfinished and On Hold sections. Full transcript must be visible and copyable. Default offer expiry is 14 days; recommended rule is that putting an offer On Hold does not restart the original timer. At expiry auto-decline and notify the brand. Creator can Accept, Decline or Hold.
>
> Deal manager: accepted deal gets a basic record with agreed terms, rate, deadline, payment instructions, statuses and activity log. The SaaS does not hold money. Instagram DM feature is only a copyable prewritten reply and setup guide, not an API integration.
>
> AI privacy: test Cloudflare Workers AI first. Do not send real private brand negotiation transcripts through Google's unpaid Gemini API because its free-tier terms allow submitted data to be used for product improvement and human review. Keep AI keys server-side. Never expose keys in frontend or GitHub.
>
> V1 excludes billing until core beta validation, additional templates, rate calculator, brand database/outreach tracker, brand reviews/trust score, blue tick verification, weekly digest, QR/PDF kit, escrow, DM integrations and autonomous AI actions. Build one step at a time. Test every step, preserve working code, review mobile and desktop, and back up to GitHub before proceeding. Never claim something is complete without checking it.
