import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { campaignMapper } from "../utils/campaignMapper";

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: campaign, isLoading, isError } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const res = await api.get(`/campaigns/${id}`);
      // Backend responds with { success, data: campaign } — unwrap it.
      const raw = res.data?.data || res.data;
      return campaignMapper(raw);
    },
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="p-8 text-white text-xl">
        Loading campaign...
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="p-8 text-red-500 text-xl">
        Failed to load campaign.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-white">
            {campaign.title}
          </h1>

          <p className="text-gray-400 mt-2">
            {campaign.description}
          </p>
        </div>

        <button
          onClick={() => navigate("/campaigns")}
          className="bg-[#24304A] hover:bg-[#30405F] px-5 py-2 rounded-lg text-white"
        >
          ← Back
        </button>
      </div>

      {/* Status */}

      <div className="flex gap-3 flex-wrap">

        <span
          className={`px-4 py-2 rounded-lg font-semibold ${
            campaign.status === "running"
              ? "bg-green-500/20 text-green-400"
              : campaign.status === "paused"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {(campaign.status || "").toUpperCase()}
        </span>

        {(campaign.tags || []).map((tag) => (
          <span
            key={tag}
            className="bg-[#24304A] px-3 py-1 rounded-lg text-gray-300 text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Metrics */}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">

        <MetricCard title="Companies" value={campaign.companies} />

        <MetricCard
          title="Buyers Found"
          value={campaign.buyersFound}
        />

        <MetricCard
          title="Msgs Generated"
          value={campaign.msgsGenerated}
        />

        <MetricCard
          title="Msgs Sent"
          value={campaign.msgsSent}
        />

        <MetricCard
          title="Replies"
          value={campaign.replies}
        />

        <MetricCard
          title="Meetings"
          value={campaign.meetings}
        />

      </div>

      {/* Progress */}

      <div className="bg-[#151D2E] rounded-2xl p-6">

        <div className="flex justify-between mb-4">

          <span className="text-gray-400">
            Campaign Progress
          </span>

          <span className="text-white">
            {campaign.progress}%
          </span>

        </div>

        <div className="h-3 bg-[#24304A] rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500"
            style={{
              width: `${campaign.progress}%`,
            }}
          />

        </div>

      </div>

      {/* Prompt + AI Response (grounded on database) */}

      {(campaign.prompt || campaign.response) && (
        <div className="bg-[#151D2E] rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-white">
            Prompt &amp; AI Response
          </h2>

          {campaign.prompt && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Prompt
              </p>
              <p className="text-gray-200">
                {campaign.prompt}
              </p>
            </div>
          )}

          {campaign.response?.summary && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Summary
              </p>
              <p className="text-gray-200">
                {campaign.response.summary}
              </p>
            </div>
          )}

          {Array.isArray(campaign.response?.insights) &&
            campaign.response.insights.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Insights
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  {campaign.response.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

          {campaign.metadata && (
            <p className="text-xs text-gray-500">
              Source: {campaign.metadata.source || "database"} •{" "}
              {campaign.metadata.dataUsed ?? 0} records used
            </p>
          )}
        </div>
      )}

      {/* Retrieved data (context used by the AI) */}

      {Array.isArray(campaign.retrievedContext) &&
        campaign.retrievedContext.length > 0 && (
          <div className="bg-[#151D2E] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Retrieved Data ({campaign.retrievedContext.length})
            </h2>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {campaign.retrievedContext.map((row, idx) => (
                <div
                  key={idx}
                  className="bg-[#0F1726] border border-slate-700 rounded-xl p-4"
                >
                  <div className="flex justify-between flex-wrap gap-2">
                    <span className="font-semibold text-white">
                      {row.name || row.domain || `Record ${idx + 1}`}
                    </span>
                    {row.industry && (
                      <span className="text-xs text-gray-400">
                        {row.industry}
                      </span>
                    )}
                  </div>

                  {row.employees && (
                    <p className="text-xs text-gray-500 mt-1">
                      Employees: {row.employees}
                    </p>
                  )}

                  {Array.isArray(row.signals) &&
                    row.signals.length > 0 && (
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-300 space-y-1">
                        {row.signals.map((s, i) => (
                          <li key={i}>
                            <span className="text-pink-400">
                              {s.type || "signal"}
                            </span>{" "}
                            {s.summary}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Information */}

      <div className="bg-[#151D2E] rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-white mb-4">
          Campaign Information
        </h2>

        <div className="space-y-3 text-gray-300">

          <p>
            <strong>Goal:</strong> {campaign.goal}
          </p>

          <p>
            <strong>Started:</strong> {campaign.started}
          </p>

          <p>
            <strong>Created At:</strong>{" "}
            {campaign.createdAt
              ? new Date(campaign.createdAt).toLocaleString()
              : "-"}
          </p>

          <p>
            <strong>Channels:</strong>{" "}
            {(campaign.channels || []).join(", ")}
          </p>

          <p>
            <strong>Agents:</strong>{" "}
            {(campaign.agents || []).join(", ")}
          </p>

        </div>

      </div>

    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-[#151D2E] rounded-xl p-5">

      <p className="text-xs uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="text-4xl font-bold text-white mt-2">
        {value}
      </p>

    </div>
  );
}