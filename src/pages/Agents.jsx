import { useState } from "react";
import useAgents from "../hooks/queries/useAgents";
import AgentHeader from "../components/agents/AgentHeader";
import AgentCard from "../components/agents/AgentCard";

export default function Agents() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data: agents = [], isLoading } = useAgents({ autoRefresh });

  if (isLoading) {
    return (
      <div className="text-center text-white p-10">
        Loading Agents...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B1A] p-6">
      <AgentHeader autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {agents.map((agent) => (
          <AgentCard
            key={agent._id}
            agent={agent}
          />
        ))}
      </div>
    </div>
  );
}
