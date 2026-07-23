import { useFilingsLiveSignalFeed } from "../hooks/queries/useSignalFeed";
import { useICP } from "../hooks/queries/useICP";
import SignalFeedListItem from "./signals/SignalFeedListItem";

function Shell({ children, total = 0, live = false, icpApplied = false }) {
  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>⚡</span> Live Signal Feed
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {icpApplied
                ? "SEC 6-K · 8-K · 10-K filings matched to your ICP from the database"
                : "SEC Form 6-K, 8-K & 10-K filings streaming live from your database"}
            </p>
          </div>

          {live && (
            <div className="shrink-0 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Live
              </span>
            </div>
          )}
        </div>
      </div>

      {children}

      {total > 0 && (
        <div className="px-6 py-2 text-[11px] text-gray-500 border-t border-slate-700/60">
          {icpApplied
            ? `${total.toLocaleString()} ICP-matched SEC filings (6-K · 8-K · 10-K)`
            : `Streaming from ${total.toLocaleString()} SEC filings (6-K · 8-K · 10-K)`}
        </div>
      )}
    </div>
  );
}

export default function LiveSignalFeed() {
  const { data: icp } = useICP();
  const icpKey = icp
    ? [
        ...(icp.industries || []),
        ...(icp.employeeRange || []),
        ...(icp.geographies || []),
        ...(icp.techStack || []),
        ...(icp.fundingStage || []),
        ...(icp.revenueStage || []),
      ].join("|")
    : "no-icp";

  const { data, isLoading, isError, isFetching, error, refetch } =
    useFilingsLiveSignalFeed({
      limit: 8,
      pollMs: 4000,
      icpKey,
    });

  const items = data?.items || [];
  const total = data?.total || 0;
  const dbStats = data?.dbStats || {};
  const icpApplied = Boolean(data?.icpApplied);
  const shellProps = { total, live: items.length > 0, icpApplied };

  const errorDetail =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to load SEC filings from database";

  if (isLoading) {
    return (
      <Shell {...shellProps}>
        <div className="p-6 text-gray-400">
          {icp
            ? "Loading ICP-matched SEC filings from database…"
            : "Connecting to live SEC filing feed…"}
        </div>
      </Shell>
    );
  }

  if (isError) {
    const offline =
      !error?.response &&
      /network|failed to fetch|err_connection|econnrefused/i.test(
        String(errorDetail)
      );

    return (
      <Shell {...shellProps}>
        <div className="p-6 space-y-3">
          <p className="text-red-400">
            {offline
              ? "Backend is not running on port 9077. Start it, then retry."
              : errorDetail}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs rounded-lg border border-slate-600 px-3 py-1.5 text-gray-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            Retry
          </button>
        </div>
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
            {icpApplied
              ? "No filings match your ICP"
              : "No SEC filings in database"}
          </h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">
            {icpApplied
              ? "No 6-K, 8-K, or 10-K filings match your current ICP selections. Adjust industries or company size in ICP Config."
              : "Import Form 6-K, 8-K, or 10-K filing data into the corresponding collections to populate this live feed."}
          </p>
        </div>
      </Shell>
    );
  }

  const statsLabel = [
    dbStats.sixKFilings != null ? `6-K ${dbStats.sixKFilings}` : null,
    dbStats.eightKFilings != null ? `8-K ${dbStats.eightKFilings}` : null,
    dbStats.tenKFilings != null ? `10-K ${dbStats.tenKFilings}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const industryHint = (data?.icp?.industries || []).slice(0, 2).join(", ");

  return (
    <Shell {...shellProps}>
      <div className="px-6 py-2 text-xs text-gray-500 border-b border-slate-700/60 flex items-center justify-between gap-2">
        <span>
          {items.length} companies showing live
          {isFetching ? " · updating…" : ""}
          {icpApplied && industryHint ? ` · ICP: ${industryHint}` : ""}
        </span>
        <span className="text-emerald-400/80">
          {icpApplied ? `ICP · ${statsLabel}` : statsLabel || "Form 6-K · 8-K · 10-K"}
        </span>
      </div>

      <div className="max-h-[280px] overflow-y-auto p-4 space-y-2">
        {items.map((item, index) => (
          <div
            key={`${item.formType || "filing"}-${item._id}-${index}`}
            className="animate-[fadeSlide_0.45s_ease-out]"
          >
            <SignalFeedListItem item={item} index={index} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Shell>
  );
}
