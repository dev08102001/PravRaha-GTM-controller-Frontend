import api from "./api";

export const getCompanies = async () => {
  const { data } = await api.get("/companies");
  return data;
};

// Top target companies from the knowledge base, optionally ranked by a prompt.
export const getTopCompanies = async (q = "") => {
  const { data } = await api.get("/companies/top", {
    params: q ? { q } : {},
  });
  return data;
};