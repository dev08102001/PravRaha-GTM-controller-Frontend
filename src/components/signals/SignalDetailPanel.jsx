const urgencyStyles = {
  high: "bg-red-500/15 text-red-300 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

function DetailChip({ label, value }) {
  if (!value) return null;
  return (
    <div className="bg-[#0E1426]/80 border border-slate-700/80 rounded-xl px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
        {label}
      </p>
      <p className="text-sm text-white font-medium mt-1">{value}</p>
    </div>
  );
}

export default function SignalDetailPanel({ item }) {
  if (!item) {
    return (
      <div className="h-full min-h-[420px] bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center p-10">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl mb-4">
          🏢
        </div>
        <h3 className="text-lg font-semibold text-white">
          Select a company
        </h3>
        <p className="text-gray-400 text-sm mt-2 max-w-xs">
          Choose an account from the feed to view full signal intelligence.
        </p>
      </div>
    );
  }

  const urgencyClass =
    urgencyStyles[item.urgency] || urgencyStyles.medium;

  return (
    <div className="h-full bg-gradient-to-br from-[#1A2340] via-[#171f35] to-[#151D2E] border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-700/80 bg-[#0E1426]/40">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
              Account Details
            </p>
            <h2 className="text-3xl font-bold text-white truncate">
              {item.company}
            </h2>
            {item.contact?.name && (
              <p className="text-gray-400 text-sm mt-1">
                {item.contact.name}
                {item.contact.jobTitle ? ` · ${item.contact.jobTitle}` : ""}
              </p>
            )}
          </div>

          <div className="shrink-0 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-emerald-400 leading-none">
                {item.score}
              </span>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
                Intent
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {item.signal || item.type}
          </span>
          <span
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${urgencyClass}`}
          >
            {item.urgency} urgency
          </span>
          {item.timeAgo && (
            <span className="px-3 py-1 text-xs rounded-full bg-slate-700/60 text-slate-300">
              {item.timeAgo}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <DetailChip label="Industry" value={item.industry} />
          <DetailChip
            label="Employees"
            value={item.employees ? `${item.employees}` : null}
          />
          <DetailChip label="Domain" value={item.domain} />
          <DetailChip label="Sentiment" value={item.sentiment} />
        </div>

        {item.description && (
          <div className="bg-[#0E1426]/60 border border-slate-700/80 rounded-xl p-5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
              Signal Summary
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.description}
            </p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-700/80 bg-[#0E1426]/30">
        <button
          type="button"
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-900/20"
        >
          + Add to Sequence
        </button>
      </div>
    </div>
  );
}
