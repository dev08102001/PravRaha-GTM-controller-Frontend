import api from "./api";

export const getMeetingAlert = async () => {
  const { data } = await api.get("/meeting-alert");
  return data;
};