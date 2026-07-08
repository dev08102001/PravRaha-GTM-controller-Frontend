import { resolveCampaignHeadline } from "./campaignTitle";

// Returns the first complete sentence so the card reads short but not cut off.
function shortSummary(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const match = clean.match(/^(.*?[.!?])(\s|$)/);
  let sentence = match ? match[1] : clean;

  // Safety cap for an unusually long first sentence.
  if (sentence.length > 180) {
    const slice = sentence.slice(0, 180);
    const lastSpace = slice.lastIndexOf(" ");
    sentence =
      slice.slice(0, lastSpace > 0 ? lastSpace : 180).trim() + "…";
  }

  return sentence;
}

function normalizeStatus(status) {
  const raw = String(status || "").toLowerCase().trim();

  if (
    [
      "running",
      "active",
      "inprogress",
      "in_progress",
      "ready",
      "scheduled",
      "recipientsset",
    ].includes(raw)
  ) {
    return "running";
  }

  if (["paused", "pause", "stopped"].includes(raw)) {
    return "paused";
  }

  if (
    ["completed", "complete", "done", "finished", "sent"].includes(raw)
  ) {
    return "completed";
  }

  if (["draft", "pending", "queued"].includes(raw)) {
    return "draft";
  }

  // Keep unknown statuses readable on the card.
  return raw || "draft";
}

export function campaignMapper(campaign) {
  const stats = campaign.tracking_stats || {};
  const status = normalizeStatus(campaign.status);

  const msgsGenerated =
    campaign.msgsGenerated ??
    campaign.recipient_count ??
    stats.sent ??
    0;

  const msgsSent =
    campaign.msgsSent ??
    campaign.emailsSent ??
    stats.sent ??
    stats.delivered ??
    0;

  const replies =
    campaign.repliesReceived ??
    campaign.replies ??
    stats.replied ??
    0;

  const meetings =
    campaign.meetingsBooked ??
    campaign.meetings ??
    0;

  // Progress = share of generated outreach messages that have been sent.
  const progress =
    msgsGenerated > 0
      ? Math.min(100, Math.round((msgsSent / msgsGenerated) * 100))
      : 0;

  return {
    ...campaign,

    title: resolveCampaignHeadline(campaign),

    description: (() => {
      const summary =
        shortSummary(campaign.response?.summary) ||
        shortSummary(campaign.description);
      const headline = resolveCampaignHeadline(campaign);
      if (summary && summary.toLowerCase() !== headline.toLowerCase()) {
        return summary;
      }
      // Keep goal as a short supporting line, not a full prompt repeat.
      const goalLine = shortSummary(campaign.goal || campaign.prompt);
      if (
        goalLine &&
        goalLine.toLowerCase() !== headline.toLowerCase() &&
        goalLine.split(/\s+/).length <= 12
      ) {
        return goalLine;
      }
      return "Prompt-driven outreach campaign";
    })(),

    status,

    border:
      status === "running"
        ? "border-l-cyan-400"
        : status === "paused"
          ? "border-l-yellow-400"
          : "border-l-green-400",

    tags: campaign.tags || campaign.channels || [],

    companies:
      campaign.companiesFound ??
      campaign.companies ??
      campaign.recipient_count ??
      0,
    buyersFound:
      campaign.buyersFound ?? campaign.prospectsFound ?? 0,
    msgsGenerated,
    msgsSent,
    replies,
    meetings,

    progress,

    started:
      campaign.started ||
      (campaign.createdAt
        ? new Date(campaign.createdAt).toLocaleDateString()
        : "Just now"),
  };
}
