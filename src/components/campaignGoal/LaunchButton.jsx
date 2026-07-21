export default function LaunchButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition text-white disabled:opacity-60"
    >
      {label || "⚡ Launch Agents"}
    </button>
  );
}
