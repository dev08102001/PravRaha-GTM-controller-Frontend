import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { campaignMapper } from "../../utils/campaignMapper";

export default function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await api.get("/campaigns");

      const campaigns = Array.isArray(
        response.data?.data
      )
        ? response.data.data
        : [];

      return campaigns.map(campaignMapper);
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
    // Keep Replies metric fresh while campaigns are running.
    refetchInterval: (query) => {
      const list = query.state.data || [];
      const hasRunning = list.some((c) => c.status === "running");
      return hasRunning ? 30_000 : 60_000;
    },
  });
}