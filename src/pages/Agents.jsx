import { useEffect, useState } from "react";
import api from "../services/api";

export default function Agents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get("/agents");
      setAgents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Agent Monitor
          </h1>

          <p className="text-gray-400 mt-2">
            Real-time status of all AI agents in your workspace
          </p>
        </div>

        {/* <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl font-medium">
          Auto-refresh: ON
        </div> */}
        <button
          onClick={() => alert("Auto-refresh toggled")}
          className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl font-medium"
    >
      Auto-refresh: ON
    </button>
      </div>

      {/* Agent Cards */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border border-slate-700"
          >
            {/* Header */}

            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                <h2 className="text-xl font-bold">
                  {agent.name}
                </h2>
              </div>

              <span
                className={`${agent.statusColor} text-white text-xs font-bold px-4 py-2 rounded-lg`}
              >
                {agent.status}
              </span>
            </div>

            {/* Description */}

            <div className="bg-[#24304A] rounded-xl p-4 text-sm text-gray-300 mb-5">
              {agent.description}
            </div>

            {/* Metrics */}

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Today
                </div>

                <div className="text-4xl font-bold text-orange-400 mt-1">
                  {agent.today}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Success
                </div>

                <div className="text-4xl font-bold text-green-400 mt-1">
                  {agent.success}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Rate
                </div>

                <div className="text-4xl font-bold text-white mt-1">
                  {agent.rate}
                </div>
              </div>
            </div>

            {/* Logs */}

            <div className="bg-[#0B1220] border border-slate-800 rounded-xl p-4 font-mono text-sm h-[220px] overflow-y-auto">
              <div className="space-y-2">
                {agent.logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-green-300"
                  >
                    ▶ {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}