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
 
 
 
 
 

import { Navigate } from "react-router-dom";
import useAnalytics from "../hooks/queries/useAnalytics";
import KpiCards from "../components/Analytics/KpiCards";

export default function Analytics() {
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const currentRole =
    currentUser.role?.toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | RBAC PROTECTION
  |--------------------------------------------------------------------------
  */
  {currentRole === "user" && (
  <div className="grid grid-cols-2 gap-6">
    <div>
      <p className="text-gray-400">
        Assigned Leads
      </p>

      <p className="text-3xl font-bold text-white">
        {analytics.assignedLeads || 0}
      </p>
    </div>

    <div>
      <p className="text-gray-400">
        Replies
      </p>

      <p className="text-3xl font-bold text-white">
        {analytics.replies || 0}
      </p>
    </div>

    <div>
      <p className="text-gray-400">
        Meetings
      </p>

      <p className="text-3xl font-bold text-white">
        {analytics.meetings || 0}
      </p>
    </div>

    <div>
      <p className="text-gray-400">
        Closed
      </p>

      <p className="text-3xl font-bold text-white">
        {analytics.closed || 0}
      </p>
    </div>
  </div>
)}

  const {
    data: analyticsResponse,
    isLoading,
    isError,
  } = useAnalytics();

  const analytics =
    analyticsResponse?.data || {};

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-white text-xl">
          Loading Analytics...
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */
  if (isError) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-red-500 text-xl">
          Failed to load Analytics
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Analytics
        </h1>

        <p className="text-gray-400 mt-2">
          Live analytics generated from
          Campaigns, Leads, Users and Customers
        </p>
      </div>

      {/* KPI Cards */}
      <KpiCards analytics={analytics} />

      {/* Summary */}
      <div className="bg-[#151D2E] rounded-2xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">
          Analytics Overview
        </h2>

        {currentRole === "admin" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400">
                Customers
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.customers || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Managers
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.managers || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Users
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.users || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Campaigns
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.campaigns || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Leads
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.leads || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Meetings
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.meetings || 0}
              </p>
            </div>
          </div>
        )}

        {currentRole === "manager" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400">
                Team Users
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.users || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Campaigns
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.campaigns || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Leads
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.leads || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Replies
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.replies || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Meetings
              </p>
              <p className="text-3xl font-bold text-white">
                {analytics.meetings || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}