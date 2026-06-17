import api from "./api";

export const getCompanies = async () => {
  const { data } = await api.get("/companies");
  return data;
};