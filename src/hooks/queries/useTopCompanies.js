import { useQuery } from "@tanstack/react-query";
import { getTopCompanies } from "../../services/companyService";

// Always fetches live companies from the backend MongoDB API.
export default function useTopCompanies(query = "") {
  return useQuery({
    queryKey: ["top-companies", query],
    queryFn: () => getTopCompanies(query),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
