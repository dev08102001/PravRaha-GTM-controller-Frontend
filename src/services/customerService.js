import api from "./api";

export const getCustomers = async () => {
  const { data } = await api.get("/customers");
  return data;
};

export const createCustomer = async (payload) => {
  const { data } = await api.post(
    "/customers",
    payload
  );
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(
    `/customers/${id}`
  );
  return data;
};

export const assignManager = async (
  customerId,
  managerId
) => {
  const { data } = await api.put(
    `/customers/${customerId}/manager`,
    {
      managerId,
    }
  );

  return data;
};