// import { useEffect, useState } from "react";
// import KpiCards from "./KpiCards";
// import ChannelPerformance from "./ChannelPerformance";
// import MeetingsChart from "./MeetingsChart";
// import SignalsTable from "./SignalsTable";
 
// export default function Dashboard() {
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
 
//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/analytics");
//         const data = await response.json();
//         setAnalytics(data);
//       } catch (error) {
//         console.error("Failed to fetch analytics:", error);
//         setAnalytics(null);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchAnalytics();
//     const interval = setInterval(fetchAnalytics, 30000); // auto-refresh every 30s
//     return () => clearInterval(interval);
//   }, []);
 
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[500px]">
//         <p className="text-white text-xl">Loading Analytics...</p>
//       </div>
//     );
//   }
 
//   if (!analytics) {
//     return (
//       <div className="flex items-center justify-center h-[500px]">
//         <p className="text-red-500 text-xl">Failed to load Analytics</p>
//       </div>
//     );
//   }
 
//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-4xl font-bold text-white">Analytics & Attribution</h1>
//         <p className="text-gray-400 mt-2">
//           Performance insights across signals, channels and campaigns
//         </p>
//       </div>
 
//       <KpiCards analytics={analytics} />
 
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         <ChannelPerformance channelData={analytics.channelData} />
//         <MeetingsChart meetingsData={analytics.meetings} />
//       </div>
 
//       <SignalsTable signalData={analytics.signalData} />
//     </div>
//   );
// }
 
 
 
 
 
 
 
 
 
 
// export default function MeetingsChart({ meetingsData }) {
//   const data = Array.isArray(meetingsData)
//     ? meetingsData
//     : meetingsData?.values || [];
 
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border border-slate-700">
//         <h2 className="text-xl font-bold mb-6">Meetings Booked (30 Days)</h2>
//         <div className="text-gray-400">No meeting data available.</div>
//       </div>
//     );
//   }
 
//   const values = data.map((item) =>
//     typeof item === "number" ? item : item.count ?? item.value ?? 0
//   );
 
//   return (
//     <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border border-slate-700">
//       <h2 className="text-xl font-bold mb-6">Meetings Booked (30 Days)</h2>
 
//       <div className="flex justify-between items-end h-52">
//         {values.map((value, index) => (
//           <div key={index} className="flex flex-col items-center gap-2">
//             <div className="text-green-400 text-sm">{value}</div>
 
//             <div
//               className="bg-gradient-to-t from-cyan-500 to-pink-500 rounded w-10"
//               style={{
//                 height: `${Math.max(1, value) * 12}px`,
//               }}
//             />
 
//             <div className="text-xs text-gray-400">Day {index + 1}</div>
//           </div>
//         ))}
//       </div>
 
//       <p className="mt-5 text-sm text-gray-400">
//         Total this period: {values.reduce((a, b) => a + b, 0)} meetings
//       </p>
//     </div>
//   );
// }
 
 
 
 
 
 
 
export default function MeetingsChart({ meetingsData = [] }) {
  const data = Array.isArray(meetingsData)
    ? meetingsData
    : meetingsData?.values || [];
 
  const values = data.map((item) =>
    typeof item === "number" ? item : Number(item?.value || item?.count || 0)
  );
 
  if (!values.length) {
    return (
      <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] p-6 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold mb-6">Meetings (30 Days)</h2>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }
 
  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] p-6 rounded-2xl border border-slate-700">
      <h2 className="text-xl font-bold mb-6">Meetings (30 Days)</h2>
 
      <div className="flex items-end justify-between h-52">
        {values.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="text-green-400 text-sm">{value}</div>
 
            <div
              className="bg-gradient-to-t from-cyan-500 to-pink-500 w-10 rounded"
              style={{
                height: `${Math.max(1, Number(value)) * 10}px`,
              }}
            />
 
            <div className="text-xs text-gray-400">Day {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}