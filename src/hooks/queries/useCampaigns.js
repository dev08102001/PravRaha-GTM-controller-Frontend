import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { campaignMapper } from "../../utils/campaignMapper";

export default function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data } = await api.get("/campaigns");

      const campaigns = Array.isArray(data)
        ? data
        : [];

      return campaigns.map(campaignMapper);
    },
  });
}