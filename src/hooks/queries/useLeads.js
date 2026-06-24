import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data } = await api.get(
        "/leads"
      );

      return data?.data || [];
    },
  });
}