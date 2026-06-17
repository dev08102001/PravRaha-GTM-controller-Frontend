import useFunnel from "../hooks/queries/useFunnel";

export default function PipelineFunnel() {
  const {
    data: items = [],
    isLoading,
    isError,
  } = useFunnel();

  // Safely calculate the maximum value
  const maxValue =
    items.length > 0
      ? Math.max(...items.map((item) => item?.value ?? 0))
      : 1;

  const colors = [
    "from-cyan-500 to-blue-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-pink-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-violet-500",
  ];

  const handleStageClick = (item) => {
    const label = item?.label ?? "Unknown Stage";
    const value = (item?.value ?? 0).toLocaleString();

    alert(`${label}: ${value}`);
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
        Loading pipeline...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-red-400">
        Failed to load pipeline.
      </div>
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-gray-400">
        No pipeline data available.
      </div>
    );
  }

  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-8">
        📊 Pipeline Funnel
      </h2>

      <div className="space-y-6">
        {items.map((item, index) => {
          const barColor =
            typeof item?.color === "string" && item.color.trim()
              ? item.color
              : colors[index % colors.length];

          const barWidth =
            maxValue > 0
              ? ((item?.value ?? 0) / maxValue) * 100
              : 0;

          return (
            <div
              key={item?._id ?? item?.label ?? index}
              onClick={() => handleStageClick(item)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">
                  {item?.label ?? "Unknown Stage"}
                </span>

                <span className="font-bold text-white">
                  {(item?.value ?? 0).toLocaleString()}
                </span>
              </div>

              <div className="h-5 bg-[#24304A] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                  style={{
                    width: `${barWidth}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}







