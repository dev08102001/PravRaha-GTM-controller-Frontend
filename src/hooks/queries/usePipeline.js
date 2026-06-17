import { useQuery } from "@tanstack/react-query";
import { getPipeline } from "../../services/pipelineService";

const usePipeline = () => {
  return useQuery({
    queryKey: ["pipeline-board"],
    queryFn: getPipeline,
  });
};

export default usePipeline;