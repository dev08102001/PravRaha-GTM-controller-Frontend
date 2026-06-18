import api from "./api";

export const getICP = () =>
  api.get("/icp");

export const saveICP = (
  data
) =>
  api.post(
    "/icp",
    data
  );

export const getICPConfig =
  () =>
    api.get(
      "/icp-config"
    );