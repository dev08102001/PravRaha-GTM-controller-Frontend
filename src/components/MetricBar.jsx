import useDashboardMetrics from "../hooks/queries/useDashboardMetrics";

export default function MetricBar() {
  const {
    data: metrics,
    isLoading,
    isError,
  } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="bg-[#0E1422] border-b border-gray-800 p-4">
        Loading metrics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0E1422] border-b border-gray-800 p-4 text-red-400">
        Failed to load metrics
      </div>
    );
  }

  const data = [
    {
      title: "Meetings",
      value: metrics.meetings,
    },
    {
      title: "Companies",
      value: metrics.companies,
    },
    {
      title: "Sequences",
      value: metrics.sequences,
    },
    {
      title: "Reply Rate",
      value: metrics.replyRate,
    },
    {
      title: "Signals",
      value: metrics.signals,
    },
  ];

  return (
    <div className="bg-[#0E1422] border-b border-gray-800">
      <div className="grid grid-cols-5">
        {data.map((item, index) => (
          <div
            key={item.title}
            className={`p-5 ${
              index !== data.length - 1
                ? "border-r border-gray-800"
                : ""
            }`}
          >
            <p className="text-gray-500 text-xs uppercase tracking-wider">
              {item.title}
            </p>

            <h3 className="text-3xl font-bold mt-2 text-white">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}