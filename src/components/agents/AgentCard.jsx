
import AgentMetrics from "./AgentMetrics";
import AgentLogs from "./AgentLogs";
import AgentActivity from "./AgentActivity";

export default function AgentCard({ agent }) {
  const running = agent.status === "RUNNING";

  return (
    <div className="bg-[#0D1730] border border-[#1B2A52] rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-lg font-semibold">
            {agent.name}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            {agent.description}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-md text-xs font-bold
          ${
            running
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {agent.status}
        </span>
      </div>

      <AgentMetrics agent={agent} />

      <AgentActivity activity={agent.activity} />

      <AgentLogs logs={agent.logs} />
    </div>
  );
}