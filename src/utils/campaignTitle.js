/**
 * Turn a long client prompt into a short, catchy campaign headline.
 * e.g. "generate 10 meeting with cybersecurity" → "Cybersecurity Meetings ×10"
 */
function toTitleCase(words = []) {
  const acronyms = new Set(["saas", "cto", "ceo", "cfo", "coo", "ciso", "vp", "ai", "ml", "b2b", "b2c", "hr", "it"]);
  return words
    .map((w) => {
      if (!w) return "";
      if (/^\d+$/.test(w)) return w;
      const lower = w.toLowerCase();
      if (acronyms.has(lower)) return lower.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(" ");
}

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "for",
  "with",
  "from",
  "into",
  "onto",
  "of",
  "in",
  "on",
  "at",
  "by",
  "via",
  "our",
  "my",
  "we",
  "i",
  "please",
  "help",
  "me",
  "us",
  "some",
  "any",
  "this",
  "that",
  "these",
  "those",
  "using",
  "based",
  "about",
  "around",
  "across",
  "over",
]);

const ACTION_DROP = new Set([
  "generate",
  "create",
  "build",
  "find",
  "get",
  "make",
  "run",
  "launch",
  "start",
  "book",
  "schedule",
  "send",
  "target",
  "outreach",
  "reach",
  "contact",
  "identify",
  "discover",
  "look",
  "looking",
  "want",
  "need",
  "wanting",
  "needing",
]);

const INTENT_ALIASES = {
  meeting: "Meetings",
  meetings: "Meetings",
  demo: "Demos",
  demos: "Demos",
  call: "Calls",
  calls: "Calls",
  lead: "Leads",
  leads: "Leads",
  prospect: "Prospects",
  prospects: "Prospects",
  opportunity: "Opps",
  opportunities: "Opps",
  pipeline: "Pipeline",
  reply: "Replies",
  replies: "Replies",
  email: "Email",
  emails: "Email",
  message: "Msgs",
  messages: "Msgs",
  outreach: "Outreach",
  appointment: "Appts",
  appointments: "Appts",
};

export function buildCatchyCampaignTitle(raw = "", fallback = "Campaign") {
  const text = String(raw || "")
    .replace(/[^\w\s+\-./&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return fallback;

  const words = text.split(" ").filter(Boolean);
  if (words.length <= 4 && !ACTION_DROP.has(words[0].toLowerCase())) {
    return toTitleCase(words.slice(0, 5));
  }

  const lower = words.map((w) => w.toLowerCase());

  let qty = null;
  for (const w of lower) {
    if (/^\d+$/.test(w) && Number(w) > 0 && Number(w) < 10000) {
      qty = w;
      break;
    }
  }

  let intent = null;
  for (const w of lower) {
    if (INTENT_ALIASES[w]) {
      intent = INTENT_ALIASES[w];
      break;
    }
  }

  const topic = [];
  for (const w of lower) {
    if (/^\d+$/.test(w)) continue;
    if (STOP.has(w) || ACTION_DROP.has(w)) continue;
    if (INTENT_ALIASES[w]) continue;
    if (w.length < 2) continue;
    topic.push(w);
    if (topic.length >= 3) break;
  }

  const topicLabel = toTitleCase(topic);
  const parts = [];

  if (topicLabel) parts.push(topicLabel);
  if (intent) parts.push(intent);
  else if (!topicLabel) parts.push("Outreach");

  let title = parts.join(" ").trim() || fallback;

  if (qty) {
    title = `${title} ×${qty}`;
  }

  if (title.length > 42) {
    title = title.slice(0, 42).replace(/\s+\S*$/, "").trim();
  }

  return title || fallback;
}

/** Prefer a short AI title when it is already punchy; otherwise rewrite the goal. */
export function resolveCampaignHeadline(campaign = {}) {
  const goal = campaign.goal || campaign.prompt || "";
  const aiOrStored =
    campaign.title || campaign.name || campaign.response?.title || "";

  const candidates = [aiOrStored, goal].filter(Boolean);
  for (const c of candidates) {
    const words = String(c).trim().split(/\s+/);
    const first = (words[0] || "").toLowerCase();
    // Already short / not a raw prompt
    if (
      words.length <= 5 &&
      !ACTION_DROP.has(first) &&
      String(c).length <= 42
    ) {
      return toTitleCase(words);
    }
  }

  return buildCatchyCampaignTitle(goal || aiOrStored, "Campaign");
}
