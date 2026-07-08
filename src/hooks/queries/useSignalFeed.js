import { useQuery } from "@tanstack/react-query";
import { getSignalFeed } from "../../services/signalService";

// Always fetches live signals from the backend MongoDB API.
export default function useSignalFeed(query = "") {
  return useQuery({
    queryKey: ["signal-feed", query],
    queryFn: () => getSignalFeed(query),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
