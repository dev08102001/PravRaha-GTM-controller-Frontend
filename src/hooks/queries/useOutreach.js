import { useQuery } from "@tanstack/react-query";
import { getOutreachMessages } from "../../services/outreachService";

export default function useOutreach() {
  return useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const data = await getOutreachMessages();
      return Array.isArray(data) ? data : [];
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchInterval: (query) => {
      const list = query.state.data || [];
      const hasActive = list.some((m) =>
        ["QUEUED", "SENDING"].includes((m.status || "").toUpperCase())
      );
      return hasActive ? 5000 : false;
    },
  });
}