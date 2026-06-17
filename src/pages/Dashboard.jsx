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






import MeetingAlert from "../components/MeetingAlert";
// import GoalInput from "../components/GoalInput";
import PipelineFunnel from "../components/PipelineFunnel";
import TopCompanies from "../components/TopCompanies";
import LiveSignalFeed from "../components/LiveSignalFeed";
import AgentActivity from "../components/AgentActivity";
import CampaignGoalCard from "../components/campaignGoal/CampaignGoalCard";
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <MeetingAlert />
      
      {/* <GoalInput /> */}
      <CampaignGoalCard />

      <div className="grid lg:grid-cols-2 gap-6">
        <LiveSignalFeed />
        <AgentActivity />
      </div>

  
      <div className="grid lg:grid-cols-2 gap-6">
        <PipelineFunnel />
      <TopCompanies />
      </div>
    </div>
  );
}