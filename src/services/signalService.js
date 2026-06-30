import api from "./api";

export const getSignals = async () => {
  const { data } = await api.get("/signals");
  return data;
};

// Live signal feed from the knowledge base, optionally filtered by a prompt.
export const getSignalFeed = async (q = "") => {
  const { data } = await api.get("/signal-feed", {
    params: q ? { q } : {},
  });
  return data;
};