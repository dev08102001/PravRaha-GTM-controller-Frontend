import api from "./api";

export const getOutreachMessages = async () => {
  const { data } = await api.get("/outreach");
  return data;
};

export const approveOutreachMessage = async (id) => {
  const { data } = await api.put(`/outreach/${id}/approve`);
  return data;
};

export const rejectOutreachMessage = async (id) => {
  const { data } = await api.put(`/outreach/${id}/reject`);
  return data;
};