import api from "./api";

export const getCompanies = async () => {
  const { data } = await api.get("/companies");
  return data;
};

// Live Top Target Companies from MongoDB (CompanyData + SignalData).
export const getTopCompanies = async (q = "") => {
  const { data } = await api.get("/companies/top", {
    params: {
      limit: 10,
      ...(q ? { q } : {}),
    },
  });
  return data;
};
