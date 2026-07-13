import { useQuery } from "@tanstack/react-query";
import { getPipelineSummary } from "../../services/pipelineService";

export default function useFunnel() {
  return useQuery({
    queryKey: ["pipeline-summary"],
    queryFn: getPipelineSummary,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    // Always reflect live MongoDB funnel counts (Buyers === Messages).
    staleTime: 0,
  });
}