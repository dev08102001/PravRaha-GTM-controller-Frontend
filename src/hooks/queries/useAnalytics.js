// import { useQuery } from "@tanstack/react-query";
// import api from "../../services/api";

// export default function useAnalytics() {
//   return useQuery({
//     queryKey: ["analytics"],
//     queryFn: async () => {
//       const response = await api.get("/analytics");
//       return response.data;
//     },
//   });
// }



import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../../services/analyticsService";

export default function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
    staleTime: 1000 * 30,
    refetchInterval: 30000,
  });
}