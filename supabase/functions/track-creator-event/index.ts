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

async function hashVisitor(visitorId: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(visitorId));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "Analytics service is unavailable." }, 500);

  try {
    const body = await req.json();
    const handle = typeof body.handle === "string" ? body.handle.trim().toLowerCase() : "";
    const event = body.event;
    const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 100) : "";

    if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(handle)) {
      return json({ error: "Invalid creator page." }, 400);
    }
    if (!["page_view", "link_click", "inquiry_start", "inquiry_complete"].includes(event)) {
      return json({ error: "Invalid event." }, 400);
    }

    const admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: page, error: pageError } = await admin
      .from("creator_pages")
      .select("creator_id")
      .eq("handle", handle)
      .eq("status", "published")
      .maybeSingle();
    if (pageError) throw pageError;
    if (!page) return json({ error: "Published creator page not found." }, 404);

    const forwarded = req.headers.get("cf-connecting-ip")
      || req.headers.get("x-forwarded-for")
      || "unknown";
    const ip = forwarded.split(",")[0].trim() || "unknown";
    const ipHash = await hashVisitor(ip, key);
    const windowStart = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count, error: countError } = await admin
      .from("analytics_rate_limit_events")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", page.creator_id)
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);
    if (countError) throw countError;
    if ((count || 0) >= 120) return json({ error: "Analytics limit reached." }, 429);

    const { error: rateEventError } = await admin.from("analytics_rate_limit_events").insert({
      creator_id: page.creator_id,
      ip_hash: ipHash,
    });
    if (rateEventError) throw rateEventError;

    const visitorHash = event === "page_view" && visitorId.length >= 8
      ? await hashVisitor(visitorId, key)
      : null;

    const { error } = await admin.rpc("record_creator_analytics", {
      p_handle: handle,
      p_event: event,
      p_visitor_hash: visitorHash,
    });
    if (error) throw error;

    return json({ received: true });
  } catch (error) {
    console.error("track-creator-event error", error);
    return json({ error: "Could not record this event." }, 500);
  }
});