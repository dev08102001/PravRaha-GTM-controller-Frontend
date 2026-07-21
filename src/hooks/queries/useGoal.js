import { useQuery } from "@tanstack/react-query";
import { getGoal } from "../../services/goalService";

export default function useGoal() {
  return useQuery({
    queryKey: ["goal"],
    queryFn: getGoal,
    staleTime: 1000 * 60,
    retry: 3,
    refetchOnWindowFocus: false,
  });
}