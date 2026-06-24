import api from "./api";

export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data;
};

export const updatePreferences = async (payload) => {
  const { data } = await api.put("/settings/preferences", payload);
  return data;
};

export const updateIntegrations = async (payload) => {
  const { data } = await api.put("/settings/integrations", payload);
  return data;
};

export const updateTeamAccess = async (payload) => {
  const { data } = await api.put("/settings/team-access", payload);
  return data;
};

export const updateEmailInfrastructure = async (payload) => {
  const { data } = await api.put("/settings/email-infrastructure", payload);
  return data;
};

export const saveSettings = async (payload) => {
  const { data } = await api.post("/settings", payload);
  return data;
};