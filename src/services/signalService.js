import api from "./api";

export const getSignals = async () => {
  const { data } = await api.get("/signals");
  return data;
};

// Live Signal Feed from MongoDB (same source as Top Target Companies).
export const getSignalFeed = async (q = "") => {
  const { data } = await api.get("/signal-feed", {
    params: {
      limit: 20,
      ...(q ? { q } : {}),
    },
  });
  return data;
};

// Save signal feed companies to MongoDB after the client finishes a search.
export const saveSignalFeed = async (query = "") => {
  const { data } = await api.post("/signal-feed/save", { query });
  return data;
};
