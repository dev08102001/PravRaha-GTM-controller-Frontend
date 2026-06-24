// export default function KpiCards({ analytics }) {
//   const cards = [
//     {
//       id: "emailReplyRate",
//       title: "Email Reply Rate",
//       value: analytics?.emailReplyRate ?? "-",
//       subtext: analytics?.emailReplyRateSubtext ?? "Industry avg: 3.1%",
//       valueColor: "",
//       subtextColor: analytics?.emailReplyRateSubtextColor ?? "text-gray-400",
//     },
//     {
//       id: "meetingRate",
//       title: "Meeting Rate",
//       value: analytics?.meetingRate ?? "-",
//       subtext: analytics?.meetingRateSubtext ?? "↑ +0.8% vs last month",
//       valueColor: "text-pink-300",
//       subtextColor: analytics?.meetingRateSubtextColor ?? "text-green-400",
//     },
//     {
//       id: "avgDealSize",
//       title: "Avg Deal Size",
//       value: analytics?.avgDealSize ?? "-",
//       subtext: analytics?.avgDealSizeSubtext ?? "ACV target: $10–15K",
//       valueColor: "",
//       subtextColor: analytics?.avgDealSizeSubtextColor ?? "text-gray-400",
//     },
//     {
//       id: "signalToMeeting",
//       title: "Signal → Meeting",
//       value: analytics?.signalToMeeting ?? "-",
//       subtext: analytics?.signalToMeetingSubtext ?? "Avg time to book",
//       valueColor: "",
//       subtextColor: analytics?.signalToMeetingSubtextColor ?? "text-gray-400",
//     },
//   ];
 
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
//       {cards.map((card) => (
//         <div
//           key={card.id}
//           className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border border-slate-700"
//         >
//           <p className="text-xs text-gray-400 uppercase tracking-wider">
//             {card.title}
//           </p>
//           <h2 className={`text-6xl font-bold mt-4 ${card.valueColor}`}>
//             {card.value}
//           </h2>
//           <p className={`text-sm mt-3 ${card.subtextColor}`}>{card.subtext}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
 
 
 
export default function KpiCards({
  analytics = {},
}) {
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role =
    currentUser.role?.toLowerCase();

  let cards = [];

  if (role === "admin") {
    cards = [
      {
        id: "customers",
        title: "Customers",
        value:
          analytics.customers || 0,
      },
      {
        id: "users",
        title: "Users",
        value:
          analytics.users || 0,
      },
      {
        id: "campaigns",
        title: "Campaigns",
        value:
          analytics.campaigns || 0,
      },
      {
        id: "leads",
        title: "Leads",
        value:
          analytics.leads || 0,
      },
      {
        id: "meetings",
        title: "Meetings",
        value:
          analytics.meetings || 0,
      },
      {
        id: "replies",
        title: "Replies",
        value:
          analytics.replies || 0,
      },
    ];
  } else if (role === "manager") {
    cards = [
      {
        id: "users",
        title: "Users",
        value:
          analytics.users || 0,
      },
      {
        id: "campaigns",
        title: "Campaigns",
        value:
          analytics.campaigns || 0,
      },
      {
        id: "leads",
        title: "Leads",
        value:
          analytics.leads || 0,
      },
      {
        id: "meetings",
        title: "Meetings",
        value:
          analytics.meetings || 0,
      },
      {
        id: "replies",
        title: "Replies",
        value:
          analytics.replies || 0,
      },
    ];
  } else {
    cards = [
      {
        id: "assignedLeads",
        title: "Assigned Leads",
        value:
          analytics.assignedLeads ||
          0,
      },
      {
        id: "meetings",
        title: "Meetings",
        value:
          analytics.meetings || 0,
      },
      {
        id: "replies",
        title: "Replies",
        value:
          analytics.replies || 0,
      },
      {
        id: "closed",
        title: "Closed",
        value:
          analytics.closed || 0,
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] p-6 rounded-2xl border border-slate-700"
        >
          <p className="text-xs text-gray-400 uppercase">
            {card.title}
          </p>

          <h2 className="text-5xl font-bold mt-4 text-white">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}