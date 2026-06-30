import { useQuery } from "@tanstack/react-query";
import { getSignalFeed } from "../../services/signalService";

export default function useSignalFeed(query = "") {
  return useQuery({
    queryKey: ["signal-feed", query],
    queryFn: () => getSignalFeed(query),
    refetchOnMount: "always",
    staleTime: 15_000,
  });
}
