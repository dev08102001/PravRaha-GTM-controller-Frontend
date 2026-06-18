import { useQuery } from "@tanstack/react-query";
import { getOutreachMessages } from "../../services/outreachService";

export default function useOutreach() {
  return useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const data = await getOutreachMessages();
      return Array.isArray(data) ? data : [];
    },
  });
}