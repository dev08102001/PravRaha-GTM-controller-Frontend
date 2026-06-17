import api from "./api";

export const getPipeline = async () => {
  const { data } = await api.get("/pipeline-board");
  return data;
};

export const getPipelineSummary = async () => {
  const { data } = await api.get("/pipeline-board");

  return Object.entries(data).map(([label, records]) => ({
    _id: label,
    label,
    value: Array.isArray(records) ? records.length : 0,
  }));
};