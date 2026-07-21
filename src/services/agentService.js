import api from "./api";

export const getAgents = async () => {
  const { data } = await api.get("/agents");
  return data;
};

// Sends the client's prompt/goal. The backend extracts the relevant
// companies + signals from the database and returns AI-generated insights.
export const launchAgent = async (goal) => {
  const { data } = await api.post("/agents/launch", { goal });
  return data;
};