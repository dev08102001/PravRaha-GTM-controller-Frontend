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

export function campaignMapper(campaign) {
  return {
    ...campaign,

    description:
      campaign.description ||
      campaign.goal ||
      "No description available",

    border:
      campaign.status === "RUNNING"
        ? "border-l-cyan-400"
        : campaign.status === "PAUSED"
        ? "border-l-yellow-400"
        : "border-l-green-400",

    tags: campaign.tags || campaign.channels || [],

    companies: campaign.companies ?? 0,
    buyersFound: campaign.buyersFound ?? 0,
    msgsGenerated: campaign.msgsGenerated ?? 0,
    msgsSent: campaign.msgsSent ?? 0,
    replies: campaign.replies ?? 0,
    meetings: campaign.meetings ?? 0,

    progress: campaign.progress ?? 0,

    started: campaign.started || "Just now",
  };
}