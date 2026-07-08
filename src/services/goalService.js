import api from "./api";

export const getGoal = async () => {
  const response = await api.get("/goal");

  return response.data;
};

export const launchAgents = async (payload) => {
  const response = await api.post(
    "/goal/launch",
    payload
  );

  return response.data;
};