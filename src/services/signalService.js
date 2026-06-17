import api from "./api";

export const getSignals = async () => {
  const { data } = await api.get("/signals");
  return data;
};