import { useQuery } from "@tanstack/react-query";
import { getAgents } from "../../services/agentService";

export default function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
    staleTime: 30000, // Cache for 30 seconds (optional)
  });
}