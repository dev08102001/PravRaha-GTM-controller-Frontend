import api from "./api";

export const getDashboardMetrics = async () => {
  const { data } = await api.get("/dashboard/metrics");
  return data;
};