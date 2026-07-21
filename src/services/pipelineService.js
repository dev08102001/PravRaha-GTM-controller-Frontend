import api from "./api";

export const getPipeline = async () => {
  const { data } = await api.get("/pipeline-board");
  return data;
};

// Live GTM funnel computed from real campaigns + outreach + leads.
export const getPipelineSummary = async () => {
  const { data } = await api.get("/dashboard/funnel");
  return Array.isArray(data?.stages) ? data.stages : [];
};