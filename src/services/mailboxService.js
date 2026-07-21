import api from "./api";

export const getMailboxes = async () => {
  const { data } = await api.get("/mailboxes");
  return data;
};

export const getMailboxById = async (id) => {
  const { data } = await api.get(`/mailboxes/${id}`);
  return data;
};

export const createMailbox = async (payload) => {
  const { data } = await api.post("/mailboxes", payload);
  return data;
};

export const updateMailbox = async (id, payload) => {
  const { data } = await api.put(`/mailboxes/${id}`, payload);
  return data;
};

export const deleteMailbox = async (id) => {
  const { data } = await api.delete(`/mailboxes/${id}`);
  return data;
};
