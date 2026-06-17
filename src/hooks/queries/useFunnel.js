import { useQuery } from "@tanstack/react-query";
import { getPipelineSummary } from "../../services/pipelineService";

export default function useFunnel() {
  return useQuery({
    queryKey: ["pipeline-summary"],
    queryFn: getPipelineSummary,
    staleTime: 30000,
  });
}