import { useQuery } from "@tanstack/react-query";
import { getOutreachMessages } from "../../services/outreachService";

export default function useOutreach() {
  return useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const data = await getOutreachMessages();
      return Array.isArray(data) ? data : [];
    },
    // Outreach is regenerated on every campaign launch, so always pull fresh
    // data when the page mounts to avoid acting on deleted messages.
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}