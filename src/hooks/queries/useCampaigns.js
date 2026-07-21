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
  });
}