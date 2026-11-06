import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const cleanText = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const isEmail = (value: string) =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

async function hashIp(ip: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function includesAny(haystack: string, terms: string[]) {
  const source = haystack.toLowerCase();
  return terms.some((term) => term.trim() && source.includes(term.toLowerCase()));
}

function scoreOffer(input: {
  amount: number;
  currency: string;
  creatorCurrency: string;
  compensationType: string;
  allowedCompensation: string[];
  target: number;
  minimum: number;
  usage: string;
  exclusivity: string;
  whitelisting: boolean;
  payment: string;
  creatorNiche: string;
  preferred: string[];
  excluded: string[];
  hardNo: string[];
  campaign: string;
  deliverables: string[];
  contentRequirements: string;
  brandName: string;
}) {
  const combined = [
    input.campaign,
    input.usage,
    input.exclusivity,
    input.deliverables.join(" "),
    input.contentRequirements,
    input.brandName,
  ].join(" ");

  const blockedCategory = includesAny(combined, input.excluded);
  const blockedTerm = includesAny(combined, input.hardNo);
  const compensationLabel = input.compensationType === "barter"
    ? "product barter"
    : input.compensationType === "affiliate"
    ? "affiliate"
    : input.compensationType === "mixed"
    ? "mixed"
    : "cash";
  const compensationAllowed = compensationLabel === "mixed"
    ? input.allowedCompensation.includes("cash") &&
      (input.allowedCompensation.includes("product barter") || input.allowedCompensation.includes("affiliate"))
    : input.allowedCompensation.some((item) => item.toLowerCase().includes(compensationLabel));
  const hardBlockReason = blockedCategory
    ? "The enquiry appears to include a creator-excluded category."
    : blockedTerm
    ? "The enquiry appears to include a creator-defined hard-no term."
    : !compensationAllowed
    ? "The proposed compensation type is outside creator preferences."
    : "";

  // Non-cash-only proposals cannot be compared against a cash rate floor.
  // Never compare amounts in different currencies either.
  let rate = 5;
  if (
    input.compensationType !== "barter" &&
    input.compensationType !== "affiliate" &&
    input.currency === input.creatorCurrency &&
    input.target > 0
  ) {
    if (input.amount >= input.target) rate = 10;
    else if (input.amount >= input.minimum && input.minimum > 0) rate = 7;
    else if (input.minimum === 0 && input.amount >= input.target * 0.8) rate = 7;
    else rate = 2;
  }

  const usage = input.usage.toLowerCase();
  const exclusivity = input.exclusivity.toLowerCase();
  let terms = 8;
  if (usage.includes("perpetual") || usage.includes("in perpetuity") || usage.includes("unlimited")) terms = 0;
  else if (!input.usage || usage.includes("not sure") || usage.includes("discuss")) terms = 5;
  else if (usage.includes("paid") || usage.includes("all media")) terms -= 2;
  if (
    !exclusivity.includes("no exclusivity") &&
    (exclusivity.includes("yes") || exclusivity.includes("exclusive"))
  ) terms -= 3;
  if (input.whitelisting) terms -= 2;
  terms = Math.max(0, Math.min(10, terms));

  // Unknown brands receive a neutral trust score, never an invented reputation.
  const trust = 5;

  const preferenceText = input.preferred.join(" ").toLowerCase();
  const creatorNiche = input.creatorNiche.toLowerCase();
  const fit = !preferenceText && !creatorNiche
    ? 5
    : includesAny(combined, input.preferred) || includesAny(combined, [creatorNiche])
    ? 8
    : 6;

  const paymentText = input.payment.toLowerCase();
  const payment = paymentText.includes("upfront") || paymentText.includes("advance") || paymentText.includes("net-15")
    ? 10
    : paymentText.includes("net-30")
    ? 8
    : paymentText.includes("net-60") || paymentText.includes("net-90")
    ? 3
    : 5;

  const total = Math.round((rate * 0.4 + terms * 0.2 + trust * 0.15 + fit * 0.15 + payment * 0.1) * 100) / 100;
  return {
    total,
    breakdown: { rate, terms, trust, fit, payment },
    hardBlockReason,
    status: hardBlockReason ? "hard_blocked" : total >= 5 ? "visible" : "hidden",
    explanation: `Rate ${rate}/10 · Terms ${terms}/10 · Brand history unknown (neutral 5/10) · Fit ${fit}/10 · Payment ${payment}/10. This is a decision aid, not a guarantee. Review the full terms before deciding.`,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Server configuration is incomplete." }, 500);

  try {
    const payload = await req.json();
    const handle = cleanText(payload.handle, 30).toLowerCase();
    const brandName = cleanText(payload.brandName, 100);
    const brandEmail = cleanText(payload.brandEmail, 254).toLowerCase();
    const campaignName = cleanText(payload.campaignName, 160);
    const currency = payload.currency;
    const compensationType = payload.compensationType;
    const amount = Number(payload.budget);
    const deliverables = Array.isArray(payload.deliverables)
      ? payload.deliverables.map((item: unknown) => cleanText(item, 100)).filter(Boolean).slice(0, 12)
      : [];
    const timeline = cleanText(payload.timeline, 180);
    const usageRights = cleanText(payload.usageRights, 180);
    const exclusivity = cleanText(payload.exclusivity, 100);
    const whitelisting = Boolean(payload.whitelisting);
    const paymentTerms = cleanText(payload.paymentTerms, 180);
    const contentRequirements = cleanText(payload.contentRequirements, 1200);
    const transcript = Array.isArray(payload.transcript) ? payload.transcript.slice(-30) : [];

    if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(handle)) return json({ error: "This creator link is invalid." }, 400);
    if (brandName.length < 2) return json({ error: "Enter your brand or company name." }, 400);
    if (brandEmail && !isEmail(brandEmail)) return json({ error: "Enter a valid contact email." }, 400);
    if (!campaignName || !timeline || !usageRights || !exclusivity || !paymentTerms || deliverables.length === 0) {
      return json({ error: "Complete the required campaign details before submitting." }, 400);
    }
    if (!Number.isFinite(amount) || amount < 0 || amount > 100000000000) return json({ error: "Enter a valid campaign budget." }, 400);
    if (currency !== "INR" && currency !== "USD") return json({ error: "Currency is not supported." }, 400);
    if (!["cash", "barter", "affiliate", "mixed"].includes(compensationType)) return json({ error: "Compensation type is not supported." }, 400);

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: page, error: pageError } = await admin
      .from("creator_pages")
      .select("id,creator_id,handle,published_data")
      .eq("handle", handle)
      .eq("status", "published")
      .maybeSingle();
    if (pageError) throw pageError;
    if (!page) return json({ error: "This creator page is not available." }, 404);

    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip = forwarded.split(",")[0].trim() || "unknown";
    const ipHash = await hashIp(ip, serviceKey);
    const windowStart = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: countError } = await admin
      .from("inquiry_rate_limit_events")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", page.creator_id)
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);
    if (countError) throw countError;
    if ((count || 0) >= 6) return json({ error: "Too many enquiries from this connection. Please try again later." }, 429);

    const { error: rateInsertError } = await admin.from("inquiry_rate_limit_events").insert({
      creator_id: page.creator_id,
      ip_hash: ipHash,
    });
    if (rateInsertError) throw rateInsertError;

    const { data: settings, error: settingsError } = await admin
      .from("creator_settings")
      .select("currency,target_rate,minimum_rate,preferred_categories,excluded_categories,hard_no_terms,allowed_compensation")
      .eq("creator_id", page.creator_id)
      .maybeSingle();
    if (settingsError) throw settingsError;

    const score = scoreOffer({
      amount,
      currency,
      creatorCurrency: settings?.currency || "INR",
      compensationType,
      allowedCompensation: settings?.allowed_compensation || ["cash"],
      target: Number(settings?.target_rate || 0),
      minimum: Number(settings?.minimum_rate || 0),
      usage: usageRights,
      exclusivity,
      whitelisting,
      payment: paymentTerms,
      creatorNiche: cleanText(page.published_data?.niche, 100),
      preferred: settings?.preferred_categories || [],
      excluded: settings?.excluded_categories || [],
      hardNo: settings?.hard_no_terms || [],
      campaign: campaignName,
      deliverables,
      contentRequirements,
      brandName,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: inquiry, error: insertError } = await admin
      .from("brand_inquiries")
      .insert({
        creator_id: page.creator_id,
        page_id: page.id,
        brand_name: brandName,
        brand_email: brandEmail || null,
        campaign_name: campaignName,
        currency,
        compensation_type: compensationType,
        budget_min: amount,
        budget_max: amount,
        proposed_amount: amount,
        deliverables,
        campaign_timeline: timeline,
        usage_rights: usageRights,
        exclusivity,
        whitelisting,
        payment_terms: paymentTerms,
        content_requirements: contentRequirements,
        status: score.status,
        score: score.total,
        score_breakdown: score.breakdown,
        score_explanation: score.explanation,
        hard_block_reason: score.hardBlockReason || null,
        last_activity_at: now.toISOString(),
        expires_at: score.status === "hard_blocked" ? null : expiresAt,
        submitted_at: now.toISOString(),
        conversation_state: { source: "public_creator_page", version: 1 },
      })
      .select("id,status,score,score_explanation,hard_block_reason")
      .single();
    if (insertError) throw insertError;

    const safeMessages = transcript
      .map((item: any) => ({
        inquiry_id: inquiry.id,
        sender: item.sender === "brand" ? "brand" : "assistant",
        body: cleanText(item.body, 2000),
      }))
      .filter((item: any) => item.body.length > 0);

    safeMessages.push({
      inquiry_id: inquiry.id,
      sender: "system",
      body: "The brand submitted a completed collaboration enquiry. This is a proposal only; the creator makes the final decision.",
    });

    const { error: messagesError } = await admin.from("inquiry_messages").insert(safeMessages);
    if (messagesError) throw messagesError;

    // Never expose private scoring, creator floors, preferences, or routing decisions to a brand.
    return json({
      received: true,
      message: "Your enquiry has been sent to the creator for review. This is a proposal, not an accepted agreement.",
    }, 201);
  } catch (error) {
    console.error("brand-inquiry error", error);
    return json({ error: "We couldn't submit this enquiry right now. Please try again." }, 500);
  }
});