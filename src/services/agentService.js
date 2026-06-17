import api from "./api";

export const getAgents = async () => {
  const { data } = await api.get("/agents");
  return data;
};