import api from "./api";

export const getICP = async () => {
  const res = await api.get("/icp");
  return res.data.data;
};

export const getICPConfig = async () => {
  const res = await api.get("/icp-config");
  return res.data.data.sections || [];
};

export const getTechStack = async () => {
  const res = await api.get("/tech-stack");
  return res.data.data || [];
};

export const saveICP = async (payload) => {
  const res = await api.post("/icp", payload);
  return res.data;
};

export const deleteICP = async () => {
  const res = await api.delete("/icp");
  return res.data;
};