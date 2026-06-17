export default function LaunchButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition text-white"
    >
      ⚡ Launch Agents
    </button>
  );
}