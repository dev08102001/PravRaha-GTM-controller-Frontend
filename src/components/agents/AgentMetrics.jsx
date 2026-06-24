
export default function AgentMetrics({ agent }) {
  return (
    <div className="grid grid-cols-3 gap-8 mt-5">
      <div>
        <p className="text-xs text-gray-500 uppercase">
          Today
        </p>

        <h3 className="text-cyan-400 text-2xl font-bold">
          {agent.today}
        </h3>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase">
          Success
        </p>

        <h3 className="text-green-400 text-2xl font-bold">
          {agent.success}
        </h3>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase">
          Rate
        </p>

        <h3 className="text-white text-2xl font-bold">
          {agent.rate}%
        </h3>
      </div>
    </div>
  );
}