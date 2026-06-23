export default function AgentHeader({ autoRefresh, setAutoRefresh }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Agent Monitor
        </h1>

        <p className="text-gray-400 mt-1">
          Real-time status of all AI agents
        </p>
      </div>

      <button 
        onClick={() => setAutoRefresh(!autoRefresh)}
        className={`font-semibold px-4 py-2 rounded-lg transition-colors ${autoRefresh ? "bg-emerald-500 text-black" : "bg-gray-600 text-white"}`}
      >
        Auto Refresh: {autoRefresh ? "ON" : "OFF"}
      </button>
    </div>
  );
}