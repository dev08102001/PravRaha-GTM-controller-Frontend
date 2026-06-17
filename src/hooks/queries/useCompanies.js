import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../../services/companyService";

export default function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    staleTime: 30000,
  });
}