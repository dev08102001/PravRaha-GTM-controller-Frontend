import { useEffect, useState } from "react";
import useSignalFeed from "../hooks/queries/useSignalFeed";

const urgencyStyles = {
  high: "bg-red-500/15 text-red-300 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

function Shell({ children, query, search, setSearch, onSubmit, onClear }) {
  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>⚡</span> Live Signal Feed
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {query
                ? `Signals related to “${query}”`
                : "High-confidence buying signals from your database"}
            </p>
          </div>

          {query && (
            <button
              onClick={onClear}
              className="shrink-0 text-xs text-gray-400 hover:text-white border border-slate-600 rounded-lg px-3 py-1.5 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search box — type a prompt to filter the feed from the DB */}
        <form onSubmit={onSubmit} className="mt-4 flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search signals (e.g. cybersecurity, fintech, hiring)…"
            className="flex-1 bg-[#0E1426] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>
      </div>

      {children}
    </div>
  );
}

export default function LiveSignalFeed() {
  // Initialise from the last campaign-goal prompt (if any).
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem("gtm:lastPrompt") || "";
    } catch {
      return "";
    }
  });
  const [search, setSearch] = useState(query);

  // React to a new campaign goal being launched on the dashboard.
  useEffect(() => {
    const onPrompt = (e) => {
      const next = e.detail || "";
      setQuery(next);
      setSearch(next);
    };
    window.addEventListener("gtm:prompt", onPrompt);
    return () => window.removeEventListener("gtm:prompt", onPrompt);
  }, []);

  const { data, isLoading, isError } = useSignalFeed(query);
  const items = data?.items || [];

  const submit = (e) => {
    e.preventDefault();
    setQuery(search.trim());
  };

  const clear = () => {
    setQuery("");
    setSearch("");
    try {
      localStorage.removeItem("gtm:lastPrompt");
    } catch {
      /* ignore */
    }
  };

  const shellProps = {
    query,
    search,
    setSearch,
    onSubmit: submit,
    onClear: clear,
  };

  if (isLoading) {
    return (
      <Shell {...shellProps}>
        <div className="p-6 text-gray-400">Loading signals…</div>
      </Shell>
    );
  }

  if (isError) {
    return (
      <Shell {...shellProps}>
        <div className="p-6 text-red-400">Failed to load signals</div>
      </Shell>
    );
  }

  if (items.length === 0) {
    return (
      <Shell {...shellProps}>
        <div className="flex flex-col items-center justify-center text-center px-6 py-14">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl mb-4">
            ⚡
          </div>
          <h3 className="text-base font-semibold text-white">
            {query ? "No signals match that prompt" : "No signals yet"}
          </h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">
            {query
              ? "Try a broader term like “software”, “financial”, or “hiring”."
              : "Signals from your database will appear here."}
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell {...shellProps}>
      <div className="px-6 py-2 text-xs text-gray-500 border-b border-slate-700/60">
        Showing {items.length}
        {data?.total > items.length ? ` of ${data.total}` : ""} signals
      </div>

      <div className="max-h-[460px] overflow-y-auto">
        {items.map((signal) => (
          <div
            key={signal._id}
            className="flex justify-between items-start gap-3 p-5 border-b border-slate-700 last:border-b-0 hover:bg-white/[0.02] transition-colors"
          >
            <div className="min-w-0">
              <h3 className="font-bold text-lg truncate">
                {signal.company}
                {signal.contact?.name && (
                  <span className="text-gray-400 font-normal text-sm">
                    {" "}
                    · {signal.contact.name}
                  </span>
                )}
              </h3>

              <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                {signal.description}
              </p>

              <div className="flex items-center flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300">
                  {signal.type}
                </span>

                {signal.industry && (
                  <span className="px-3 py-1 text-xs rounded-full bg-slate-700/60 text-slate-300">
                    {signal.industry}
                  </span>
                )}

                <span
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                    urgencyStyles[signal.urgency] || urgencyStyles.medium
                  }`}
                >
                  {signal.urgency}
                </span>

                <span className="text-xs text-gray-500">{signal.timeAgo}</span>
              </div>
            </div>

            <div className="text-cyan-400 text-2xl font-bold shrink-0">
              {signal.score}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
