import { useQuery } from "@tanstack/react-query";
import { getTopCompanies } from "../../services/companyService";

export default function useTopCompanies(query = "") {
  return useQuery({
    queryKey: ["top-companies", query],
    queryFn: () => getTopCompanies(query),
    refetchOnMount: "always",
    staleTime: 15_000,
  });
}
