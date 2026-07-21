import { useQuery } from "@tanstack/react-query";
import {
  getSignalFeed,
  getFilingsSignalFeed,
} from "../../services/signalService";

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

/*
| Live SEC filing feed for the dashboard widget (6-K + 8-K + 10-K).
| Polls + advances offset so companies appear to stream live.
*/
export function useFilingsLiveSignalFeed({
  limit = 8,
  pollMs = 4000,
  enabled = true,
  icpKey = "default",
} = {}) {
  return useQuery({
    queryKey: ["signal-feed", "filings", limit, icpKey],
    queryFn: async () => {
      // Advance window each poll so the visible companies keep changing.
      const tick = Math.floor(Date.now() / pollMs);
      const offset = (tick * Math.max(1, Math.floor(limit / 2))) % 1000;
      return getFilingsSignalFeed({ limit, offset, source: "filings" });
    },
    enabled,
    refetchInterval: pollMs,
    refetchIntervalInBackground: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

/** @deprecated Prefer useFilingsLiveSignalFeed. */
export function useSixKLiveSignalFeed(options) {
  return useFilingsLiveSignalFeed(options);
}
