import { useQuery } from "@tanstack/react-query";
import { getSignals } from "../../services/signalService";

export default function useSignals() {
  return useQuery({
    queryKey: ["signals"],
    queryFn: getSignals,
  });
}