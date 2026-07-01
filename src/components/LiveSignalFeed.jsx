import useGtmPrompt from "../hooks/useGtmPrompt";
import useSignalFeed from "../hooks/queries/useSignalFeed";
import usePersistSignalFeedSearch from "../hooks/usePersistSignalFeedSearch";
import SignalFeedListItem from "./signals/SignalFeedListItem";

function Shell({ children, query, onClear }) {
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
                ? `Showing accounts related to “${query}”`
                : "High-confidence accounts from your database"}
            </p>
          </div>

          {query && (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 text-xs text-gray-400 hover:text-white border border-slate-600 rounded-lg px-3 py-1.5 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export default function LiveSignalFeed() {
  const { query, clearPrompt } = useGtmPrompt();

  const { data, isLoading, isError } = useSignalFeed(query);
  const items = data?.items || [];

  usePersistSignalFeedSearch(query, items);

  const clear = () => clearPrompt();

  const shellProps = { query, onClear: clear };

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
            {query ? "No accounts match that goal" : "No signals yet"}
          </h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">
            {query
              ? "Try a broader campaign goal from the dashboard."
              : "Enter a campaign goal to populate this feed."}
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell {...shellProps}>
      <div className="px-6 py-2 text-xs text-gray-500 border-b border-slate-700/60">
        {items.length} companies
      </div>

      <div className="max-h-[280px] overflow-y-auto p-4 space-y-2">
        {items.map((item, index) => (
          <SignalFeedListItem
            key={item._id}
            item={item}
            index={index}
          />
        ))}
      </div>
    </Shell>
  );
}
