// import MeetingAlert from "../components/MeetingAlert";
// import GoalInput from "../components/GoalInput";
// import PipelineFunnel from "../components/PipelineFunnel";
// import TopCompanies from "../components/TopCompanies";

// import useSignals from "../hooks/queries/useSignals";
// import useAgents from "../hooks/queries/useAgents";

// export default function Dashboard() {
//   const { data: signals = [], isLoading: isLoadingSignals, isError: isErrorSignals } = useSignals();
//   const { data: agents = [], isLoading: isLoadingAgents, isError: isErrorAgents } = useAgents();

//   if (isLoadingSignals || isLoadingAgents) {
//     return <div className="text-white text-xl flex justify-center items-center h-64">Loading Dashboard...</div>;
//   }

//   if (isErrorSignals || isErrorAgents) {
//     return <div className="text-red-400 text-xl flex justify-center items-center h-64">Failed to load dashboard data. Please try again.</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <MeetingAlert />
//       <GoalInput />
//       <PipelineFunnel signals={signals} />
//       <TopCompanies agents={agents} />

      
//     </div>
//   );
// }








import useAnalytics from "../hooks/queries/useAnalytics";

import MeetingAlert from "../components/MeetingAlert";
import PipelineFunnel from "../components/PipelineFunnel";
import TopCompanies from "../components/TopCompanies";
import LiveSignalFeed from "../components/LiveSignalFeed";
import AgentActivity from "../components/AgentActivity";
import CampaignGoalCard from "../components/campaignGoal/CampaignGoalCard";

function StatCard({ title, value }) {
  return (
    <div className="bg-[#151D2E] p-6 rounded-2xl border border-slate-700">
      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-white mt-2">
        {value}
      </h2>
    </div>
  );
}

export default function Dashboard() {
  let currentUser = {};

  try {
    currentUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    currentUser = {};
  }

  const role =
    currentUser.role?.toLowerCase();

  const {
    data: analyticsResponse,
    isLoading,
    isError,
  } = useAnalytics();

  const analytics =
    analyticsResponse?.data || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-white text-xl">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-red-500 text-xl">
          Failed to load dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------- */}
      {/* ROLE BASED KPI CARDS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {role === "admin" && (
          <>
            <StatCard
              title="Customers"
              value={analytics.customers || 0}
            />

            <StatCard
              title="Managers"
              value={analytics.managers || 0}
            />

            <StatCard
              title="Users"
              value={analytics.users || 0}
            />

            <StatCard
              title="Campaigns"
              value={analytics.campaigns || 0}
            />
          </>
        )}

        {role === "manager" && (
          <>
            <StatCard
              title="Team Users"
              value={analytics.users || 0}
            />

            <StatCard
              title="Campaigns"
              value={analytics.campaigns || 0}
            />

            <StatCard
              title="Leads"
              value={analytics.leads || 0}
            />

            <StatCard
              title="Meetings"
              value={analytics.meetings || 0}
            />
          </>
        )}

        {role === "user" && (
          <>
            <StatCard
              title="Assigned Leads"
              value={
                analytics.assignedLeads || 0
              }
            />

            <StatCard
              title="Replies"
              value={
                analytics.replies || 0
              }
            />

            <StatCard
              title="Meetings"
              value={
                analytics.meetings || 0
              }
            />

            <StatCard
              title="Closed"
              value={
                analytics.closed || 0
              }
            />
          </>
        )}
      </div>

      {/* -------------------------------- */}
      {/* ALERTS */}
      {/* -------------------------------- */}

      <MeetingAlert />

      {/* -------------------------------- */}
      {/* CAMPAIGN GOAL */}
      {/* -------------------------------- */}

      <CampaignGoalCard />

      {/* -------------------------------- */}
      {/* SIGNALS + AGENTS */}
      {/* -------------------------------- */}

      <div className="grid lg:grid-cols-2 gap-6">
        <LiveSignalFeed />
        <AgentActivity />
      </div>

      {/* -------------------------------- */}
      {/* PIPELINE + TOP COMPANIES */}
      {/* -------------------------------- */}

      <div className="grid lg:grid-cols-2 gap-6">
        <PipelineFunnel />
        <TopCompanies />
      </div>
    </div>
  );
}