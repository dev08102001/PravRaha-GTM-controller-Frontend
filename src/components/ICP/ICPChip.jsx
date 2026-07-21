export default function ICPChip({
  selected,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border text-sm transition-all duration-200
      ${
        selected
          ? "bg-cyan-500 border-cyan-500 text-white"
          : "bg-[#24304A] border-slate-600 text-gray-300 hover:bg-[#30405F]"
      }`}
    >
      {label}
    </button>
  );
}