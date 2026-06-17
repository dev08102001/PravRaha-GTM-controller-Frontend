// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:9077/api",
// });

// export const createCampaign = async (payload) => {
//   const response = await API.post("/campaigns", payload);
//   return response.data;
// };
import api from "./api";

export const createCampaign = async (payload) => {
  const { data } = await api.post("/campaigns", payload);
  return data;
};