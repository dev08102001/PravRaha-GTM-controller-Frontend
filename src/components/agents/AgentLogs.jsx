
export default function AgentLogs({ logs = [] }) {
  return (
    <div className="bg-black rounded-lg p-4 mt-4 font-mono text-sm h-32 overflow-y-auto">
      {logs && logs.length > 0 ? (
        logs.map((log, index) => (
          <div
            key={index}
            className="text-emerald-400 mb-2"
          >
            [✓] {log}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No logs available.</p>
      )}
    </div>
  );
}