import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { createAgentSocket } from "../services/agentSocket";
import { launchAgent } from "../services/agentService";

const STATUS_STYLES = {
  PENDING: {
    badge: "bg-slate-600/30 text-slate-300",
    ring: "border-slate-600",
    bar: "from-slate-500 to-slate-400",
    glow: "",
    label: "Pending",
  },
  IDLE: {
    badge: "bg-slate-600/30 text-slate-300",
    ring: "border-slate-600",
    bar: "from-slate-500 to-slate-400",
    glow: "",
    label: "Idle",
  },
  RUNNING: {
    badge: "bg-cyan-500/20 text-cyan-300",
    ring: "border-cyan-400",
    bar: "from-cyan-400 via-blue-500 to-indigo-500",
    glow: "shadow-[0_0_25px_-5px_rgba(34,211,238,0.6)] ring-1 ring-cyan-400/40",
    label: "Running",
  },
  COMPLETED: {
    badge: "bg-emerald-500/20 text-emerald-300",
    ring: "border-emerald-400",
    bar: "from-emerald-400 to-green-500",
    glow: "",
    label: "Completed",
  },
};

const styleFor = (status) =>
  STATUS_STYLES[status] || STATUS_STYLES.PENDING;

export default function Agents() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [agents, setAgents] = useState([]);
  const [running, setRunning] = useState(false);
  const [connected, setConnected] = useState(false);
  const launchedRef = useRef(false);

  // The goal handed over from the Dashboard's "Launch Agents" countdown.
  const goal = location.state?.goal;

  useEffect(() => {
    const socket = createAgentSocket();

    socket.on("connect", () => {
      setConnected(true);

      // Start the pipeline only once, after we're connected, so the client
      // watches the agents run one-by-one starting from the first agent.
      if (goal && !launchedRef.current) {
        launchedRef.current = true;
        // Clear navigation state so a refresh doesn't relaunch.
        navigate(".", { replace: true, state: {} });

        launchAgent(goal)
          .then(() => {
            // Refresh campaigns AND the outreach queue so the page never shows
            // stale messages from a previous run (whose IDs no longer exist).
            queryClient.invalidateQueries({ queryKey: ["campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["outreach"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
          })
          .catch((err) => {
            console.error("Failed to launch agents:", err);
          });
      }
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("agents:snapshot", (data) => {
      setAgents(data.agents || []);
      setRunning(Boolean(data.running));
    });

    socket.on("agent:update", (u) => {
      setAgents((prev) =>
        prev.map((a) => {
          if (String(a._id) !== String(u.id)) return a;

          const logs = u.log
            ? [...(a.logs || []), u.log]
            : a.logs || [];

          return {
            ...a,
            status: u.status ?? a.status,
            progress: u.progress ?? a.progress,
            logs,
            today: u.metrics?.today ?? a.today,
            success: u.metrics?.success ?? a.success,
            rate: u.metrics?.rate ?? a.rate,
          };
        })
      );
    });

    socket.on("sequence:status", (s) => {
      setRunning(Boolean(s.running));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const completedCount = agents.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const idleCount = agents.filter(
    (a) => a.status === "IDLE" || a.status === "PENDING"
  ).length;

  const allIdle =
    agents.length > 0 && idleCount === agents.length && !running;

  const overall = agents.length
    ? Math.round((completedCount / agents.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#050B1A] p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Agent Monitor
            <span
              className={`inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full ${
                connected
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-red-500/15 text-red-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connected
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-red-400"
                }`}
              />
              {connected ? "Live" : "Offline"}
            </span>
          </h1>

          <p className="text-gray-400 mt-1">
            Agents activate only when you launch a prompt from the
            Dashboard. They run sequentially — one after another.
          </p>
        </div>

        {running && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium">
            <span className="w-4 h-4 border-2 border-cyan-300/40 border-t-cyan-300 rounded-full animate-spin" />
            Pipeline running...
          </div>
        )}
      </div>

      {allIdle && (
        <div className="mt-5 bg-[#0D1730] border border-dashed border-[#1B2A52] rounded-2xl p-5 text-center">
          <p className="text-gray-300 font-medium">
            No agent activity yet
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Go to the Dashboard, enter a campaign goal, and click{" "}
            <span className="text-pink-400">Launch Agents</span> to
            start the pipeline.
          </p>
        </div>
      )}

      {/* Overall progress */}
      <div className="mt-6 bg-[#0D1730] border border-[#1B2A52] rounded-2xl p-5">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-300 font-medium">
            Pipeline Progress
          </span>
          <span className="text-gray-400">
            {completedCount} of {agents.length} agents completed
          </span>
        </div>

        <div className="h-3 bg-[#0A1224] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      {/* Pipeline */}
      <div className="mt-8 space-y-0">
        {agents.map((agent, idx) => {
          const s = styleFor(agent.status);
          const isLast = idx === agents.length - 1;
          const isCompleted = agent.status === "COMPLETED";
          const isRunning = agent.status === "RUNNING";

          return (
            <div key={agent._id} className="flex gap-5">
              {/* Timeline rail */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300 ${
                    s.ring
                  } ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-300"
                      : isRunning
                      ? "bg-cyan-500/20 text-cyan-300 animate-pulse"
                      : "bg-[#0D1730] text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    "✓"
                  ) : isRunning ? (
                    <span className="w-4 h-4 border-2 border-cyan-300/40 border-t-cyan-300 rounded-full animate-spin" />
                  ) : (
                    idx + 1
                  )}
                </div>

                {!isLast && (
                  <div className="w-0.5 flex-1 min-h-[60px] my-1 bg-[#1B2A52] relative overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 w-full transition-all duration-700 ${
                        isCompleted
                          ? "h-full bg-gradient-to-b from-emerald-400 to-cyan-400"
                          : "h-0"
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Agent card */}
              <div
                className={`flex-1 mb-6 bg-[#0D1730] border border-[#1B2A52] rounded-2xl p-5 transition-all duration-300 ${s.glow}`}
              >
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h2 className="text-white text-lg font-semibold">
                      {agent.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {agent.description}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold ${s.badge}`}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{agent.progress || 0}%</span>
                  </div>
                  <div className="h-2 bg-[#0A1224] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.bar} transition-all duration-500 ease-out`}
                      style={{ width: `${agent.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mt-5">
                  <Metric
                    label="Processed"
                    value={agent.today || 0}
                    color="text-cyan-400"
                  />
                  <Metric
                    label="Success"
                    value={agent.success || 0}
                    color="text-emerald-400"
                  />
                  <Metric
                    label="Rate"
                    value={`${agent.rate || 0}%`}
                    color="text-white"
                  />
                </div>

                {/* Live logs — only when the agent has activity */}
                {agent.logs &&
                  agent.logs.length > 0 &&
                  agent.status !== "IDLE" && (
                  <div className="bg-black/60 rounded-lg p-3 mt-4 font-mono text-xs h-24 overflow-y-auto">
                    {agent.logs.slice(-6).map((log, i) => (
                      <div
                        key={i}
                        className="text-emerald-400/90 mb-1"
                      >
                        <span className="text-gray-600">
                          ›{" "}
                        </span>
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {agent.status === "IDLE" && (
                  <p className="text-xs text-gray-600 mt-4 italic">
                    Waiting for dashboard launch...
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {agents.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            Waiting for agents...
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}
