import { useQuery } from "@tanstack/react-query";
import { getAgentActivity } from "../../services/agentService";

export default function useAgentActivity(agentId) {
  return useQuery({
    queryKey: ["agentActivity", agentId],
    queryFn: () => getAgentActivity(agentId),
    enabled: !!agentId,
  });
}