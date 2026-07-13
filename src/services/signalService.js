import api from "./api";

export const getSignals = async () => {
  const { data } = await api.get("/signals");
  return data;
};

// Live Signal Feed from MongoDB (same source as Top Target Companies).
export const getSignalFeed = async (q = "", options = {}) => {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  const source = options.source;

  const { data } = await api.get("/signal-feed", {
    params: {
      limit,
      offset,
      ...(source ? { source } : {}),
      ...(q ? { q } : {}),
    },
  });
  return data;
};

// Dashboard Live Signal Feed — streams from 6-K / 8-K / 10-K collections.
export const getFilingsSignalFeed = async ({
  limit = 10,
  offset = 0,
  q = "",
  source = "filings",
} = {}) => {
  return getSignalFeed(q, { limit, offset, source });
};

/** @deprecated Prefer getFilingsSignalFeed — kept for compatibility. */
export const getSixKSignalFeed = async ({
  limit = 10,
  offset = 0,
  q = "",
} = {}) => {
  return getFilingsSignalFeed({ limit, offset, q, source: "filings" });
};

// Save signal feed companies to MongoDB after the client finishes a search.
export const saveSignalFeed = async (query = "") => {
  const { data } = await api.post("/signal-feed/save", { query });
  return data;
};
