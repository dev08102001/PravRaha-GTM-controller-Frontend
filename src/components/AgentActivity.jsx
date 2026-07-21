import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAgents from "../hooks/queries/useAgents";

// Pick a colour for a log line based on its content so the console reads
// like a real execution log (started/completed/errors/metrics stand out).
const lineClass = (text = "") => {
  const t = text.toLowerCase();
  if (t.includes("error") || t.includes("failed")) return "text-red-400";
  if (t.includes("completed")) return "text-emerald-400";
  if (t.includes("started")) return "text-cyan-300";
  if (/\d/.test(t)) return "text-emerald-300";
  return "text-slate-300";
};

function CardShell({ children, onMonitor, live }) {
  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🤖</span> Agent Activity
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Real-time agent task execution log
          </p>
        </div>

        <div className="flex items-center gap-4">
          {live && (
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              Live
            </span>
          )}

          <button
            onClick={onMonitor}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Monitor →
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

function EmptyState({ onMonitor }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-3xl">
          🤖
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white">
        No agents running yet
      </h3>
      <p className="text-gray-400 text-sm mt-2 max-w-xs">
        Launch a campaign goal and your AI agents will start working the
        pipeline here in real time.
      </p>

      <button
        onClick={onMonitor}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Open Agent Monitor →
      </button>
    </div>
  );
}

export default function AgentActivity() {
  const navigate = useNavigate();
  const { data: agents = [], isLoading, isError } = useAgents();

  const goToMonitor = () => navigate("/agents");

  // Flatten every agent's logs (in pipeline order) into one console feed.
  const allLogs = useMemo(() => {
    const lines = [];
    for (const agent of agents) {
      for (const log of agent.logs || []) {
        lines.push({ agent: agent.name, text: log });
      }
    }
    return lines;
  }, [agents]);

  // Signature changes only when the actual log content changes, so polling
  // with identical data doesn't restart the streaming animation.
  const signature = useMemo(
    () => allLogs.map((l) => l.text).join("|"),
    [allLogs]
  );

  // Reveal lines one-by-one so the console looks like it is actively running.
  const [visible, setVisible] = useState(0);
  const timerRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setVisible(0);
    if (allLogs.length === 0) return;

    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= allLogs.length) clearInterval(timerRef.current);
    }, 320);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  // Keep the newest line in view by scrolling ONLY the log container — never
  // the page itself (scrollIntoView would drag the whole dashboard down).
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible]);

  if (isLoading) {
    return (
      <CardShell onMonitor={goToMonitor}>
        <div className="p-4 bg-[#0B1020] m-4 rounded-xl border border-slate-800 font-mono text-sm space-y-2 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-slate-700/60 rounded w-3/4" />
          ))}
        </div>
      </CardShell>
    );
  }

  if (isError) {
    return (
      <CardShell onMonitor={goToMonitor}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>
          <h3 className="text-base font-semibold text-white">
            Couldn't load agent activity
          </h3>
        </div>
      </CardShell>
    );
  }

  if (allLogs.length === 0) {
    return (
      <CardShell onMonitor={goToMonitor}>
        <EmptyState onMonitor={goToMonitor} />
      </CardShell>
    );
  }

  const streaming = visible < allLogs.length;
  const shown = allLogs.slice(0, visible);

  return (
    <CardShell onMonitor={goToMonitor} live>
      <div className="p-4">
        {/* Terminal window */}
        <div className="rounded-xl border border-slate-800 bg-[#0B1020] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-[#0E1426]">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs text-slate-500 font-mono">
              agent-pipeline — execution log
            </span>
          </div>

          {/* Log stream */}
          <div
            ref={logRef}
            className="p-4 max-h-[460px] overflow-y-auto font-mono text-sm leading-relaxed"
          >
            <style>{`
              @keyframes agentLineIn {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            {shown.map((line, idx) => (
              <div
                key={idx}
                className="flex gap-2"
                style={{ animation: "agentLineIn 0.25s ease-out" }}
              >
                <span className="text-cyan-500 select-none">›</span>
                <span className={lineClass(line.text)}>{line.text}</span>
              </div>
            ))}

            {/* Blinking cursor — makes it feel like a live, running console */}
            <div className="flex gap-2 mt-1">
              <span className="text-cyan-500 select-none">›</span>
              <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500 text-center">
          {streaming
            ? "Streaming agent execution log…"
            : `Pipeline log · ${allLogs.length} events from ${agents.length} agents`}
        </p>
      </div>
    </CardShell>
  );
}
