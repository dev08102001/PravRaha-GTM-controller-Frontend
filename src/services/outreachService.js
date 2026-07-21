import api from "./api";

export const getOutreachMessages = async () => {
  const { data } = await api.get("/outreach");
  return data;
};

export const approveOutreachMessage = async (id) => {
  const { data } = await api.put(`/outreach/${id}/approve`);
  return data;
};

export const sendOutreachMessage = async (id, payload = {}) => {
  const { data } = await api.put(`/outreach/${id}/send`, payload);
  return data;
};

/** Update subject/body/email for a specific sequence step (0–6). */
export const updateOutreachSequenceStep = async (id, payload) => {
  const { data } = await api.put(`/outreach/${id}`, payload);
  return data;
};

export const rejectOutreachMessage = async (id) => {
  const { data } = await api.put(`/outreach/${id}/reject`);
  return data;
};

export const updateOutreachMessage = async (id, payload) => {
  const { data } = await api.put(`/outreach/${id}`, payload);
  return data;
};

export const deleteOutreachMessage = async (id) => {
  const { data } = await api.delete(`/outreach/${id}`);
  return data;
};

export const sendFollowUp = async (id, payload) => {
  const { data } = await api.put(`/outreach/${id}/follow-up`, payload);
  return data;
};

export const markReplied = async (id) => {
  const { data } = await api.put(`/outreach/${id}/reply`);
  return data;
};

/** Full outreach history for the Details drawer — single request. */
export const getOutreachDetails = async (id) => {
  const { data } = await api.get(`/outreach/${id}/details`);
  return data?.data || null;
};

export const getOutreachReplies = async (id) => {
  const { data } = await api.get(`/outreach/${id}/replies`);
  return data;
};

export const syncOutreachReplies = async (payload = {}) => {
  const { data } = await api.post("/outreach/sync-replies", payload);
  return data;
};

export const runDailyOutreach = async (payload = {}) => {
  const { data } = await api.post("/outreach/run-daily", payload);
  return data;
};

export const sendTestEmail = async (payload) => {
  const { data } = await api.post(`/outreach/test`, payload);
  return data;
};