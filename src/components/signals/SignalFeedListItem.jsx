export default function SignalFeedListItem({
  item,
  index,
  selected = false,
  onSelect,
}) {
  const className = `w-full text-left rounded-xl border p-4 transition-all duration-200 ${
    selected
      ? "border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
      : "border-slate-700/80 bg-[#1A2340]/60 hover:border-slate-600 hover:bg-[#24304A]/80"
  }`;

  const content = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-gray-500 font-bold text-sm shrink-0">
          #{index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-bold text-white truncate">{item.company}</h3>
            {item.formType && (
              <span className="shrink-0 px-1.5 py-0.5 text-[10px] rounded border border-slate-600/80 text-gray-400">
                {item.formType.replace(/^Form\s+/i, "")}
              </span>
            )}
          </div>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[11px] rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
            {item.signal || item.type}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-xl font-bold text-emerald-400">{item.score}</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wide">
          Intent
        </div>
      </div>
    </div>
  );

  if (!onSelect) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button type="button" onClick={() => onSelect(item)} className={className}>
      {content}
    </button>
  );
}
