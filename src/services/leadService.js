import api from "./api";

export const getLeads = async () => {
  const { data } = await api.get("/leads");
  return data;
};

export const getLead = async (id) => {
  const { data } = await api.get(`/leads/${id}`);
  return data;
};

export const createLead = async (payload) => {
  const { data } = await api.post(
    "/leads",
    payload
  );
  return data;
};

export const updateLead = async (
  id,
  payload
) => {
  const { data } = await api.put(
    `/leads/${id}`,
    payload
  );
  return data;
};

export const updateLeadStatus = async (
  id,
  status
) => {
  const { data } = await api.patch(
    `/leads/${id}/status`,
    { status }
  );
  return data;
};

export const deleteLead = async (id) => {
  const { data } = await api.delete(
    `/leads/${id}`
  );
  return data;
};