export default function AgentActivity({ activity = [] }) {
  return (
    <div className="mt-5">
      <h4 className="text-gray-400 text-xs uppercase font-bold mb-3">
        Recent Activity
      </h4>
      <div className="space-y-2 text-sm text-gray-300 max-h-24 overflow-y-auto">
        {activity && activity.length > 0 ? (
          activity.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-cyan-400">→</span>
              <span>{item}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No recent activity.</p>
        )}
      </div>
    </div>
  );
}