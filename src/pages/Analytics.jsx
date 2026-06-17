// import useAnalytics from "../hooks/queries/useAnalytics";
// import KpiCards from "../components/Analytics/KpiCards";
// import ChannelPerformance from "../components/Analytics/ChannelPerformance";
// import MeetingsChart from "../components/Analytics/MeetingsChart";
// import SignalsTable from "../components/Analytics/SignalsTable";
 
// export default function Analytics() {
//   const { data: analytics, isLoading, isError } = useAnalytics();
 
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[500px]">
//         <div className="text-white text-xl">
//           Loading Analytics...
//         </div>
//       </div>
//     );
//   }
 
//   if (isError || !analytics) {
//     return (
//       <div className="flex items-center justify-center h-[500px]">
//         <div className="text-red-500 text-xl">
//           Failed to load Analytics
//         </div>
//       </div>
//     );
//   }
 
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-4xl font-bold text-white">
//           Analytics & Attribution
//         </h1>
 
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
 
 
 
 
 
import useAnalytics from "../hooks/queries/useAnalytics";
import KpiCards from "../components/Analytics/KpiCards";
import ChannelPerformance from "../components/Analytics/ChannelPerformance";
import MeetingsChart from "../components/Analytics/MeetingsChart";
import SignalsTable from "../components/Analytics/SignalsTable";
 
export default function Analytics() {
  const { data: analytics, isLoading, isError } = useAnalytics();
 
  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-white text-xl">
          Loading Analytics...
        </div>
      </div>
    );
  }
 
  // ERROR / EMPTY STATE
  if (isError || !analytics) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-red-500 text-xl">
          Failed to load Analytics
        </div>
      </div>
    );
  }
 
  // MAIN UI
  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Analytics & Attribution
        </h1>
 
        <p className="text-gray-400 mt-2">
          Performance insights across signals, channels and campaigns
        </p>
      </div>
 
      {/* KPI SECTION */}
      <KpiCards analytics={analytics} />
 
      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChannelPerformance
          channelData={analytics?.channelData || []}
        />
 
        <MeetingsChart
          meetingsData={analytics?.meetings || []}
        />
      </div>
 
      {/* TABLE SECTION */}
      <SignalsTable
        signalData={analytics?.signalData || []}
      />
    </div>
  );
}