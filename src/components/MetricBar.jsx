import { useEffect, useState } from "react";
import api from "../services/api";

export default function MetricBar() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get("/dashboard/metrics");
      setMetrics(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!metrics) {
    return (
      <div className="bg-[#0E1422] border-b border-gray-800 p-4">
        Loading metrics...
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