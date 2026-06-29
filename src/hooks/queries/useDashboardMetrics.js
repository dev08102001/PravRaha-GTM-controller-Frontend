import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../../services/dashboardService";

export default function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: getDashboardMetrics,
    refetchOnMount: "always",
    staleTime: 30_000,
  });
}