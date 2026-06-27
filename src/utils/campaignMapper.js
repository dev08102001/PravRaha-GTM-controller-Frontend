// export function campaignMapper(campaign) {
//   return {
//     ...campaign,

//     description:
//       campaign.title === "DevTools Series A/B Outreach"
//         ? "30 meetings with VP Engineering & CTO personas at funded DevTools companies"
//         : campaign.title === "Cybersecurity CISO Campaign"
//         ? "20 meetings with CISOs at Series A cybersecurity startups"
//         : campaign.title === "HR Tech RevOps Leaders"
//         ? "15 meetings with VP Sales & RevOps leaders at HR Tech companies"
//         : "Campaign generated from backend",

//     border:
//       campaign.status === "RUNNING"
//         ? "border-l-cyan-400"
//         : campaign.status === "PAUSED"
//         ? "border-l-yellow-400"
//         : "border-l-green-400",

//     tags:
//       campaign.title === "DevTools Series A/B Outreach"
//         ? [
//             "EMAIL",
//             "LINKEDIN",
//             "MARKET",
//             "ACCOUNT",
//             "BUYER",
//             "+2",
//           ]
//         : campaign.title === "Cybersecurity CISO Campaign"
//         ? [
//             "EMAIL",
//             "LINKEDIN",
//             "COLD CALL",
//             "MARKET",
//             "BUYER",
//             "MESSAGING",
//             "+1",
//           ]
//         : ["EMAIL", "BUYER", "MESSAGING"],
//   };
// }

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
    sentence = slice.slice(0, lastSpace > 0 ? lastSpace : 180).trim() + "…";
  }

  return sentence;
}

export function campaignMapper(campaign) {
  const status = (campaign.status || "").toLowerCase();

  return {
    ...campaign,

    description:
      shortSummary(campaign.response?.summary) ||
      shortSummary(campaign.description) ||
      campaign.prompt ||
      campaign.goal ||
      "No description available",

    border:
      status === "running"
        ? "border-l-cyan-400"
        : status === "paused"
        ? "border-l-yellow-400"
        : "border-l-green-400",

    tags: campaign.tags || campaign.channels || [],

    companies:
      campaign.companiesFound ?? campaign.companies ?? 0,
    buyersFound: campaign.buyersFound ?? 0,
    msgsGenerated: campaign.msgsGenerated ?? 0,
    msgsSent: campaign.msgsSent ?? 0,
    replies: campaign.replies ?? 0,
    meetings: campaign.meetings ?? 0,

    progress: campaign.progress ?? 0,

    started: campaign.started || "Just now",
  };
}